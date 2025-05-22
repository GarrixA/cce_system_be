import express from "express";
import authRoutes from "./auth.routes";
import roleRoute from "./role.routes";
import categoryRoutes from "./category.routes";
import compRoutes from "./compliant.routes";
import organizationRoutes from "./organization.routes";
import compliantOrg from "./compliantOrganization.routes";
import replyRoutes from "./reply.routes";

const router = express.Router();

router.use("/", organizationRoutes);
router.use("/", roleRoute);
router.use("/users", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/compliants", compRoutes);
router.use("/compliantsorg", compliantOrg);
router.use("/", replyRoutes);

export default router;
