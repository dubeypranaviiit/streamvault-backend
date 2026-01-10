import { Storage } from "@google-cloud/storage";
import envFile from "./env.js";

const storage = new Storage({
  keyFilename:envFile.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: envFile.GCP_PROJECT_ID,
});

export const bucket = storage.bucket(envFile.GCP_BUCKET_NAME);
