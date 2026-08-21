import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "../src/routes/authRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(authRouter);

const PORT = import.meta.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});