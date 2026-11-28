import { NavLink, Link, useNavigate } from "react-router-dom";

export default function Navbar({ variant = "light", user, setUser, cartCount = 0 }) {
  const navigate = useNavigate();
  const isPlum = variant === "plum";

  const handleLogout = () => {
    localStorage.removeItem("kkwt_user");
    localStorage.removeItem("kkwt_token");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className={`navbar ${isPlum ? "navbar-plum navbar-centered-logo" : "navbar-light"}`}>
      {isPlum && <div className="nav-spacer" />}

      <Link to="/" className="brand-logo">
        <img
          src="/images/logo.png"
          alt="KKWT Logo"
          className="logo-img"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <span>KKWT</span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <a href="#about">About</a>
        <NavLink to="/shop">Shop{cartCount > 0 ? ` (${cartCount})` : ""}</NavLink>
        <a href="#blog">Blog</a>

        {user ? (
          <Link to="/profile" className={`pill-btn ${isPlum ? "btn-white" : "btn-plum"}`}>
            {user.displayName || user.username}
          </Link>
        ) : (
          <Link to="/signup" className={`pill-btn ${isPlum ? "btn-white" : "btn-plum"}`}>
            Sign Up
          </Link>
        )}
      </nav>
    </header>
  );
}