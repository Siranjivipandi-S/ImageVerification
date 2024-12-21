import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function Connection() {
  const mongoURL = process.env.MONGOURL;

  if (!mongoURL) {
    console.error("MongoDB URL is not defined in the environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Connection Error:", error.message);
    process.exit(1);
  }
}

export default Connection;
