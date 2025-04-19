import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { keycloak, memoryStore } from './lib/keycloak-config';
import axios from 'axios';
import qs from 'qs';

declare global {
  namespace Express {
    interface Request {
      user?: { username: string };
      kauth?: {
        grant?: any;
      };
    }
  }

  namespace Express {
    interface SessionData {
      user?: { username: string };
    }
  }
}

const app = express();
const PORT = 4000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(
  session({
    secret: 'super-secret-key',
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

app.use(keycloak.middleware());

// Public route
app.get('/', (req, res) => {
  res.send('Welcome to the Play2Grow backend 🧠');
});

const REDIRECT_URI = 'http://localhost:4000/api/auth/callback/keycloak';

app.get('/api/login', (req, res) => {
  res.redirect(
    `http://localhost:8080/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/auth?client_id=${process.env.KEYCLOAK_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
  );
});

// Callback to receive user info
app.get('/api/auth/callback/keycloak', (req, res) => {
  (async () => {
    const { code } = req.query;

    if (!code) {
      res.status(400).send('Missing code');
      return;
    }

    try {
      const tokenRes = await axios.post(
        'http://localhost:8080/realms/play2grow/protocol/openid-connect/token',
        qs.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          client_id: process.env.KEYCLOAK_CLIENT_ID,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
    
      console.log('Token Response:', tokenRes.data); // Log token response
    
      const { access_token } = tokenRes.data;
    
      const userInfoRes = await axios.get(
        'http://localhost:8080/realms/play2grow/protocol/openid-connect/userinfo',
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
    
      console.log('User Info Response:', userInfoRes.data); // Log user info response
    
      const userInfo = userInfoRes.data;
    
      (req.session as any).user = {
        username: userInfo.preferred_username,
      };
    
      res.redirect('http://localhost:3000/profile');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('OAuth callback error:', err.response ? err.response.data : err.message);
      } else {
        console.error('OAuth callback error:', err);
      }
      res.status(500).send('OAuth failed');
    }
    
  })();
});

// Get logged-in user info
app.get('/api/user', (req, res) => {
  if ((req.session as Express.SessionData).user) {
    res.json((req.session as Express.SessionData).user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Logout
app.get('/api/logout', (req, res) => {
  req.session.destroy(() => {
    const logoutURL = `http://localhost:8080/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/logout?redirect_uri=http://localhost:3000`;
    res.redirect(logoutURL);
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
