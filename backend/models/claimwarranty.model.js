
import mongoose from "mongoose";

const claimWarrantySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        productName: {
            type: String,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        }
    },
    {
        timestamps: true,
    }
);

const ClaimWarranty = mongoose.model("claimwarranty", claimWarrantySchema);

export default ClaimWarranty;