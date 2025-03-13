import Product from "../models/Product.js";
import { validationResult } from "express-validator";


export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};


export const addProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, description, price, category, images, stockCount, brand } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      images,      
      stockCount,
      brand,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error: error.message });
  }
};


export const updateProductAdmin = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, description, price, category, images, stockCount, brand } = req.body;

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.images = images ?? product.images;
    product.stockCount = stockCount ?? product.stockCount;
    product.brand = brand ?? product.brand;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

export const deleteProductAdmin = async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.json({ message: "Product removed" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting product", error: error.message });
    }
  };
  