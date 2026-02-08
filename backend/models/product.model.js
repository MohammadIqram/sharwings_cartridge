import { text } from "express";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			text: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			min: 0,
			required: true,
		},
		salePrice: {
			type: Number,
			min: 0,
			required: true,
		},
		image: {
			type: String,
			required: [true, "Image is required"],
		},
		category: {
			type: String,
			required: true,
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
		quantity: {
			type: Number,
			default: 0,
			min: 0,
		},
		closeOut: {
			type: Boolean,
			default: false,
		}
	},
	{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
