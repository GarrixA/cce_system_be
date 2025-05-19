import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import athenticate from "../middlewares/authMiddleware";

const router = Router();

router.post(
  "/",
  athenticate.authenticateUser,
  athenticate.isAdmin,
  createCategory
);
router.get("/", athenticate.authenticateUser, getCategories);
router.get("/:id", athenticate.authenticateUser, getCategoryById);
router.patch(
  "/:id",
  athenticate.authenticateUser,
  athenticate.isAdmin,
  updateCategory
);
router.delete(
  "/:id",
  athenticate.authenticateUser,
  athenticate.isAdmin,
  deleteCategory
);

export default router;
