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
app.use(morgan("dev"));

// Routes
app.use(hotelRoutes);

// Error handling middleware

// Database connection
mongoose
  .connect(process.env.MONGODB_ATLAS_URI)
  .then(() => app.listen(8080, () => console.log("Server is running on :8080")))
  .catch((err) => console.error(err));
