import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import userModel from "./userModel";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  // validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  // DB call
  const user = await userModel.findOne({ email });
  if (user) {
    const error = createHttpError(400, "Email id already exist");
    return next(error);
  }

  // Password hash
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  // Token generation
  const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
    expiresIn: "7d",
  });

  // Response
  res
    .status(201)
    .json({ message: "User Created", userId: newUser._id, accessToken: token });
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  // DB call
  const user = await userModel.findOne({ email });
  if (!user) {
    const error = createHttpError(400, "User not found");
    return next(error);
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return next(createHttpError(400, "Incorrect password"));
  }

  // Token generation
  const token = sign({ sub: user._id }, config.jwtSecret as string, {
    expiresIn: "7d",
  });

  // Response
  res.json({
    message: "Successfully login",
    userId: user._id,
    accessToken: token,
  });
};
