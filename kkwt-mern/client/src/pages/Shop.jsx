import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/patterns";

export default function Shop({ user, setUser, cart, setCart, isAdminMode = false }) {
  const [patterns, setPatterns] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });
  const navigate = useNavigate();

  // Show CRUD controls if on /admin route OR logged in as "admin"
  const canManage = isAdminMode || user?.username?.toLowerCase() === "admin";

  const fetchPatterns = async (query = "") => {
    const res = await axios.get(`${API_URL}?search=${encodeURIComponent(query)}`);
    setPatterns(res.data);
  };

  useEffect(() => {
    fetchPatterns(search);
  }, [search]);

  const handleLogout = () => {
    localStorage.removeItem("kkwt_user");
    localStorage.removeItem("kkwt_token");
    localStorage.removeItem("kkwt_cart");
    setUser(null);
    navigate("/login");
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm({ name: "", description: "", price: "", imageUrl: "/images/shop_beanie.png" });
    setShowModal(true);
  };

  const openEditModal = (pattern) => {
    setEditingId(pattern._id);
    setForm({
      name: pattern.name,
      description: pattern.description,
      price: pattern.price,
      imageUrl: pattern.imageUrl,
    });
    setShowModal(true);
  };

  const handleSavePattern = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    if (editingId) {
      await axios.put(`${API_URL}/${editingId}`, payload);
    } else {
      await axios.post(API_URL, payload);
    }
    setShowModal(false);
    fetchPatterns(search);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this crochet pattern?")) return;
    await axios.delete(`${API_URL}/${id}`);
    fetchPatterns(search);
  };

  const handleAddToCart = (pattern) => {
    const cartItem = {
      patternId: pattern._id,
      name: pattern.name,
      price: pattern.price,
      imageUrl: pattern.imageUrl,
    };
    setCart((prev) => [...prev, cartItem]);
    alert(`Added "${pattern.name}" to your cart!`);
  };

  return (
    <div className="shop-page-wrapper">
      {/* TOP BAR */}
      <header className="shop-navbar">
        <div className="shop-nav-left">
          <Link to="/" className="brand-logo">
            <img src="/images/logo.png" alt="KKWT Logo" className="logo-img" />
            <span>KKWT</span>
          </Link>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search pattern..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9e858d" strokeWidth="2.3">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <a href="#about">About</a>
          <NavLink to="/shop">Shop</NavLink>
          <a href="#blog">Blog</a>

          {user ? (
            <button onClick={handleLogout} className="pill-btn btn-plum">
              {user.username}
            </button>
          ) : (
            <Link to="/signup" className="pill-btn btn-plum">
              Sign Up
            </Link>
          )}
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="shop-container">
        <div className="shop-header-row">
          <h1 className="shop-title">
            {canManage ? "Manage Crochet Patterns (Admin)" : "Crochet Patterns"}
          </h1>

          <div className="shop-header-actions">
            {canManage && (
              <button className="crud-add-btn" onClick={openCreateModal}>
                + Add Pattern
              </button>
            )}

            <button
              className="cart-header-btn"
              title="View Cart"
              onClick={() => navigate("/cart")}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#723d4e">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7.17 14.75l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 20 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25z" />
              </svg>
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </button>
          </div>
        </div>

        {/* 3-COLUMN CARDS GRID */}
        <div className="patterns-grid">
          {patterns.map((item) => (
            <div className="pattern-card" key={item._id}>
              <div>
                <div className="pattern-img-frame">
                  <img src={item.imageUrl} alt={item.name} />
                </div>
                <h3>{item.name}</h3>
                <p className="pattern-desc">{item.description}</p>
              </div>

              <div>
                <div className="pattern-footer">
                  <span className="pattern-price">₱{item.price}</span>
                  <div className="card-actions">
                    <button
                      className="cart-plus-btn"
                      title="Add to Cart"
                      onClick={() => handleAddToCart(item)}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8a6c75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="20" r="1.5" />
                        <circle cx="18" cy="20" r="1.5" />
                        <path d="M2 3h3l2.4 11.2a1 1 0 0 0 1 .8h9.8a1 1 0 0 0 .97-.76L21 7H6" />
                        <line x1="13" y1="2" x2="13" y2="6" />
                        <line x1="11" y1="4" x2="15" y2="4" />
                      </svg>
                    </button>
                    <button
                      className="pill-btn btn-plum buy-now-btn"
                      onClick={() => handleAddToCart(item)}
                    >
                      Buy now!
                    </button>
                  </div>
                </div>

                {/* ONLY VISIBLE IN ADMIN VIEW */}
                {canManage && (
                  <div className="crud-bar">
                    <button className="crud-btn" onClick={() => openEditModal(item)}>
                      Edit
                    </button>
                    <button className="crud-btn delete" onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* CREATE / EDIT PATTERN MODAL (ADMIN ONLY) */}
      {canManage && showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h2 style={{ marginBottom: "1rem" }}>
              {editingId ? "Edit Crochet Pattern" : "Add Crochet Pattern"}
            </h2>
            <form onSubmit={handleSavePattern}>
              <div className="form-group">
                <label>Pattern Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Beanie"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  required
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the crochet item..."
                />
              </div>
              <div className="form-group">
                <label>Price (₱)</label>
                <input
                  required
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="300"
                />
              </div>
              <div className="form-group">
                <label>Image Path or URL</label>
                <input
                  required
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="/images/shop_beanie.png"
                />
              </div>
              <div style={{ display: "flex", gap: "0.8rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="crud-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="pill-btn btn-plum">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}