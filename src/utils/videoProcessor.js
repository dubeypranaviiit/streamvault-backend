// export const startVideoProcessing = async (video, io) => {
//   video.processing.status = "processing";
//   await video.save();
//   let progress = 0;
//   const interval = setInterval(async () => {
//     progress += 20;
//     video.processing.progress = progress;
//     await video.save();
//     io.to(video.ownerId.toString()).emit("video-progress", {
//       videoId: video._id,
//       progress,
//       status: "processing",
//     });
//     if (progress >= 100) {
//       clearInterval(interval);
//       video.processing.status = "safe"; 
//       video.processing.sensitivityResult = "safe";
//       video.processing.processedAt = new Date();
//       await video.save();

//       io.to(video.ownerId.toString()).emit("video-complete", {
//         videoId: video._id,
//         status: "safe",
//       });
//     }
//   }, 1000);
// };

const mockSensitivityAnalysis = (video) => {
  const text = `${video.title} ${video.description || ""}`.toLowerCase();
  const flaggedKeywords = ["violence", "blood", "abuse"];

  return flaggedKeywords.some(word => text.includes(word))
    ? "flagged"
    : "safe";
};

export const startVideoProcessing = async (video, io) => {
  video.processing.status = "processing";
  video.processing.progress = 0;
  video.processing.sensitivityResult = "pending";
  await video.save();

  let progress = 0;

  const interval = setInterval(async () => {
    progress += 20;

    video.processing.progress = progress;
    await video.save();

    io.to(video.ownerId.toString()).emit("video-progress", {
      videoId: video._id,
      progress,
      status: "processing",
    });

    if (progress >= 100) {
      clearInterval(interval);

      const sensitivityResult = mockSensitivityAnalysis(video);

      video.processing.status = "completed";
      video.processing.progress = 100;
      video.processing.sensitivityResult = sensitivityResult;
      video.processing.processedAt = new Date();

      await video.save();

      io.to(video.ownerId.toString()).emit("video-complete", {
        videoId: video._id,
        status: "completed",
        sensitivityResult,
      });
    }
  }, 1000);
};
