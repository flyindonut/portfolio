import mongoose from "mongoose";
import dotenv from "dotenv";
import pino from "pino";

dotenv.config();

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: { colorize: true },
  },
});

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    logger.info("MongoDB Atlas Connected");
  } catch (error) {
    logger.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;