import express from "express";
import { addCustomerBillingAddress, addToCart, getCartProducts, removeAllFromCart, updateQuantity, removeFromCart } from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addToCart);
router.delete("/", protectRoute, removeAllFromCart);
router.put("/:id", protectRoute, updateQuantity);
router.post("/billing-address", protectRoute, addCustomerBillingAddress);
router.delete("/product/:productId", protectRoute, removeFromCart);

export default router;
