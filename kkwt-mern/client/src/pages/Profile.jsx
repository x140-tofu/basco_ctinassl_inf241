import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile({ user, setUser }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    displayName: user?.displayName || "",
    username: user?.username || "",
    age: user?.age || "",
    email: user?.email || "",
    address: user?.address || "",
    mobileNumber: user?.mobileNumber || "",
    profileImage: user?.profileImage || "",
  });

  // Auto-fill from user prop & fetch latest saved profile from MongoDB on load/refresh
  useEffect(() => {
    const userId = user?._id || user?.id;
    if (!userId) {
      navigate("/login");
      return;
    }

    // Populate immediately from logged-in user state
    setForm((prev) => ({
      ...prev,
      displayName: user.displayName || prev.displayName,
      username: user.username || prev.username,
      age: user.age || prev.age,
      email: user.email || prev.email,
      address: user.address || prev.address,
      mobileNumber: user.mobileNumber || prev.mobileNumber,
      profileImage: user.profileImage || prev.profileImage,
    }));

    // Sync latest saved fields from MongoDB
    axios
      .get(`http://localhost:5000/api/users/${userId}`)
      .then((res) => {
        const dbUser = res.data;
        setForm({
          displayName: dbUser.displayName || "",
          username: dbUser.username || "",
          age: dbUser.age || "",
          email: dbUser.email || "",
          address: dbUser.address || "",
          mobileNumber: dbUser.mobileNumber || "",
          profileImage: dbUser.profileImage || "",
        });
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, [user?._id, user?.id]);

  // Handle image upload (converts to Base64 so it saves directly in MongoDB)
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, profileImage: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Save updated profile to MongoDB + sync localStorage & global user state
  const handleSave = async (e) => {
    e.preventDefault();
    const userId = user?._id || user?.id;
    if (!userId) return;

    try {
      const res = await axios.put(`http://localhost:5000/api/users/${userId}`, form);
      const updatedUser = res.data;

      // Update global user state & localStorage so changed username/email persists everywhere
      setUser(updatedUser);
      localStorage.setItem("kkwt_user", JSON.stringify(updatedUser));

      alert("Crocheter Information saved to MongoDB!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("kkwt_user");
    localStorage.removeItem("kkwt_token");
    localStorage.removeItem("kkwt_cart");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="profile-page-wrapper">
      {/* Keep your existing header/navbar markup here, wiring Logout to handleLogout */}

      <main className="profile-container">
        {/* LEFT: AVATAR UPLOAD / REMOVE */}
        <div className="profile-avatar-section">
          <div className="profile-avatar-circle">
            {form.profileImage ? (
              <img src={form.profileImage} alt="Profile" className="profile-avatar-img" />
            ) : (
              /* Your default SVG silhouette */
              <svg viewBox="0 0 24 24" fill="#e5e5e5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />

          <button
            type="button"
            className="pill-btn btn-plum"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload an Image
          </button>

          <button
            type="button"
            className="pill-btn btn-gray"
            onClick={handleRemoveImage}
          >
            Remove
          </button>
        </div>

        {/* RIGHT: CROCHETER INFORMATION CARD */}
        <div className="profile-card">
          <h2>Crocheter Information:</h2>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                placeholder="Enter Display Name..."
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              />
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter Username..."
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  placeholder="Enter Age..."
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                required
                placeholder="Enter Email..."
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                required
                placeholder="Enter Address..."
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Mobile Number *</label>
              <input
                type="tel"
                required
                placeholder="09XXXXXXXXX"
                value={form.mobileNumber}
                onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
              />
            </div>

            <div className="save-btn-wrap">
              <button type="submit" className="pill-btn btn-plum">
                SAVE
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}