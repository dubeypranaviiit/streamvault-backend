// import Video from "../models/Video.js";

// export const listVideos = async (req, res) => {
//   try {
//     const { status, mine } = req.query;
//     const query = {
//       tenantId: req.user.tenantId,
//     };
//     if (req.user.role === "viewer") {
//       query.sharedWith = req.user.id;
//     }
//     if (req.user.role !== "viewer") {
//       if (mine === "true") {
//         query.ownerId = req.user.id;
//       } else {
//         query.$or = [
//           { ownerId: req.user.id },
//           { sharedWith: req.user.id },
//         ];
//       }
//     }
//     if (status) {
//       query["processing.status"] = status;
//     }
//     const videos = await Video.find(query).sort({ createdAt: -1 });
//     res.json({ videos });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch videos" });
//   }
// };

import Video from "../models/Video.js";

export const listVideos = async (req, res) => {
  try {
    const { status, mine } = req.query;
    const query = {
      tenantId: req.user.tenantId,
    };
    if (req.user.role === "viewer") {
      query.sharedWith = req.user.id;
    } 
    else {
      if (mine === "true") {
        query.ownerId = req.user.id;
      } else {
        query.$or = [
          { ownerId: req.user.id },
          { sharedWith: req.user.id },
        ];
      }
    }
    if (status) {
      query["processing.status"] = status;
    }
    const videos = await Video.find(query).sort({ createdAt: -1 });
    res.json({ videos });
  } catch (error) {
    console.error("List videos error:", error);
    res.status(500).json({ message: "Failed to fetch videos" });
  }
};

