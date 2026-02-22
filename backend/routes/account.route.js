import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateProfile, changePassword, updateCustomerBillingAddress, resetPasswordInitiate, resetPasswordConfirm } from "../controllers/account.controller.js";

const router = express.Router();

router.post("/profile", protectRoute, updateProfile);
router.post("/profile/change-password", protectRoute, changePassword);
router.post("/profile/billing-address", protectRoute, updateCustomerBillingAddress);
router.post("/profile/forgot-password-initiate", resetPasswordInitiate);
router.post("/profile/reset-password-confirm", resetPasswordConfirm);

export default router;