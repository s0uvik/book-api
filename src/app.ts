import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

// Middleware to parse JSON requests (optional but recommended)
app.use(express.json());

// Routes
app.get("/", (req, res, next) => {
  res.json({ message: "Hi from node" });
});

// Global error handler
app.use(globalErrorHandler);

export default app;
