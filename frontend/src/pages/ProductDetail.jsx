import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Minus, Plus, ShieldCheck } from "lucide-react";
import { fetchProduct } from "../api.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProduct(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container section">Loading…</div>;
  if (error) return <div className="container section error-banner">{error}</div>;
  if (!product) return null;

  const initials = product.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  function handleAddToCart() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="container section">
      <div className="detail-grid">
        <div className="device-frame" style={{ marginBottom: 0 }}>
          <div className="device-statusbar">
            <span>{product.brand}</span>
            <span>5G</span>
          </div>
          <div className="device-screen" style={{ height: "300px" }}>
            <span className="initials" style={{ fontSize: "3rem" }}>
              {initials}
            </span>
          </div>
        </div>

        <div>
          <div className="product-brand">{product.brand}</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.9rem", margin: "6px 0 12px" }}>
            {product.name}
          </h1>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.6, maxWidth: "60ch" }}>
            {product.description}
          </p>

          <table className="detail-specs-table">
            <tbody>
              <tr>
                <td>RAM</td>
                <td>{product.ram}</td>
              </tr>
              <tr>
                <td>Storage</td>
                <td>{product.storage}</td>
              </tr>
              <tr>
                <td>Display</td>
                <td>{product.display}</td>
              </tr>
              <tr>
                <td>Camera</td>
                <td>{product.camera}</td>
              </tr>
              <tr>
                <td>Battery</td>
                <td>{product.battery}</td>
              </tr>
              <tr>
                <td>Color</td>
                <td>{product.color}</td>
              </tr>
            </tbody>
          </table>

          <div className="price-row">
            <span className="price" style={{ fontSize: "1.5rem" }}>
              Rs. {product.price.toLocaleString("en-PK")}
            </span>
            {product.oldPrice && (
              <span className="price-old">Rs. {product.oldPrice.toLocaleString("en-PK")}</span>
            )}
          </div>

          {product.stock === 0 ? (
            <p style={{ color: "var(--danger)", marginBottom: 16 }}>Currently out of stock.</p>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 16 }}>
              {product.stock} unit(s) available
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
            <div className="qty-control">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                <Minus size={14} />
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              className="btn btn-primary"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              {added ? "Added ✓" : "Add to cart"}
            </button>
          </div>

          <div style={{ display: "flex", gap: 8, color: "var(--text-muted)", fontSize: "0.85rem" }}>
            <ShieldCheck size={16} />
            Sealed pack, 100% genuine — inspect before you pay on delivery.
          </div>

          <div style={{ marginTop: 24 }}>
            <Link to="/" className="btn btn-ghost">
              ← Back to catalog
            </Link>
            {added && (
              <button className="btn btn-ghost" style={{ marginLeft: 10 }} onClick={() => navigate("/cart")}>
                Go to cart →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
