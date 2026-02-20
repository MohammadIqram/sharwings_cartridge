import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateProfile, changePassword, updateCustomerBillingAddress } from "../controllers/account.controller.js";

const router = express.Router();

router.post("/profile", protectRoute, updateProfile);
router.post("/profile/change-password", protectRoute, changePassword);
router.post("/profile/billing-address", protectRoute, updateCustomerBillingAddress);

export default router;