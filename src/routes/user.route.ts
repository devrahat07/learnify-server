import express from "express";
import {
  activateUser,
  loginUser,
  logoutUser,
  registrationUser,
  updateAccessToken,
} from "../controllers/user.controlle";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/register", registrationUser);
router.post("/activate-user", activateUser);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);
router.post("/refresh", updateAccessToken);

export default router;
