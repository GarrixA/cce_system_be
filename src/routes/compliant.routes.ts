import express from "express";
import athenticate from "../middlewares/authMiddleware";
import itemController from "../controllers/compliant.controller";
import fileUpload from "../middlewares/multers";

const router = express.Router();

router.post(
  "",
  athenticate.authenticateUser,
  // athenticate.isAdmin,
  fileUpload.array("images"),
  itemController.createItem
);

router.get(
  "/",
  // athenticate.authenticateUser,
  // athenticate.isAdmin,
  itemController.getAllItems
);

router.get(
  "/:id",
  // athenticate.authenticateUser,
  itemController.getItemById
);

router.patch(
  "/:id",
  athenticate.authenticateUser,
  fileUpload.array("images", 3),
  itemController.updateItem
);

router.delete(
  "/:id",
  athenticate.authenticateUser,
  // athenticate.isAdmin,
  itemController.deleteItem
);

export default router;
