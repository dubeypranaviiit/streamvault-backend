import Video from "../models/Video.js";
import { bucket } from "../config/gcs.js";
export const streamVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    
    if (video.processing.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Video is still being processed" });
    }
    if (video.processing.sensitivityResult === "flagged") {
  return res
    .status(403)
    .json({ message: "Video is flagged and cannot be streamed" });
}
    const isOwner = video.ownerId.toString() === req.user.id;
    const isShared = video.sharedWith.some(
      (id) => id.toString() === req.user.id
    );
    const isAdmin = req.user.role === "admin";

    if (
      video.tenantId.toString() !== req.user.tenantId ||
      (!isOwner && !isShared && !isAdmin)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
    const range = req.headers.range;
    if (!range) {
      return res.status(416).send("Range header required");
    }

    const file = bucket.file(video.storage.filePath);
    const [metadata] = await file.getMetadata();
    const fileSize = Number(metadata.size);

    const start = Number(range.replace(/\D/g, ""));
    const CHUNK_SIZE = 1024 * 1024; // 1MB
    const end = Math.min(start + CHUNK_SIZE - 1, fileSize - 1);
    const chunkSize = end - start + 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": video.mimeType,
    });

    file.createReadStream({ start, end }).pipe(res);
  } catch (error) {
    console.error("Video streaming error:", error);
    res.status(500).json({ message: "Streaming failed" });
  }
};
