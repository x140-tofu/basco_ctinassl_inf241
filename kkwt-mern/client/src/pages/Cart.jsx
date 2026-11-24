import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Cart({ user, setUser, cart, setCart }) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardForm, setCardForm] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [ewalletForm, setEwalletForm] = useState({
    provider: "GCash",
    accountName: "",
    mobileNumber: "",
  });
  const navigate = useNavigate();

  const totalAmount = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);

  const handleRemoveItem = (indexToRemove) => {
    setCart((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleLogout = () => {
    localStorage.removeItem("kkwt_user");
    localStorage.removeItem("kkwt_token");
    setUser(null);
    navigate("/login");
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your shopping cart is empty!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/orders", {
        customerName: user?.username || cardForm.name || ewalletForm.accountName || "Guest",
        items: cart.map((item) => ({
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
        })),
        totalAmount,
        paymentMethod: paymentMethod === "card" ? "Credit/Debit Card" : ewalletForm.provider,
      });

      alert(`Order totaling ₱${totalAmount} saved to MongoDB!`);
      setCart([]);
      navigate("/shop");
    } catch (err) {
      alert("Failed to save order. Check if backend server is running.");
    }
  };

  return (
    <div className="cart-page-wrapper">
      {/* TOP BAR */}
      <header className="shop-navbar">
        <div className="shop-nav-left">
          <Link to="/" className="brand-logo">
            <img src="/images/logo.png" alt="KKWT Logo" className="logo-img" />
            <span>KKWT</span>
          </Link>
        </div>

        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <a href="#about">About</a>
          <NavLink to="/shop" className="active">Shop</NavLink>
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
      <main className="cart-container">
        <h1 className="cart-title">Shopping cart</h1>

        <div className="cart-split-grid">
          {/* LEFT: ITEMS TABLE & TOTAL */}
          <div className="cart-items-section">
            <div className="cart-table-header">
              <span></span>
              <span>Pattern</span>
              <span>Total Price</span>
            </div>

            <div className="cart-items-list">
              {cart.length === 0 ? (
                <p className="cart-empty-msg">
                  Your cart is currently empty. Click <strong>ORDER MORE</strong> to browse crochet patterns!
                </p>
              ) : (
                cart.map((item, index) => (
                  <div className="cart-item-row" key={`${item._id || item.name}-${index}`}>
                    <button
                      type="button"
                      className="cart-trash-btn"
                      onClick={() => handleRemoveItem(index)}
                      title="Remove pattern"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e05252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>

                    <div className="cart-product-info">
                      <img src={item.imageUrl} alt={item.name} className="cart-thumb" />
                      <div>
                        <h4>{item.name}</h4>
                        <span>Pattern</span>
                      </div>
                    </div>

                    <div className="cart-item-price">₱{item.price}</div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-summary-footer">
              <Link to="/shop" className="order-more-btn">
                ORDER MORE
              </Link>

              <div className="cart-total-display">
                <span className="total-label">Total:</span>
                <span className="total-amount">₱{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: PAYMENT METHOD CARD */}
          <div className="payment-card">
            <h2>Payment Method:</h2>

            <form onSubmit={handleCheckout}>
              <div className="payment-options">
                {/* E-wallet Option */}
                <label className="payment-radio-row">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "ewallet"}
                    onChange={() => setPaymentMethod("ewallet")}
                  />
                  <span className="custom-radio" />
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#723d4e">
                    <path d="M21 7H5a2 2 0 0 1 0-4h14v2H5v.5h16a1 1 0 0 1 1 1v12a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h14v2H5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h15V7zm-3 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
                  </svg>
                  <span className="payment-option-text">E-wallet</span>
                </label>

                {/* Credit/Debit Card Option */}
                <label className="payment-radio-row">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <span className="custom-radio" />
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#723d4e">
                    <rect x="2" y="5" width="20" height="14" rx="2.5" />
                    <rect x="2" y="8.5" width="20" height="2.5" fill="#ffffff" />
                    <rect x="5" y="14" width="5" height="1.8" rx="0.8" fill="#ffffff" />
                  </svg>
                  <span className="payment-option-text">Credit/Debit Card</span>
                </label>
              </div>

              {paymentMethod === "card" ? (
                <>
                  <div className="payment-field">
                    <label>Name on Card</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter Name on Card..."
                      value={cardForm.name}
                      onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                    />
                  </div>

                  <div className="payment-field">
                    <label>Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter Card Number..."
                      value={cardForm.number}
                      onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                    />
                  </div>

                  <div className="payment-row-2col">
                    <div className="payment-field">
                      <label>Expiration Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM / DD / YYYY"
                        value={cardForm.expiry}
                        onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                      />
                    </div>

                    <div className="payment-field">
                      <label>CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        required
                        placeholder="Enter CVV..."
                        value={cardForm.cvv}
                        onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="payment-field">
                    <label>E-Wallet Provider</label>
                    <input
                      type="text"
                      required
                      placeholder="GCash / Maya..."
                      value={ewalletForm.provider}
                      onChange={(e) =>
                        setEwalletForm({ ...ewalletForm, provider: e.target.value })
                      }
                    />
                  </div>

                  <div className="payment-field">
                    <label>Account Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter Account Name..."
                      value={ewalletForm.accountName}
                      onChange={(e) =>
                        setEwalletForm({ ...ewalletForm, accountName: e.target.value })
                      }
                    />
                  </div>

                  <div className="payment-field">
                    <label>Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="09XX XXX XXXX"
                      value={ewalletForm.mobileNumber}
                      onChange={(e) =>
                        setEwalletForm({ ...ewalletForm, mobileNumber: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              <div className="checkout-btn-wrap">
                <button type="submit" className="pill-btn btn-plum checkout-btn">
                  CHECK OUT
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}