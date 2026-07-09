import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Banknote } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { placeOrder } from "../api.js";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    navigate("/");
    return null;
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.phone || !form.address || !form.city) {
      setError("Please fill in name, phone, address and city.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        customer: form,
      };
      const { order } = await placeOrder(payload);
      clearCart();
      navigate("/order-success", { state: { order } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container section">
      <div className="section-head">
        <h2>Checkout</h2>
      </div>

      <div className="checkout-grid">
        <form onSubmit={handleSubmit}>
          {error && <div className="error-banner">{error}</div>}

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Ali Hassan" />
            </div>
            <div className="form-field">
              <label htmlFor="phone">Phone number</label>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="0300-1234567" />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="email">Email (optional, for your own order copy)</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </div>

          <div className="form-field">
            <label htmlFor="address">Delivery address</label>
            <input id="address" name="address" value={form.address} onChange={handleChange} placeholder="House #, street, area" />
          </div>

          <div className="form-field">
            <label htmlFor="city">City</label>
            <input id="city" name="city" value={form.city} onChange={handleChange} placeholder="Rawalpindi" />
          </div>

          <div className="form-field">
            <label htmlFor="notes">Delivery notes (optional)</label>
            <textarea id="notes" name="notes" rows={3} value={form.notes} onChange={handleChange} placeholder="Landmark, preferred time, etc." />
          </div>

          <div className="payment-option">
            <Banknote size={20} color="var(--accent)" />
            <div>
              <div className="badge">Selected payment method</div>
              <div style={{ fontWeight: 600 }}>Cash on Delivery</div>
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: "100%" }}>
            {submitting ? "Placing order…" : `Place order — Rs. ${total.toLocaleString("en-PK")}`}
          </button>
        </form>

        <div className="cart-summary">
          <h3 style={{ fontFamily: "var(--font-display)", marginBottom: 12 }}>Order summary</h3>
          {items.map((item) => (
            <div className="summary-row" key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span className="mono">Rs. {(item.price * item.quantity).toLocaleString("en-PK")}</span>
            </div>
          ))}
          <div className="summary-row total">
            <span>Total</span>
            <span className="mono">Rs. {total.toLocaleString("en-PK")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
