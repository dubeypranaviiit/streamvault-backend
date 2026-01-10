import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    originalFileName: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    duration: Number,

    storage: {
      provider: {
        type: String,
        enum: ["local", "s3", "gcs"],
        default: "local",
      },
      filePath: {
        type: String,
        required: true,
      },
    },

    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    processing: {
      status: {
        type: String,
        enum: ["uploaded", "processing", "completed", "failed"],
        default: "uploaded",
      },

      progress: {
        type: Number,
        default: 0,
      },

      sensitivityResult: {
        type: String,
        enum: ["pending", "safe", "flagged"],
        default: "pending",
      },

      error: String,

      processedAt: Date,
    },

    streaming: {
      optimized: {
        type: Boolean,
        default: false,
      },
      formats: [
        {
          resolution: String,
          filePath: String,
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
