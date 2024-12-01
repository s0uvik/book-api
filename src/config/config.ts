import { config as conf } from "dotenv";

conf(); // This will help to find  process.env

const _config = {
  port: process.env.PORT,
};

export const config = Object.freeze(_config); // This will make read only