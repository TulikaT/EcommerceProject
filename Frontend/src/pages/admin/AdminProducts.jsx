import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminProducts.css";
import { toast } from "react-toastify";

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

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    console.log("Auth token:", token); 
    return { headers: { Authorization: `Bearer ${token}` } };
  };

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
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
      rating:"",
    });
    setModalVisible(true);
  };

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

  const Modal = ({ children, onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );

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
            <th>Category</th>
            <th>Brand</th>
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
              <td>{prod.category}</td>
              <td>{prod.brand}</td>
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
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Image URL (comma separated if multiple)"
                value={formData.images}
                onChange={(e) =>
                  setFormData({ ...formData, images: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Stock Count"
                value={formData.stockCount}
                onChange={(e) =>
                  setFormData({ ...formData, stockCount: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Brand"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
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
