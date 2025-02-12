import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database";
import projectRoutes from "./routes/projectRoutes";
import contactRoutes from "./routes/contactRoutes";
import languageRoutes from "./routes/languageRoutes";
import frameworkRoutes from "./routes/frameworkRoutes";
import technologyRoutes from "./routes/technologyRoutes";
import commentRoutes from "./routes/commentRoutes";
import aboutRoutes from "./routes/aboutRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import logger from './config/logger';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_DOMAIN }));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/projects", projectRoutes);
app.use("/contact", contactRoutes);
app.use("/languages", languageRoutes);
app.use("/frameworks", frameworkRoutes);
app.use("/technologies", technologyRoutes);
app.use("/comments", commentRoutes);
app.use("/about", aboutRoutes);
app.use("/services", serviceRoutes);

app.get("/", (req, res) => {
  res.send("Kiwi");
});

connectDB();

const PORT = process.env.PORT || 31415;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));