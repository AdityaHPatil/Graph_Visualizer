import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "../src/routes/authRoutes.js";
import cookieParser from "cookie-parser";
import graphRouter from "../src/routes/graphRoutes.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));

app.use(authRouter);
app.use(graphRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});