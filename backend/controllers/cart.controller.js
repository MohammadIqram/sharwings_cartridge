import prisma from "../lib/prisma.js";
import { redis } from "../lib/redis.js";

export const getCartProducts = async (req, res) => {
	try {
		const userId = req.user.id; // assuming auth middleware sets req.user

		// Fetch cart items for the logged-in user and include product details
		const cartItems = await prisma.cartItem.findMany({
			where: { userId },
			include: {
				product: true
			}
		});

		// Format response to merge product data with quantity
		const cartData = cartItems.map((item) => ({
			...item.product,
			quantity: item.quantity,
			cartItemId: item.id // optional but useful
		}));

		res.status(200).json(cartData);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId, quantity, _id, id } = req.body;
		const resolvedProductId = productId || _id || id;
		const userId = req.user.id;

		if (!resolvedProductId) {
			return res.status(400).json({ message: "Product ID is required" });
		}

		const product = await prisma.product.findUnique({
			where: { id: resolvedProductId },
			select: { quantity: true, id: true }
		});

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		const existingItem = await prisma.cartItem.findFirst({
			where: { userId, productId: resolvedProductId }
		});

		if (existingItem) {
			const newQuantity = existingItem.quantity + quantity;

			if (newQuantity > product.quantity) {
				return res.status(400).json({
					success: false,
					message: `Cannot add ${quantity} items. Only ${product.quantity - existingItem.quantity} more in stock.`
				});
			}

			// Update cart item
			await prisma.cartItem.update({
				where: { id: existingItem.id },
				data: { quantity: newQuantity }
			});
		} else {
			// New item
			// user.cartItems.push({_id: productId, quantity: quantity || 1});
			const qty = quantity || 1;
			if (qty > product.quantity) {
				return res.status(400).json({ message: `Only ${product.quantity} in stock.` });
			}

			await prisma.cartItem.create({
				data: {
					userId,
					productId: resolvedProductId,
					quantity: qty
				}
			});
		}
		res.status(200).json({
			success: true,
			message: "product added to cart successfully."
		});
	} catch (error) {
		console.log(error);
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const userId = req.user.id;

		if (!productId) {
			await prisma.cartItem.deleteMany({ where: { userId } });
		} else {
			// Original code: `user.cartItems = user.cartItems.filter((item) => item.id !== productId);`
			// Remove specific product from cart
			await prisma.cartItem.deleteMany({
				where: { userId, productId }
			});
		}

		const cartItems = await prisma.cartItem.findMany({ where: { userId } });
		res.json(cartItems);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantity } = req.body;
		const userId = req.user.id;

		if (quantity === 0) {
			await prisma.cartItem.deleteMany({ where: { userId, productId } });
		} else {
			const product = await prisma.product.findUnique({
				where: { id: productId },
				select: { quantity: true }
			});

			if (!product) {
				return res.status(404).json({ message: "Product not found" });
			}

			if (quantity > product.quantity) {
				return res
					.status(400)
					.json({ message: `Only ${product.quantity} in stock.` });
			}

			const item = await prisma.cartItem.findFirst({ where: { userId, productId } });
			if (item) {
				await prisma.cartItem.update({
					where: { id: item.id },
					data: { quantity }
				});
			} else {
				return res.status(404).json({ message: "Item not found in cart" });
			}
		}

		const cartItems = await prisma.cartItem.findMany({ where: { userId } });
		res.json(cartItems);
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addCustomerBillingAddress = async (req, res) => {
	try {
		if (!req.body) {
			return res.status(400).json({
				success: false,
				msg: "invalid form. Please enter all the necessary form fields."
			})
		}

		const updatedUser = await prisma.user.update({
			where: { id: req.user.id },
			data: { address: req.body } // Assuming body matches Json structure or is generic object
		});

		// update value in redis
		const sessionData = await redis.get(`session:${req.user.id}`);
		if (sessionData) {
			const session = JSON.parse(sessionData);
			session.address = req.body;
			await redis.set(`session:${req.user.id}`, JSON.stringify(session));
		}

		return res.status(200).json({
			success: true,
			message: "billing address udpated successfully."
		})
	} catch (error) {
		console.log("error in updating or adding billing address", error.message);
		res.status(500).json({ message: "server error", error: error.message });
	}
}

export const removeFromCart = async (req, res) => {
	try {
		const { productId } = req.params;
		const userId = req.user.id;

		if (!productId) {
			return res.status(400).json({
				success: false,
				message: "Product ID is required"
			});
		}
		console.log('klsdfj', productId);
		const deletedItem = await prisma.cartItem.deleteMany({
			where: {
				userId,
				productId
			}
		});

		if (deletedItem.count === 0) {
			return res.status(404).json({
				success: false,
				message: "Product not found in cart"
			});
		}

		res.status(200).json({
			success: true,
			message: "Product removed from cart"
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Server error",
			error: error.message
		});
	}
};