const express = require("express");
const session = require("express-session");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const { sendEmail } = require("./mail");

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use(session({
  secret: "super-secret-key",
  resave: false,
  saveUninitialized: false,
}));

const KEYCLOAK_BASE = "http://localhost:8080/realms/play2grow/protocol/openid-connect";
const CLIENT_ID = "next";
const CLIENT_SECRET = process.env.KEYCLOAK_SECRET;
const REDIRECT_URI = "http://localhost:3001/callback";


// STEP 1: Redirect to Keycloak
app.get("/login", (req, res) => {
  const redirectUrl = `${KEYCLOAK_BASE}/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid`;
  res.redirect(redirectUrl);
});

// STEP 2: Handle callback and sync user
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  const tokenRes = await axios.post(`${KEYCLOAK_BASE}/token`, new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  }), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });

  const { access_token } = tokenRes.data;

  const userInfoRes = await axios.get(`${KEYCLOAK_BASE}/userinfo`, {
    headers: { Authorization: `Bearer ${access_token}` }
  });

  const {
    sub: keycloakId,
    email,
    given_name: firstName,
    family_name: lastName,
    name,
  } = userInfoRes.data;

  // Fallback: If Keycloak doesn't return firstName/lastName directly
  const [fallbackFirst, fallbackLast] = (name || "").split(" ");
  const finalFirstName = firstName || fallbackFirst || "";
  const finalLastName = lastName || fallbackLast || "";

  // Sync user in DB
  let user = await prisma.user.findUnique({ where: { keycloakId } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        keycloakId,
        email,
        firstName: finalFirstName,
        lastName: finalLastName,
        role: "parent", // or derive from Keycloak roles
      },
    });
  }
  console.log("Keycloak user info:", userInfoRes.data);


  req.session.user = user;
  res.redirect("http://localhost:3000/profile");
});

// Profile route
app.get("/me", (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Not logged in" });
  res.json(req.session.user);
});


app.put("/me", async (req, res) => {
  const sessionUser = req.session.user;
  if (!sessionUser) return res.status(401).json({ message: "Not authenticated" });

  const { firstName, lastName, email } = req.body;

  try {
    // Get admin token from Keycloak
    const tokenRes = await axios.post(
      "http://localhost:8080/realms/master/protocol/openid-connect/token",
      new URLSearchParams({
        grant_type: "password",
        client_id: "admin-cli",
        username: "admin",
        password: "admin", // replace with actual credentials
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const adminToken = tokenRes.data.access_token;

    // Update user in Keycloak
    await axios.put(
      `http://localhost:8080/admin/realms/play2grow/users/${sessionUser.keycloakId}`,
      {
        firstName,
        lastName,
        email
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Update user in DB
    const updatedUser = await prisma.user.update({
      where: { keycloakId: sessionUser.keycloakId },
      data: { firstName, lastName, email },
    });

    req.session.user = updatedUser; // update session
    res.json(updatedUser);
  } catch (err) {
    console.error("Failed to update user:", err);
    res.status(500).json({ message: "Update failed" });
  }
});


app.post('/api/children', async (req, res) => {
  const { name, email } = req.body;
  const parentId = req.session.user?.id; // assuming user is stored in session

  if (!parentId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const child = await prisma.user.create({
      data: {
        email,
        firstName: name,
        role: 'child',
        parent: { connect: { id: parentId } },
        keycloakId: `child-${Date.now()}-${Math.random()}`, // fake ID, not used for login
      },
    });
    res.status(201).json(child);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create child' });
  }
});


app.get('/api/children', async (req, res) => {
  const parentId = req.session.user?.id;

  if (!parentId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const children = await prisma.user.findMany({
      where: {
        parentId: parentId,
        role: 'child',
      },
    });

    res.json(children);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch children' });
  }
});




app.get("/quizzes/:id", async (req, res) => {
  const quizId = parseInt(req.params.id);

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (err) {
    console.error("Failed to fetch quiz:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



// POST /notifications
app.post("/notifications", async (req, res) => {
  const { userId, message } = req.body;

  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
      },
    });
    res.json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
});


// GET /notifications
app.get("/notifications", async (req, res) => {
  const sessionUser = req.session.user;
  if (!sessionUser) return res.status(401).json({ message: "Not authenticated" });

  const notifications = await prisma.notification.findMany({
    where: { userId: sessionUser.id },
    orderBy: { createdAt: "desc" },
  });

  res.json(notifications);
});



// PUT /notifications/:id/read
app.put("/notifications/:id/read", async (req, res) => {
  const { id } = req.params;

  const updated = await prisma.notification.update({
    where: { id: parseInt(id) },
    data: { isRead: true },
  });

  res.json(updated);
});

app.post("/notifications/test", async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.status(401).send("Not logged in");
  }

  try {
    const notification = await prisma.notification.create({
      data: {
        userId: user.id,
        message: "🎉 This is a test notification!",
        isRead: false,
      },
    });

    // ✅ Send email
    await sendEmail(
      user.email,
      "🎉 New Notification from Play2Grow",
      "You just received a new notification in your account.tasnim or any receiver of this email please DO NOT REPLY to this email as it is not monitored."
    );

    res.json(notification);
  } catch (error) {
    console.error("Failed to create test notification", error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/notifications/test", async (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  console.log("🔔 /notifications/test triggered for", user.email);
  try {
    console.log("📧 Preparing to send email to:", user.email);
    await sendEmail(
      user.email,
      "🎉 New Notification from Play2Grow",
      "You just received a new notification in your account Tasnim or any receiver of this email please DO NOT REPLY to this email as it is not monitored."
    );
    res.status(200).json({ message: "Notification triggered" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ message: "Failed to send notification" });
  }
});








// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect(`${KEYCLOAK_BASE}/logout?redirect_uri=http://localhost:3000`);

  });
});

app.listen(3001, () => console.log("✅ Backend running on http://localhost:3001"));
