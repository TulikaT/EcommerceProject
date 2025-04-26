// src/pages/admin/AdminProducts.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminProducts.css";
import { toast } from "react-toastify";
import Modal from "../../components/Modal";

const statusStyles = {
  "In stock": { color: "green", fontWeight: "800" },
  low: { color: "orange", fontWeight: "800" },
  "out of stock": { color: "red", fontWeight: "800" },
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    images: "",
    stockCount: "",
    brand: "",
  });
  const [stockInputs, setStockInputs] = useState({});

  // Helper function to get Authorization config
  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Fetch all products from backend
  const fetchProducts = async () => {
    try {
      const config = getAuthConfig();
      const res = await axios.get("http://localhost:4000/api/admin/products", config);
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products", error.response?.data || error);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete a product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const config = getAuthConfig();
      await axios.delete(`http://localhost:4000/api/admin/products/${id}`, config);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product", error.response?.data || error);
      toast.error("Error deleting product");
    }
  };

  // Open modal for editing
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      images: product.images ? product.images.join(", ") : "",
      stockCount: product.stockCount || "",
      brand: product.brand || "",
    });
    setModalVisible(true);
  };

  // Open modal for adding a new product
  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      images: "",
      stockCount: "",
      brand: "",
    });
    setModalVisible(true);
  };

  // Handle form submit for adding/updating product
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      stockCount: Number(formData.stockCount),
      images:
        typeof formData.images === "string"
          ? formData.images.split(",").map((img) => img.trim())
          : formData.images,
    };

    try {
      const config = getAuthConfig();
      if (editingProduct) {
        await axios.put(
          `http://localhost:4000/api/admin/products/${editingProduct._id}`,
          payload,
          config
        );
        toast.success("Product updated successfully");
      } else {
        await axios.post("http://localhost:4000/api/admin/products", payload, config);
        toast.success("Product added successfully");
      }
      setModalVisible(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product", error.response?.data || error);
      toast.error("Error saving product");
    }
  };

  // Handle updating stock for a particular product
  const handleStockChange = (id, value) => {
    setStockInputs({ ...stockInputs, [id]: value });
  };

  const handleStockUpdate = async (id) => {
    const newStock = stockInputs[id];
    if (newStock === undefined || newStock === "") {
      toast.error("Please enter a valid stock value.");
      return;
    }
    try {
      const config = getAuthConfig();
      await axios.post(`http://localhost:4000/api/products/${id}/updateStock`, { newStock }, config);
      toast.success("Stock updated successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error updating stock", error.response?.data || error);
      toast.error("Error updating stock");
    }
  };

  return (
    <div className="admin-products">
      <div className="admin-products-header">
        <h2>Manage Products</h2>
        <button className="add-product-btn" onClick={handleAdd}>
          Add Product
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Update Stock</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod._id}>
              <td>
                <img
                  src={
                    prod.images && prod.images.length > 0
                      ? prod.images[0]
                      : "https://via.placeholder.com/100?text=No+Image"
                  }
                  alt={prod.name}
                  className="product-img"
                />
              </td>
              <td>{prod.name}</td>
              <td>${prod.price}</td>
              <td>{prod.stockCount}</td>
              <td style={statusStyles[prod.status] || {}}>{prod.status}</td>
              <td>{prod.category}</td>
              <td>{prod.brand}</td>
              <td>
  <input
    type="number"
    placeholder="New stock"
    value={stockInputs[prod._id] || ""}
    onChange={(e) => handleStockChange(prod._id, e.target.value)}
    // Inline style for a modern look
    style={{
      width: "90px",
      padding: "6px 8px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      backgroundColor: "#f9f9f9",
      fontSize: "0.9rem",
      marginRight: "6px",
      outline: "none",
    }}
  />
  <button
    onClick={() => handleStockUpdate(prod._id)}
    // Inline style for the update button
    style={{
      padding: "6px 12px",
      border: "none",
      borderRadius: "6px",
      backgroundColor: "#8e2de2",
      color: "white",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    }}
    onMouseOver={(e) => (e.target.style.backgroundColor = "#7a1cd7")}
    onMouseOut={(e) => (e.target.style.backgroundColor = "#8e2de2")}
  >
    Update
  </button>
</td>

              <td style={{ textAlign: "center" }}>
                <button className="edit-btn" onClick={() => handleEdit(prod)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(prod._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalVisible && (
        <Modal onClose={() => setModalVisible(false)}>
          <div className="product-form">
            <h3>{editingProduct ? "Update Product" : "Add New Product"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Image URL (comma separated if multiple)"
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              />
              <input
                type="number"
                placeholder="Stock Count"
                value={formData.stockCount}
                onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
              <button type="submit" className={editingProduct ? "edit-btn" : "add-btn"}>
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminProducts;

