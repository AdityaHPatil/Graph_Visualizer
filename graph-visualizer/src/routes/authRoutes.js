import {login, signup, me, logout} from "../controllers/authController.js";
import express from "express";

const router=express.Router();

router.post("/api/auth/signup",signup);

router.post("/api/auth/login",login);

router.get("/api/auth/me",me);

router.post("/api/auth/logout",logout);

export default router;

