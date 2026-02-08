import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";
import razorpay from "../lib/razorpay.js";
import crypto from "crypto";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import EmailHelper from "../helpers/emailHelper.js";
import { orderSuccessTemplate } from "../templates/orders.js";

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100); // stripe wants u to send in the format of cents
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
			}
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			discounts: coupon
				? [
						{
							coupon: await createStripeCoupon(coupon.discountPercentage),
						},
				  ]
				: [],
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

		if (totalAmount >= 20000) {
			await createNewCoupon(req.user._id);
		}
		res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};

export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status === "paid") {
			if (session.metadata.couponCode) {
				await Coupon.findOneAndUpdate(
					{
						code: session.metadata.couponCode,
						userId: session.metadata.userId,
					},
					{
						isActive: false,
					}
				);
			}

			// create a new Order
			const products = JSON.parse(session.metadata.products);
			const newOrder = new Order({
				user: session.metadata.userId,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})),
				totalAmount: session.amount_total / 100, // convert from cents to dollars,
				stripeSessionId: sessionId,
			});

			await newOrder.save();

			res.status(200).json({
				success: true,
				message: "Payment successful, order created, and coupon deactivated if used.",
				orderId: newOrder._id,
			});
		}
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
};

export const razorpaySuccess = async (req, res) => {
    try {
		console.log("Razorpay success request body:", req.body);
        const { paymentId, orderId, signature } = req.body;

        // Verify signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_TOKEN_SECRET)
            .update(orderId + "|" + paymentId)
            .digest("hex");

        if (generatedSignature !== signature) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        // Fetch order notes for userId, couponCode, products
        const razorpayOrder = await razorpay.orders.fetch(orderId);
        const notes = razorpayOrder.notes;
        const userId = notes.userId;
        const couponCode = notes.couponCode;
        const products = JSON.parse(notes.products);

        // Deactivate coupon if used
        if (couponCode) {
            await Coupon.findOneAndUpdate(
                { code: couponCode, userId },
                { isActive: false }
            );
        }

        // Create new order
        const newOrder = new Order({
            user: userId,
            products: products.map((product) => ({
                product: product.id,
                quantity: product.quantity,
                price: product.price,
            })),
            totalAmount: razorpayOrder.amount / 100, // convert from paise to INR
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
			mode: "online", // Cash on Delivery
			address: req.user.address
        });

        await newOrder.save();
		// updating product quantities
		for (const product of products) {
			await Product.findByIdAndUpdate(
				product._id,
				{ $inc: { quantity: -product.quantity } },
			);
		}

        res.status(200).json({
            success: true,
            message: "Payment successful, order created, and coupon deactivated if used.",
            orderId: newOrder._id,
        });
    } catch (error) {
        console.error("Error processing Razorpay success:", error);
        res.status(500).json({ message: "Error processing Razorpay success", error: error.message });
    }
};

async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});

	return coupon.id;
}

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		userId: userId,
	});

	await newCoupon.save();

	return newCoupon;
}

export const createCheckoutSessionRazorpay = async (req, res) => {
    try {
        const { products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty products array" });
        }

		if (!req.user.address || !req.user?.address.name) {
			return res.status(400).json({ error: "User address is required for checkout" });
		}

        let totalAmount = 0;

        const items = products.map((product) => {
            const amount = Math.round(product.salePrice * 100); // Razorpay expects amount in paise
            totalAmount += amount * product.quantity;

            return {
                name: product.name,
                image: product.image,
                quantity: product.quantity || 1,
                price: amount,
            };
        });

        const order = await razorpay.orders.create({
            amount: totalAmount, // amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: req.user._id.toString(),
                products: JSON.stringify(
                    products.map((p) => ({
                        id: p._id,
                        quantity: p.quantity,
                        price: p.salePrice,
                    }))
                ),
            },
        });

		const productName = products.map(p=>p.name).join(", ");

	await User.updateOne(
			{ _id: req.user._id },
			{ $set: { cartItems: [] } }
		);
		const html = EmailHelper.renderTemplate(orderSuccessTemplate, {
			name: req.user?.name,
			orderId: order.id,
			orderItems: productName,
			totalAmount: totalAmount,
			address: req.user?.address,
			paymentMode: "Online Payment"
		});

		const emailHelper = new EmailHelper();
		await emailHelper.sendEmail({
			to: process.env.NODEMAILER_REVCIEVER,
			subject: 'new order recieved',
			text: "you have recieved a new order",
			html: html
		});
        res.status(200).json({ id: order.id, totalAmount: totalAmount / 100 });
    } catch (error) {
        console.error("Error processing checkout:", error);
        res.status(500).json({ message: "Error processing checkout", error: error.message });
    }
};


export const placeOrderWithCashOnDelivery = async (req, res) => {
    try {
        const { products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty products array" });
        }

		if (!req.user.address || !req.user?.address.name) {
			return res.status(400).json({ error: "User address is required for checkout" });
		}

        let totalAmount = 0;
        products.map((product) => {
            totalAmount += product.salePrice * product.quantity;

            return {
                name: product.name,
                image: product.image,
                quantity: product.quantity || 1,
                price: product.salePrice,
            };
        });
		const checkoutLineItems =  products.map((product) => ({
                product: product._id,
                quantity: product.quantity,
                price: product.price,
        }))
        const newOrder = new Order({
            user: req.user._id,
			products: checkoutLineItems,
            totalAmount: totalAmount, // convert from paise to INR
			mode: "cod", // Cash on Delivery
			address: req.user.address
        });
        await newOrder.save();
			const productName = products.map(p=>p.name).join(", ");
			const html = EmailHelper.renderTemplate(orderSuccessTemplate, {
			name: req.user?.name,
			orderId: newOrder._id,
			orderItems: productName,
			totalAmount: totalAmount,
			address: req.user?.address,
			paymentMode: "Cash on Delivery"
		});

		const emailHelper = new EmailHelper();
		emailHelper.logger();
		await emailHelper.sendEmail({
			to: process.env.NODEMAILER_REVCIEVER,
			subject: 'new order recieved',
			text: "you have recieved a new order",
			html: html
		});

	await User.updateOne(
			{ _id: req.user._id },
			{ $set: { cartItems: [] } }
		);
        res.status(200).json({ success: true, message: "Order placed successfully with Cash on Delivery" });
    } catch (error) {
        console.error("Error processing checkout:", error);
        res.status(500).json({ message: "Error processing checkout", error: error.message });
    }
};
