import multer from "multer";

const storage = multer.memoryStorage();

export const uploadVideo = multer({
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024, 
  },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files are allowed"));
    }
    cb(null, true);
  },
});
