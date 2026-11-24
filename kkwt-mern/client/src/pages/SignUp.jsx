import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp({ setUser }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);
      localStorage.setItem("kkwt_token", res.data.token);
      localStorage.setItem("kkwt_user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate("/shop");
    } catch (err) {
      setError(err.response?.data?.message || "Sign up failed. Please try again.");
    }
  };

  return (
    <div className="auth-split">
      {/* LEFT PLUM PANEL */}
      <div className="auth-left">
        {/* Top-Left Dashed Spiral */}
        <svg className="auth-swirl" viewBox="0 0 180 180" fill="none">
          <path
            d="M 10 20 C 30 -10, 120 -10, 145 45 C 165 95, 125 150, 70 148 C 20 146, -5 100, 15 60 C 32 28, 75 20, 100 45 C 120 65, 108 102, 80 105 C 58 107, 45 88, 56 72"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="3"
            strokeDasharray="9 7"
            strokeLinecap="round"
          />
        </svg>

        {/* Staggered Serif Title */}
        <h1 className="auth-staggered-title">
          <span className="line-1">Knot Knot,</span>
          <span className="line-2">Who’s</span>
          <span className="line-3">There?</span>
        </h1>

        {/* Collage Cutouts + Dashed Yarn Loop & Heart */}
        <div className="auth-collage-stage">
          <svg className="auth-yarn-trail" viewBox="0 0 560 440" fill="none">
            <path
              d="M -10 215 C 60 265, 155 225, 165 270 C 175 310, 120 310, 135 265 C 150 220, 245 240, 305 265"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="2.5"
              strokeDasharray="7 6"
              strokeLinecap="round"
            />
            <path
              d="M 125 360 C 145 425, 215 435, 230 395 C 240 365, 200 350, 195 385 C 190 415, 245 425, 305 375"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="2.5"
              strokeDasharray="7 6"
              strokeLinecap="round"
            />
          </svg>

          <img
            src="/images/home_beanie.png"
            alt="Crochet Beanie"
            className="auth-item-beanie"
          />
          <img
            src="/images/home_clip.png"
            alt="Crochet Hair Clip"
            className="auth-item-clip"
          />
          <img
            src="/images/home_flower.png"
            alt="Crochet Flowers"
            className="auth-item-flowers"
          />
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="auth-right">
        <Link to="/" className="brand-logo auth-logo">
          <img src="/images/logo.png" alt="KKWT Logo" className="logo-img" />
          <span>KKWT</span>
        </Link>

        <h2>Sign up!</h2>

        <div className="auth-card">
          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                required
                placeholder="e.g., Michelle"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                required
                placeholder="e.g., yourname@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                required
                minLength={8}
                placeholder="at least 8 characters..."
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="auth-submit-wrap">
              <button type="submit" className="pill-btn btn-plum auth-submit-btn">
                Submit
              </button>
            </div>
          </form>
        </div>

        <Link to="/login" className="auth-switch">
          Already have an account? Log in
        </Link>
      </div>
    </div>
  );
}