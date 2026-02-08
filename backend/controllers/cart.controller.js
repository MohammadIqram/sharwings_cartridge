import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getCartProducts = async (req, res) => {
	try {
		const products = await Product.find({ _id: { $in: req.user.cartItems } });
		console.log(products);
		// add quantity for each product
		const cartItems = products.map((product) => {
			const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
			return { ...product.toJSON(), quantity: item.quantity };
		});
		console.log("cartItems:", cartItems);
		res.json(cartItems);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId, quantity } = req.body;
		const user = req.user;

		const existingItem = user.cartItems.find((item) => item.id === productId);
		const product = await Product.findById(productId).select('_id quantity').lean();
		if (!product) {
			return res.status(500).json({ message: "product not available. Try reloading the page.", error: error.message });
		}
		if (existingItem) {
			if (quantity > existingItem.quantity) {
				return res.status(500).json({ message: `there are only ${product.quantity} units in stock.`, error: `there are only ${product.quantity} units in stock.` });
			}
			existingItem.quantity += 1;
		} else {
			if (quantity > product.quantity) {
				return res.status(500).json({ message: `there are only ${product.quantity} units in stock.`, error: `there are only ${product.quantity} units in stock.` });
			}
			user.cartItems.push({_id: productId, quantity: quantity || 1});
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;
		if (!productId) {
			user.cartItems = [];
		} else {
			user.cartItems = user.cartItems.filter((item) => item.id !== productId);
		}
		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantity } = req.body;
		const user = req.user;
		const existingItem = user.cartItems.find((item) => item.id === productId);

		if (existingItem) {
			if (quantity === 0) {
				user.cartItems = user.cartItems.filter((item) => item.id !== productId);
				await user.save();
				return res.json(user.cartItems);
			}

			existingItem.quantity = quantity;
			await user.save();
			res.json(user.cartItems);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addCustomerBillingAddress = async (req, res) => {
	console.log('alsdfjlaksjfdlkajsdflkjaflkajsdf', req.body);
	try {
		if (!req.body) {
			return res.status(400).json({
				success: false,
				msg: "invalid form. Please enter all the necessary form fields."
			})
		}
		const result = await User.updateOne(
			{_id: req.user.id},
			{ $set: { address: req.body } }
		)
		if (result.modifiedCount === 0) {
			return res.status(400).json({
				success: false,
				msg: "could not update the billing address at the moment"
			});
		}
		return res.status(200).json({
			success: true,
			msg: "billing address udpated successfully."
		})
	} catch (error) {
		console.log("error in updating or adding billing address", error.message);
		res.status(500).json({message: "server error", error: error.message});
	}
}