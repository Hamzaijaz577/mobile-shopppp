const express = require("express");
const crypto = require("crypto");
const { readJSON, writeJSON } = require("../utils/db");
const { sendOrderNotification } = require("../utils/mailer");

const router = express.Router();

function generateOrderId() {
  return "ORD-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

// POST /api/orders - place a new Cash on Delivery order
router.post("/", async (req, res) => {
  try {
    const { items, customer } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty." });
    }
    if (!customer || !customer.name || !customer.phone || !customer.address || !customer.city) {
      return res.status(400).json({ error: "Name, phone, address and city are required." });
    }

    const products = readJSON("products.json");
    let total = 0;
    const orderItems = [];

    // Validate each item against the catalog and current stock
    for (const item of items) {
      const product = products.find((p) => p.id === item.id);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.id} does not exist.` });
      }
      if (item.quantity < 1) {
        return res.status(400).json({ error: `Invalid quantity for ${product.name}.` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Only ${product.stock} unit(s) of ${product.name} left in stock.` });
      }

      orderItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
      total += product.price * item.quantity;
    }

    // Decrement stock
    const updatedProducts = products.map((p) => {
      const ordered = items.find((i) => i.id === p.id);
      if (ordered) {
        return { ...p, stock: p.stock - ordered.quantity };
      }
      return p;
    });
    writeJSON("products.json", updatedProducts);

    const order = {
      id: generateOrderId(),
      items: orderItems,
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email || "",
        address: customer.address,
        city: customer.city,
        notes: customer.notes || "",
      },
      paymentMethod: "Cash on Delivery",
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const orders = readJSON("orders.json");
    orders.push(order);
    writeJSON("orders.json", orders);

    // Try to email the shop owner. Order still succeeds even if email fails,
    // so a missing/incorrect .env config doesn't block customers from ordering.
    let emailSent = true;
    try {
      await sendOrderNotification(order);
    } catch (emailError) {
      emailSent = false;
      console.error("Failed to send order notification email:", emailError.message);
    }

    res.status(201).json({ order, emailSent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong while placing your order." });
  }
});

// GET /api/orders - list all orders (simple admin/debug use)
router.get("/", (req, res) => {
  const orders = readJSON("orders.json");
  res.json(orders);
});

// GET /api/orders/:id
router.get("/:id", (req, res) => {
  const orders = readJSON("orders.json");
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

module.exports = router;
