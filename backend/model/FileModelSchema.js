import mongoose from "mongoose";

const fileUploadSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  file1: {
    type: Buffer,
    required: true,
  },
  file2: {
    type: Buffer,
    required: true,
  },
  file3: {
    type: Buffer,
    required: true,
  },
  file1Status: {
    type: String,
    default: "pending",
  },
  file2Status: {
    type: String,
    default: "pending",
  },
  file3Status: {
    type: String,
    default: "pending",
  },
  file1Reason: {
    type: String,
  },
  file2Reason: {
    type: String,
  },
  file3Reason: {
    type: String,
  },
  OverAllStatus: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const fileScheme = mongoose.model("FileUpload", fileUploadSchema);
