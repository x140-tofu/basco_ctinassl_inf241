import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import patternRoutes from "./routes/patternRoutes.js";
import Pattern from "./models/Pattern.js";
import Order from "./models/Order.js";
import Cart from "./models/Cart.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/patterns", patternRoutes);

// Save a checked-out cart
app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// View all saved orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get logged-in user's cart
app.get("/api/users/:id/cart", async (req, res) => {
  try {
    const userCart = await Cart.findOne({ userId: req.params.id });
    res.json(userCart ? userCart.items : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save/update logged-in user's cart
app.put("/api/users/:id/cart", async (req, res) => {
  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: req.params.id },
      {
        userId: req.params.id,
        items: req.body.cart || [],
      },
      { new: true, upsert: true }
    );
    res.json(updatedCart.items);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an order by ID
app.delete("/api/orders/:id", async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully", deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const seedDefaultPatterns = async () => {
  const count = await Pattern.countDocuments();
  if (count === 0) {
    await Pattern.insertMany([
      {
        name: "Beanie",
        description: "a soft, close-fitting, brimless cap designed to sit snugly over the crown of the head.",
        price: 300,
        category: "beanie",
        imageUrl: "/images/shop_beanie.png",
      },
      {
        name: "Lavender",
        description: "a charming, handmade lavender bouquet crafted around a green-wrapped stem.",
        price: 350,
        category: "flowers",
        imageUrl: "/images/shop_flower.png",
      },
      {
        name: "Hair Clip",
        description: "handmade with soft cotton yarn, this charming crochet flower hair clip adds a sweet, vintage touch to any hairstyle.",
        price: 250,
        category: "accessories",
        imageUrl: "/images/shop_clip.png",
      },
    ]);
    console.log("Seeded default KKWT crochet patterns!");
  }
};

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await seedDefaultPatterns();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));