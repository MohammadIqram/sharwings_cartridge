import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateProfile, changePassword } from "../controllers/account.controller.js";

const router = express.Router();

router.post("/profile", protectRoute, updateProfile);
router.post("/profile/change-password", protectRoute, changePassword);

export default router;