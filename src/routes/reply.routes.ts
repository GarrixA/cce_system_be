import express from "express";
import { createReply } from "../controllers/reply.controller";
import athenticate from "../middlewares/authMiddleware";

const router = express.Router();

// Route: POST /api/v1/replies
router.post("/replies", athenticate.authenticateUser, createReply);

export default router;
