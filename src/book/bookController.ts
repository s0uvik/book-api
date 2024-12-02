import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import path from "node:path";
import fs from "node:fs";
import cloudinary from "../config/cloudinary";
import bookModel from "./bookModel";
import { AuthRequest } from "../middlewares/authenticate";

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

    const _req = req as AuthRequest;
    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
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

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;

  const book = await bookModel.findOne({ _id: bookId });
  if (!book) {
    return next(createHttpError(404, "Book not found"));
  }

  const _req = req as AuthRequest;
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, "Unauthorized"));
  }

  const files = req.files as { [filename: string]: Express.Multer.File[] };

  let completeCoverImage = "";
  if (files.coverImage) {
    const fileName = files.coverImage[0].filename;
    const coverMimeType = files.coverImage[0].mimetype.split("/").at(-1);

    const filepath = path.resolve(__dirname, "../../public/temp", fileName);

    completeCoverImage = fileName;

    const uploadResult = await cloudinary.uploader.upload(filepath, {
      filename_override: completeCoverImage,
      folder: "book-cover",
      format: coverMimeType,
    });

    completeCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filepath);
  }

  let completeFileName = "";
  if (files.file) {
    const fileName = files.file[0].filename;
    const filepath = path.resolve(__dirname, "../../public/temp", fileName);

    completeFileName = fileName;

    const uploadResult = await cloudinary.uploader.upload(filepath, {
      resource_type: "raw",
      filename_override: completeFileName,
      folder: "book-cover",
      format: "pdf",
    });

    completeFileName = uploadResult.secure_url;
    await fs.promises.unlink(filepath);
  }

  const updatedBook = await bookModel.findOneAndUpdate(
    { _id: bookId },
    {
      title,
      genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFileName ? completeFileName : book.file,
    },
    { new: true }
  );

  res.json({ status: "200", data: updatedBook });
};
