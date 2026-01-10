import express from "express";
import { uploadVideo } from "../middleware/uploadVideo.js";
import { uploadVideoController } from "../controllers/videoController.js";
import { protect,authorizeRoles } from "../middleware/auth.middleware.js";
import { streamVideo } from "../controllers/streamController.js";
import { listVideos } from "../controllers/videoListController.js";
import { editVideo } from "../controllers/videoEditController.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  authorizeRoles("editor", "admin"),
  uploadVideo.single("video"),
  uploadVideoController
);
router.get(
  "/:id/stream",
  protect,
  streamVideo
);
router.get("/", protect, listVideos);
router.put("/:id", protect,authorizeRoles("editor","admin"), editVideo);
export default router;
