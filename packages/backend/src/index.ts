import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { keycloak, memoryStore } from './lib/keycloak-config';
import axios from 'axios';
import qs from 'qs';

declare module 'express-session' {
  interface SessionData {
    user?: { username: string };
  }
}

const app = express();
const PORT = 4000;

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Cookies:', req.headers.cookie);
  next();
});

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Secure session configuration
app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false, // Changed to false for security
  store: memoryStore,
  cookie: {
    sameSite: 'lax',
    secure: false, // Set to true in production (HTTPS)
    httpOnly: true,
    maxAge: 86400000 // 1 day
  }
}));

app.use(keycloak.middleware());

// Public route
app.get('/', (req, res) => {
  res.send('Welcome to the Play2Grow backend 🧠');
});

const REDIRECT_URI = 'http://localhost:4000/api/auth/callback/keycloak';

// Login endpoint
app.get('/api/login', (req, res) => {
  const authUrl = `http://localhost:8080/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/auth?${qs.stringify({
    client_id: process.env.KEYCLOAK_CLIENT_ID,
    redirect_uri: 'http://localhost:4000/api/auth/callback/keycloak',
    response_type: 'code',
    scope: 'openid profile email',
    state: req.sessionID // Critical for security
  })}`;
  
  console.log('Redirecting to:', authUrl); // Debug
  res.redirect(authUrl);
});

// Callback handler
app.get('/api/auth/callback/keycloak', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) throw new Error('Authorization code missing');

    // Token exchange
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

    // Get user info
    const userRes = await axios.get(
      `http://localhost:8080/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
      { headers: { Authorization: `Bearer ${tokenRes.data.access_token}` } }
    );

    // Store user in session
    req.session.user = { username: userRes.data.preferred_username };
    await new Promise<void>((resolve, reject) => {
      req.session.save(err => err ? reject(err) : resolve());
    });

    res.redirect('http://localhost:3000/profile');
  } catch (err) {
    if (err instanceof Error) {
      console.error('OAuth error:', (err as any).response?.data || err.message);
    } else {
      console.error('OAuth error:', err);
    }
    res.status(500).send('Authentication failed');
  }
});

// User endpoint
app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Logout endpoint
app.get('/api/logout', (req, res) => {
  req.session.destroy(() => {
    const logoutUrl = `http://localhost:8080/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/logout?` +
      qs.stringify({ redirect_uri: 'http://localhost:3000' });
    res.redirect(logoutUrl);
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});