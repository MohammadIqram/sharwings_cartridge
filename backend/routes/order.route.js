import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getCustomerOrderHistory, orderReturnAction, requestOrderReturn, getOrderReturnHistory, showAllOrders, orderReturnStatusChange, changeOrderStatus } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/history", protectRoute, getCustomerOrderHistory);
router.post("/return", protectRoute, requestOrderReturn);
router.get("/return/action", protectRoute, adminRoute, orderReturnAction);
router.get("/returns", protectRoute, adminRoute, getOrderReturnHistory);
router.get("/orders-all", protectRoute, adminRoute, showAllOrders);
router.put("/return/:orderId", protectRoute, adminRoute, orderReturnStatusChange);
router.put('/status/:orderId', protectRoute, adminRoute, changeOrderStatus);

export default router;