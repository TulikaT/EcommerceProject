import Wishlist from "../models/Wishlist.js";
import { validationResult } from "express-validator";

export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate("items.product");
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, items: [] });
      await wishlist.save();
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wishlist", error: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, items: [] });
    }

    const exists = wishlist.items.some(item => item.product.toString() === productId);
    if (exists) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }
    wishlist.items.push({ product: productId });
    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Failed to add to wishlist", error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    const initialCount = wishlist.items.length;
    wishlist.items = wishlist.items.filter(
      item => item.product.toString() !== productId
    );
    if (wishlist.items.length === initialCount) {
      return res
        .status(404)
        .json({ message: "Product not found in wishlist" });
    }
    await wishlist.save();

    wishlist = await Wishlist.findById(wishlist._id).populate("items.product");
    
    return res.json(wishlist);
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove from wishlist",
      error: error.message
    });
  }
};
