import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";

// Routes import
import hotelRoutes from "./routes/hotel";

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,POST",
  })
);
app.set("trust proxy", true); // to ensure req.ip always return true ip
app.use(morgan("dev"));

// Routes
app.use(hotelRoutes);

// Error handling middleware

// Database connection
const port = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGODB_ATLAS_URI)
  .then(() => app.listen(port, () => console.log(`Server is running on ${port}`)))
  .catch((err) => console.error(err));
