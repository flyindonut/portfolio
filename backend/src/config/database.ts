import mongoose from "mongoose";
import dotenv from "dotenv";
import pino from 'pino';

dotenv.config();

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true
    }
  }
});

const connectDB = async (retries = 10, delay = 5000): Promise<void> => {
  while (retries) {
    try {
      await mongoose.connect(process.env.MONGO_URI as string);
      logger.info("MongoDB Atlas Connected");
      break;
    } catch (error) {
      logger.error("MongoDB Connection Error:", error);
      retries -= 1;
      logger.warn(`Retries left: ${retries}`);
      if (retries === 0) {
        logger.error("Could not connect to MongoDB. Exiting...");
        process.exit(1);
      }
      logger.info(`Retrying in ${delay / 1000} seconds...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

export default connectDB;