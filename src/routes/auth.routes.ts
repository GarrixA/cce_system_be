import express from "express";
import auth from "../controllers/auth.controller";
import { validate } from "../middlewares/signupMiddleware";
import { loginSchema } from "../validations/loginValidations";
import { signupSchema } from "../validations/signupValidations";
import athenticate from "../middlewares/authMiddleware";

const router = express.Router();

router.get(
  "/",
  // athenticate.authenticateUser,
  // athenticate.isAdmin,
  auth.getUsers
);
router.get(
  "/:id",
  athenticate.authenticateUser,
  athenticate.isAdmin,
  auth.getUserById
);
router.delete(
  "/:id",
  athenticate.authenticateUser,
  athenticate.isAdmin,
  auth.deleteUser
);
router.patch(
  "/:id",
  athenticate.authenticateUser,
  athenticate.isAdmin,
  auth.updateUser
);
router.post("/login", validate(loginSchema), auth.login);

router.post("/register", validate(signupSchema), auth.signup);

export default router;
