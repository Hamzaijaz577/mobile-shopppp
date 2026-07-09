import React from "react";
import { Link } from "react-router-dom";

function initialsFor(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function ProductCard({ product }) {
  const lowStock = product.stock > 0 && product.stock <= 5;
  const outOfStock = product.stock === 0;

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <div className="device-frame">
          <div className="device-statusbar">
            <span>{product.brand}</span>
            <span>5G</span>
          </div>
          <div className="device-screen">
            <span className="initials">{initialsFor(product.name)}</span>
            <span className={`stock-tag ${lowStock ? "low" : ""}`}>
              {outOfStock ? "Sold out" : lowStock ? `${product.stock} left` : "In stock"}
            </span>
          </div>
        </div>
        <div className="product-brand">{product.brand}</div>
        <div className="product-name">{product.name}</div>
      </Link>

      <div className="product-specs">
        <span className="spec-pill">{product.ram}</span>
        <span className="spec-pill">{product.storage}</span>
        <span className="spec-pill">{product.battery}</span>
      </div>

      <div className="price-row">
        <span className="price">Rs. {product.price.toLocaleString("en-PK")}</span>
        {product.oldPrice && (
          <span className="price-old">Rs. {product.oldPrice.toLocaleString("en-PK")}</span>
        )}
      </div>

      <Link to={`/product/${product.id}`} className="btn btn-primary">
        View details
      </Link>
    </div>
  );
}
