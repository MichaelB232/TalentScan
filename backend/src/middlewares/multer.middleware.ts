// src/middlewares/multer.middleware.ts
// Multer config for in-memory PDF upload (max 10 MB).

import multer from "multer";
import { UnsupportedFileError } from "../errors/AppError";

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter(_req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new UnsupportedFileError() as unknown as null, false);
    }
  },
}).single("cv");
