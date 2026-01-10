// import Video from "../models/Video.js";

// export const editVideo = async (req, res) => {
//   try {
//     const video = await Video.findById(req.params.id);

//     if (!video) {
//       return res.status(404).json({ message: "Video not found" });
//     }
//     if (video.tenantId.toString() !== req.user.tenantId) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     const isOwner = video.ownerId.toString() === req.user.id;
//     const isAdmin = req.user.role === "admin";

//     if (!isOwner && !isAdmin) {
//       return res.status(403).json({ message: "Not allowed to edit" });
//     }

//     const { title, description } = req.body;

//     if (title) video.title = title;
//     if (description) video.description = description;

//     await video.save();

//     res.json({
//       message: "Video updated successfully",
//       video,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to update video" });
//   }
// };
import Video from "../models/Video.js";

export const editVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    if (video.tenantId.toString() !== req.user.tenantId) {
      return res.status(403).json({ message: "Access denied" });
    }
    const isOwner = video.ownerId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed to edit" });
    }
    const { title, description } = req.body;
    if (typeof title === "string") {
      video.title = title;
    }
    if (typeof description === "string") {
      video.description = description;
    }
    await video.save();
    res.json({
      message: "Video updated successfully",
      video,
    });
  } catch (error) {
    console.error("Edit video error:", error);
    res.status(500).json({ message: "Failed to update video" });
  }
};
