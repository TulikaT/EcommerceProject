import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminUsers.css";
import { toast } from "react-toastify";
import Modal from "../../components/Modal"; 

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    phone: "",
    address: "",
    state: "",
  });

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchUsers = async () => {
    try {
      const config = getAuthConfig();
      const res = await axios.get("http://localhost:4000/api/admin/users", config);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users", error.response?.data || error);
      toast.error("Error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const config = getAuthConfig();
      await axios.delete(`http://localhost:4000/api/admin/users/${id}`, config);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user", error.response?.data || error);
      toast.error("Error deleting user");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "user",
      phone: user.phone || "",
      address: user.address || "",
      state: user.state || "",
    });
    setModalVisible(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
      phone: "",
      address: "",
      state: "",
    });
    setModalVisible(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = getAuthConfig();
    try {
      if (editingUser) {
        await axios.put(
          `http://localhost:4000/api/admin/users/${editingUser._id}`,
          formData,
          config
        );
        toast.success("User updated successfully");
      } else {
        await axios.post("http://localhost:4000/api/admin/users", formData, config);
        toast.success("User added successfully");
      }
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user", error.response?.data || error);
      toast.error("Error saving user");
    }
  };

  return (
    <div className="admin-users">
      <div className="admin-users-header">
        <h2>Manage Users</h2>
        <button className="add-user-btn" onClick={handleAdd}>
          Add User
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>State</th>
            <th>Role</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phone || ""}</td>
              <td>{u.address || ""}</td>
              <td>{u.state || ""}</td>
              <td>{u.role}</td>
              <td style={{ textAlign: "center" }}>
                <button className="edit-btn" onClick={() => handleEdit(u)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(u._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalVisible && (
        <Modal onClose={() => setModalVisible(false)}>
          <div className="user-form">
            <h3>{editingUser ? "Update User" : "Add New User"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder={editingUser ? "Password (leave blank to keep current)" : "Password"}
                value={formData.password}
                onChange={handleChange}
                required={!editingUser}
              />
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
              />
              <button type="submit" className={editingUser ? "edit-btn" : "add-btn"}>
                {editingUser ? "Update User" : "Add User"}
              </button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminUsers;
