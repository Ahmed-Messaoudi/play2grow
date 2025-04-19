// src/lib/keycloak-config.ts
import Keycloak from 'keycloak-connect';
import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

const memoryStore = new session.MemoryStore();

const keycloak = new Keycloak(
  { store: memoryStore },
  {
    realm: process.env.KEYCLOAK_REALM!,
    'auth-server-url': process.env.KEYCLOAK_BASE_URL!,
    resource: process.env.KEYCLOAK_CLIENT_ID!,
    credentials: {
      secret: process.env.KEYCLOAK_CLIENT_SECRET!,
    },
    'ssl-required': 'external',
    'confidential-port': 0,
  } as any // 👈 casting to `any` to avoid strict typing issues
);

export { keycloak, memoryStore };
