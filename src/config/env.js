import dotenv from "dotenv";

dotenv.config();
const envFile = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  GCP_PROJECT_ID: process.env.GCP_PROJECT_ID,
  GCP_BUCKET_NAME:process.env.GCP_BUCKET_NAME
};
if (!envFile.MONGO_URL) {
  throw new Error(" MONGO_URL is missing in environment variables");
}
export default envFile;
