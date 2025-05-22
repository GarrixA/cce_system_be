import express from "express";
import {
  getCompliantsByOrganization,
  getSingleCompliantByOrganization,
} from "../controllers/compliantOrganization.controller";
import athenticate from "../middlewares/authMiddleware";

const router = express.Router();

router.get(
  "/organization",
  athenticate.authenticateUser,
  getCompliantsByOrganization
);

router.get(
  "/organization/:id",
  athenticate.authenticateUser,
  getSingleCompliantByOrganization
);

export default router;
