// utils/keycloak-admin.ts
import axios from 'axios';
import qs from 'qs';

export async function getAdminToken() {
  const response = await axios.post(
    'http://localhost:8080/realms/master/protocol/openid-connect/token',
    qs.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.KEYCLOAK_ADMIN_CLIENT_ID,
      client_secret: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET,
    }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );

  return response.data.access_token;
}
