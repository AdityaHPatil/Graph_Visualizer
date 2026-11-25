import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import {
  saveGraph,
  loadGraph,
  shareGraph,
} from "../controllers/graphController.js";

const router = express.Router();

router.post("/api/graphs", requireAuth, saveGraph);
router.get("/api/graphs/:id", requireAuth, loadGraph);
router.put("/api/graphs/:id", requireAuth, saveGraph);
router.post("/api/graphs/:id/owners", requireAuth, shareGraph);

export default router;
