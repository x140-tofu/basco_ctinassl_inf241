import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    username: { type: String },
    items: [
      {
        patternId: String,
        name: String,
        price: Number,
        imageUrl: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);