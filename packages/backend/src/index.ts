import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { keycloak, memoryStore } from './lib/keycloak-config';
import axios from 'axios';
import qs from 'qs';
import { PrismaClient } from '@prisma/client';
import { getAdminToken } from './keycloak-admin';


const prisma = new PrismaClient();
const app = express();
const PORT = 4000;

declare module 'express-session' {
  interface SessionData {
    user?: { username: string };
  }
}

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false,
  store: memoryStore,
  cookie: {
    sameSite: 'lax',
    secure: false,
    httpOnly: true,
    maxAge: 86400000 // 1 day
  }
}));

app.use(keycloak.middleware());

const REDIRECT_URI = 'http://localhost:4000/api/auth/callback/keycloak';

app.get('/', (req, res) => {
  res.send('Welcome to the Play2Grow backend 🧠');
});

app.get('/api/login', (req, res) => {
  const authUrl = `http://localhost:8080/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/auth?${qs.stringify({
    client_id: process.env.KEYCLOAK_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid profile email',
    state: req.sessionID
  })}`;

  res.redirect(authUrl);
});

app.get('/api/auth/callback/keycloak', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) throw new Error('Authorization code missing');

    const tokenRes = await axios.post(
      `http://localhost:8080/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      qs.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const userRes = await axios.get(
      `http://localhost:8080/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
      { headers: { Authorization: `Bearer ${tokenRes.data.access_token}` } }
    );

    const keycloakId = userRes.data.sub;
    const username = userRes.data.preferred_username;
    const email = userRes.data.email;

    let user = await prisma.user.findUnique({ where: { keycloakId } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          keycloakId,
          username,
          email
        }
      });
    }

    req.session.user = { username: user.username ?? 'default-username' };
    await new Promise<void>((resolve, reject) => {
      req.session.save(err => err ? reject(err) : resolve());
    });

    res.redirect('http://localhost:3000/profile');
  } catch (err) {
    console.error('OAuth error:', (err as any).response?.data || err);
    res.status(500).send('Authentication failed');
  }
});

app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

app.get('/api/logout', (req, res) => {
  req.session.destroy(() => {
    const logoutUrl = `http://localhost:8080/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/logout?${qs.stringify({
      redirect_uri: 'http://localhost:3000'
    })}`;
    res.redirect(logoutUrl);
  });
});


app.post('/api/profile/update', express.json(), async (req, res): Promise<void> => {
  const { username, email } = req.body;

  if (!req.session.user) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  try {
    const adminToken = await getAdminToken();

    // Fetch Keycloak user ID from the Keycloak API using the username stored in session
    const users = await axios.get(
      `http://localhost:8080/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
        params: { username: req.session.user.username },
      }
    );

    const keycloakUser = users.data[0];
    if (!keycloakUser) throw new Error('User not found in Keycloak');

    // Update Keycloak user
    await axios.put(
      `http://localhost:8080/admin/realms/${process.env.KEYCLOAK_REALM}/users/${keycloakUser.id}`,
      {
        username,
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Update local DB if you’re using one
    // (assuming Prisma or similar)
    // await prisma.user.update({
    //   where: { keycloakId: keycloakUser.id },
    //   data: { username, email },
    // });

    res.json({ success: true });
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
