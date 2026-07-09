import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <p>Browse the catalog and add a phone to get started.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 20, display: "inline-flex" }}>
            Browse phones
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="section-head">
        <h2>Your cart</h2>
      </div>

      <div className="detail-grid" style={{ gridTemplateColumns: "1fr 340px" }}>
        <div>
          {items.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-thumb">
                {item.name
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")}
              </div>
              <div>
                <div className="product-brand">{item.brand}</div>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div className="mono" style={{ color: "var(--accent)", marginTop: 4 }}>
                  Rs. {item.price.toLocaleString("en-PK")}
                </div>
              </div>
              <div className="qty-control">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">
                  <Minus size={14} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">
                  <Plus size={14} />
                </button>
              </div>
              <button className="btn btn-ghost" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Items</span>
            <span>{items.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>Calculated on delivery</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span className="mono">Rs. {total.toLocaleString("en-PK")}</span>
          </div>
          <button className="btn btn-primary" style={{ width: "100%", marginTop: 16 }} onClick={() => navigate("/checkout")}>
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
}
