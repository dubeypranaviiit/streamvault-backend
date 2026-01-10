import Video from "../models/Video.js";
import { uploadToGCS } from "../utils/uploadToGCS.js";
import { startVideoProcessing } from "../utils/videoProcessor.js";

export const uploadVideoController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Video file required" });
    }
    if (!req.body.title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const { gcsPath } = await uploadToGCS(
      req.file,
      req.user.tenantId
    );
    const video = await Video.create({
      title: req.body.title,
      description: req.body.description || "",
      originalFileName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,

      storage: {
        provider: "gcs",
        filePath: gcsPath,
      },

      ownerId: req.user.id,
      tenantId: req.user.tenantId,

      processing: {
        status: "uploaded",
        progress: 0,
        sensitivityResult: "pending",
      },
    });
    startVideoProcessing(video, req.io);
    return res.status(201).json({
      message: "Video uploaded successfully",
      videoId: video._id,
    });

  } catch (error) {
    console.error("Video upload failed:", error);

    return res.status(500).json({
      message: "Failed to upload video",
      error: error.message,
    });
  }
};
