import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { count } = useCart();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          <span className="dot" />
          Circuit &amp; Signal
        </Link>
        <nav className="nav-links">
          <Link to="/cart" className="cart-badge">
            <ShoppingBag size={17} />
            Cart
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
