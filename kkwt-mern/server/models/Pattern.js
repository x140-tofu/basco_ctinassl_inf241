import mongoose from "mongoose";

const patternSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, default: "Crochet" },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Pattern", patternSchema);