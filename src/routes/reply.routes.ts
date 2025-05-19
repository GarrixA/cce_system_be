import express from "express";
import borrowController from "../controllers/reply.controller";
import athenticate from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "",
  athenticate.authenticateUser,
  athenticate.isAdmin,
  borrowController.create_reply
);

router.get("/", borrowController.get_all_replies);

router.get("/:id", borrowController.get_single_reply);

router.patch(
  "/:id",
  athenticate.authenticateUser,
  athenticate.isAdmin,
  borrowController.update_reply
);

// router.delete(
//   "/:id",
//   athenticate.authenticateUser,
//   borrowController.delete_borrow
// );

export default router;
