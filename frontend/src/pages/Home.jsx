import React, { useEffect, useMemo, useState } from "react";
import { Truck, Zap } from "lucide-react";
import { fetchProducts } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeBrand, setActiveBrand] = useState("All");

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const brands = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.brand)));
    return ["All", ...unique];
  }, [products]);

  const filtered = useMemo(() => {
    if (activeBrand === "All") return products;
    return products.filter((p) => p.brand === activeBrand);
  }, [products, activeBrand]);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">
              <Truck size={14} /> Cash on delivery, everywhere in the city
            </span>
            <h1>Your next phone, delivered to your door.</h1>
            <p>
              Genuine, sealed-pack smartphones from every major brand. Order online, pay
              in cash the moment it arrives — no card, no advance, no hassle.
            </p>
            <div className="hero-actions">
              <a href="#catalog" className="btn btn-primary">
                <Zap size={16} /> Shop the catalog
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="phone-mock">
              <div className="screen" />
            </div>
            <span className="spec-chip" style={{ top: "10%", left: "0%" }}>
              200MP camera
            </span>
            <span className="spec-chip" style={{ top: "45%", right: "0%", animationDelay: "1.2s" }}>
              5000mAh battery
            </span>
            <span className="spec-chip" style={{ bottom: "8%", left: "8%", animationDelay: "2.4s" }}>
              COD available
            </span>
          </div>
        </div>
      </section>

      <section className="section container" id="catalog">
        <div className="section-head">
          <h2>Browse phones</h2>
          <div className="filter-row">
            {brands.map((brand) => (
              <button
                key={brand}
                className={`filter-chip ${activeBrand === brand ? "active" : ""}`}
                onClick={() => setActiveBrand(brand)}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {loading && <p style={{ color: "var(--text-muted)" }}>Loading phones…</p>}
        {error && <div className="error-banner">{error}</div>}

        {!loading && !error && (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
