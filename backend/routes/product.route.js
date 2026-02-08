import express from "express";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getFeaturedProducts,
	getProductsByCategory,
	getRecommendedProducts,
	toggleFeaturedProduct,
	editProductDetails,
	claimWarranty,
	searchProduct,
	getPdpPage,
	updateProductQuantity,
	warrantyClaimsDashboard,
	updateWarrantyClaimStatus,
	fetchClearanceSaleProducts
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/clearance-sale", fetchClearanceSaleProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);
router.post("/id/:id", protectRoute, adminRoute, editProductDetails);
router.post("/warranty/claim", protectRoute, claimWarranty);
router.get("/search", searchProduct);
router.get("/:name", getPdpPage);
router.post("/quantity", protectRoute, updateProductQuantity);
router.get("/warranty/claim/dashboard", protectRoute, adminRoute, warrantyClaimsDashboard);
router.put("/warranty/claim/:claimId", protectRoute, adminRoute, updateWarrantyClaimStatus);

export default router;