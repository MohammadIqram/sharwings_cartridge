import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkoutSuccess, createCheckoutSession, createCheckoutSessionRazorpay, razorpaySuccess, placeOrderWithCashOnDelivery } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", protectRoute, checkoutSuccess);
router.post("/create-checkout-session-razorpay", protectRoute, createCheckoutSessionRazorpay);
router.post("/razorpay-success", protectRoute, razorpaySuccess);
router.post("/cash-on-delivery", protectRoute, placeOrderWithCashOnDelivery);

export default router;
