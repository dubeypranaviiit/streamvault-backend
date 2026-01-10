import mongoose from "mongoose";
const connectDB = async (mongoUrl) => {
  if (!mongoUrl) {
    throw new Error("Mongo URL not provided");
  }
  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Error:", error.message);
    process.exit(1);
  }
};
export default connectDB;