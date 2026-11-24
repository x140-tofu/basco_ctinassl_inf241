import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, default: "Guest" },
    items: [
      {
        name: String,
        price: Number,
        imageUrl: String,
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);