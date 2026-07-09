const express = require("express");
const { readJSON } = require("../utils/db");

const router = express.Router();

// GET /api/products - list all products (optional ?search= & ?brand=)
router.get("/", (req, res) => {
  const products = readJSON("products.json");
  const { search, brand } = req.query;

  let result = products;

  if (brand) {
    result = result.filter(
      (p) => p.brand.toLowerCase() === String(brand).toLowerCase()
    );
  }

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q));
  }

  res.json(result);
});

// GET /api/products/:id - single product
router.get("/:id", (req, res) => {
  const products = readJSON("products.json");
  const product = products.find((p) => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

module.exports = router;
