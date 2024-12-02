import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import path from "node:path";
import fs from "node:fs";
import bookModel from "./bookModel";

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, genre } = req.body;
  try {
    const files = req.files as { [fileName: string]: Express.Multer.File[] };
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const fileName = files.coverImage[0].filename;
    const filepath = path.resolve(__dirname, "../../public/temp", fileName);

    const uploadResult = await cloudinary.uploader.upload(filepath, {
      filename_override: fileName,
      folder: "book-cover",
      format: coverImageMimeType,
    });

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/temp",
      bookFileName
    );

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdf",
        format: "pdf",
      }
    );

    const newBook = await bookModel.create({
      title,
      genre,
      author: "674c0f101dbce65682521e6c",
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    // delete temp files
    await fs.promises.unlink(filepath);
    await fs.promises.unlink(bookFilePath);

    res.status(201).json({ message: "Book Created", bookId: newBook._id });
  } catch (error) {
    return next(createHttpError(500, "Error, uploading files"));
  }
};
