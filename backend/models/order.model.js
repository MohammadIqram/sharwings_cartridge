import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				price: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],
		totalAmount: {
			type: Number,
			required: true,
			min: 0,
		},
		razorpayPaymentId: {
			type: String,
			unique: true,
		},
		razorpayOrderId: {
			type: String,
			unique: true,
		},
		returnRequest: {
			reason: { type: String, default: '' },
			description: { type: String, default: '' },
			return: {type: Boolean, default: false},
			status: {
			type: String,
			enum: ['None', 'Requested', 'Approved', 'Rejected', 'Completed'],
			default: 'None'
		},
		requestedAt: { type: Date },
		processedAt: { type: Date },
  	},
	address: {},
		mode: {
			type: String,
			enum: ['cod', 'online'],
			default: 'cod',
			required: true
		},
	status: {
		type: String,
		enum: ["pending", "processed", "shipped", "delivered", "cancelled"],
		default: "pending",
	},
	},
	{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
