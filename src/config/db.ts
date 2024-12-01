import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database Connected...");
    });
    mongoose.connection.on("error", (error) => {
      console.log("Database Connection Failed", error);
    });
    await mongoose.connect(config.databaseUrl as string);
  } catch (error) {
    console.error("Failed to connect db", error);
    process.exit(1);
  }
};
export default connectDB;
