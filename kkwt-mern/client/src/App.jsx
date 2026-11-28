import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("kkwt_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("kkwt_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Load saved cart items from MongoDB when logged in or on page refresh
  useEffect(() => {
    const userId = user?._id || user?.id;
    if (!userId) {
      setCart([]);
      localStorage.removeItem("kkwt_cart");
      return;
    }

    axios
      .get(`http://localhost:5000/api/users/${userId}/cart`)
      .then((res) => {
        const savedItems = Array.isArray(res.data) ? res.data : [];
        setCart(savedItems);
        localStorage.setItem("kkwt_cart", JSON.stringify(savedItems));
      })
      .catch((err) => console.error("Error loading user cart:", err));
  }, [user]);

  // Wrapper that updates React state AND saves to MongoDB
  const updateCart = (updater) => {
    setCart((prevCart) => {
      const nextCart = typeof updater === "function" ? updater(prevCart) : updater;
      localStorage.setItem("kkwt_cart", JSON.stringify(nextCart));

      const userId = user?._id || user?.id;
      if (userId) {
        axios
          .put(`http://localhost:5000/api/users/${userId}/cart`, { cart: nextCart })
          .catch((err) => console.error("Error saving user cart:", err));
      }

      return nextCart;
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home user={user} setUser={setUser} cartCount={cart.length} />}
        />
        <Route
          path="/shop"
          element={<Shop user={user} setUser={setUser} cart={cart} setCart={updateCart} />}
        />
        <Route
          path="/cart"
          element={<Cart user={user} setUser={setUser} cart={cart} setCart={updateCart} />}
        />
        <Route
          path="/shop/admin"
          element={
            <Shop
              user={user}
              setUser={setUser}
              cart={cart}
              setCart={updateCart}
              isAdminMode={true}
            />
          }
        />
        <Route path="/signup" element={<SignUp setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
      </Routes>
    </BrowserRouter>
  );
}