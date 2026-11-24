import express from "express";
import Pattern from "../models/Pattern.js";

const router = express.Router();

// CREATE a new pattern
router.post("/", async (req, res) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;
    const pattern = await Pattern.create({ name, description, price, category, imageUrl });
    res.status(201).json(pattern);
  } catch (error) {
    res.status(400).json({ message: "Failed to create pattern", error: error.message });
  }
});

// READ all patterns (with optional search query)
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const query = search
      ? { name: { $regex: search, $options: "i" } }
      : {};
    const patterns = await Pattern.find(query).sort({ createdAt: 1 });
    res.json(patterns);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patterns", error: error.message });
  }
});

// UPDATE a pattern
router.put("/:id", async (req, res) => {
  try {
    const updated = await Pattern.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Pattern not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Failed to update pattern", error: error.message });
  }
});

// DELETE a pattern
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Pattern.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Pattern not found" });
    res.json({ message: "Pattern deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete pattern", error: error.message });
  }
});

export default router;