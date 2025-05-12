const express = require("express");
const session = require("express-session");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

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

  const { sub: keycloakId, email, name } = userInfoRes.data;

  // Sync user in DB
  let user = await prisma.user.findUnique({ where: { keycloakId } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        keycloakId,
        email,
        name,
        role: "parent", // default, can update later
      }
    });
  }

  req.session.user = user;
  res.redirect("http://localhost:3000/profile");
});

// Profile route
app.get("/me", (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Not logged in" });
  res.json(req.session.user);
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect(`${KEYCLOAK_BASE}/logout?redirect_uri=http://localhost:3000`);
    
  });
});

app.listen(3001, () => console.log("✅ Backend running on http://localhost:3001"));
