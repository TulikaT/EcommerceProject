import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthProvider";
import { toast } from "react-toastify";
import "./UserProfile.css";

const UserProfile = () => {
  const { user, login } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setUserData(user);
      if (user.profileImage) setProfilePreview(user.profileImage);
      if (user.coverImage) setCoverPreview(user.coverImage);
    } else {
      fetchProfile();
    }
  }, [user]);

  const SERVER_URL = "http://localhost:4000";

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${SERVER_URL}/api/auth/profile`, config);
      setUserData(res.data);
      if (res.data.profileImage) setProfilePreview(res.data.profileImage);
      if (res.data.coverImage) setCoverPreview(res.data.coverImage);
      login(res.data, token);
    } catch (error) {
      if(user){
      console.error("Error fetching profile", error);
      toast.error("Error fetching profile");
      }
    }
  };

  const handleProfileClick = () => {
    if (profileInputRef.current) profileInputRef.current.click();
  };

  const handleCoverClick = () => {
    if (coverInputRef.current) coverInputRef.current.click();
  };

  const handleProfileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const formData = new FormData();
    formData.append("profileImage", file);
    try {
      const res = await axios.put(`${SERVER_URL}/api/auth/profile`, formData, config);
      toast.success("Profile image updated");
      setUserData(res.data);
      setProfilePreview(res.data.profileImage);
      login(res.data, token);
    } catch (error) {
      console.error("Error updating profile image", error);
      toast.error("Error updating profile image");
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const formData = new FormData();
    formData.append("coverImage", file);
    try {
      const res = await axios.put(`${SERVER_URL}/api/auth/profile`, formData, config);
      toast.success("Cover image updated");
      setUserData(res.data);
      setCoverPreview(res.data.coverImage);
      login(res.data, token);
    } catch (error) {
      console.error("Error updating cover image", error);
      toast.error("Error updating cover image");
    }
  };

  if (!userData) {
    return <p>Loading profile...</p>;
  }

  const displayName = userData.name
    ? userData.name.charAt(0).toUpperCase() + userData.name.slice(1)
    : "";

  return (
    <div className="user-profile">
    <div className="cover-image-container" onClick={handleCoverClick}>
      {coverPreview ? (
        <img src={coverPreview} alt="Cover" className="cover-image" />
      ) : (
        <div className="cover-placeholder">Click to upload cover image</div>
      )}
      <input
        type="file"
        accept="image/*"
        ref={coverInputRef}
        style={{ display: "none" }}
        onChange={handleCoverChange}
      />
    </div>

    <div className="profile-image-container" onClick={handleProfileClick}>
      {profilePreview ? (
        <img src={profilePreview} alt="Profile" className="profile-image" />
      ) : (
        <div className="profile-placeholder">Click to upload profile image</div>
      )}
      <input
        type="file"
        accept="image/*"
        ref={profileInputRef}
        style={{ display: "none" }}
        onChange={handleProfileChange}
      />
    </div>

    <div className="profile-info">
      <h2>{displayName}</h2>
      <div className="profile-table-container">
        <table className="profile-table">
          <tbody>
            <tr>
              <th>Email</th>
              <td>{userData.email}</td>
            </tr>
            {userData.phone && (
              <tr>
                <th>Phone</th>
                <td>{userData.phone}</td>
              </tr>
            )}
            {userData.address && (
              <tr>
                <th>Address</th>
                <td>{userData.address}</td>
              </tr>
            )}
            {userData.state && (
              <tr>
                <th>State</th>
                <td>{userData.state}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  );
};

export default UserProfile;