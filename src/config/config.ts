import { config as conf } from "dotenv";

conf(); // This will help to find  process.env

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
};

export const config = Object.freeze(_config); // This will make read only
