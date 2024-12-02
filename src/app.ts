import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRoute";

const app = express();

// Middleware to parse JSON requests (optional but recommended)
app.use(express.json());

// Routes
app.get("/", (req, res, next) => {
  res.json({ message: "Hi from node" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;
