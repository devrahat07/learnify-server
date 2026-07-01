import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getNotification } from "../controllers/notification.controller";

const router = express.Router();

router.get(
  "/get-all-notiications",
  isAuthenticated,
  authorizeRoles("admin"),
  getNotification,
);

export default router;
