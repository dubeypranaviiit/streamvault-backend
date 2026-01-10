import { bucket } from "../config/gcs.js";
export const uploadToGCS = async (file, tenantId) => {
  const fileName = `${tenantId}/${Date.now()}-${file.originalname}`;
  const blob = bucket.file(fileName);
  return new Promise((resolve, reject) => {
    const stream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });
    stream.on("error", reject);
    stream.on("finish", () => {
      resolve({
        gcsPath: fileName,
        publicUrl: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
      });
    });

    stream.end(file.buffer);
  });
};
