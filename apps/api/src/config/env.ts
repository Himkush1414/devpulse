import dotenv from 'dotenv';
dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

export const env = {
  port: parseInt(process.env.PORT || '4000', 10),
  databaseUrl: required('DATABASE_URL'),
  jwtSecret: required('JWT_SECRET'),
  whatsapp: {
    apiUrl: process.env.WHATSAPP_API_URL || '',
    apiToken: process.env.WHATSAPP_API_TOKEN || '',
    recipient: process.env.WHATSAPP_ALERT_RECIPIENT || '',
  },
};
