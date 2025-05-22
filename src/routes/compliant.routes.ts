import express from "express";
import {
  assignCompliantOrganization,
  createCompliant,
  getCompliantById,
  getCompliants,
  getCompliantsByOrganization,
} from "../controllers/compliant.controller";
import athenticate from "../middlewares/authMiddleware";
import {
  isCompliantIdValid,
  isCompliantValid,
} from "../middlewares/compliantMiddleware";
import fileUpload from "../middlewares/multers";

const router = express.Router();

router.post("/", fileUpload.array("images"), isCompliantValid, createCompliant);

router.get("/", getCompliants);

router.get(
  "/compliants/organization",
  athenticate.authenticateUser,
  getCompliantsByOrganization
);

router.get("/:id", isCompliantIdValid, getCompliantById);

router.patch(
  "/:compliantId/assign-organization",
  // isCompliantIdValid,
  assignCompliantOrganization
);

export default router;
