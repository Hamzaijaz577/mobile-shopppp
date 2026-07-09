# Circuit & Signal — Mobile Phone Shop

A full-stack e-commerce site for selling mobile phones, built with **React (Vite)** on the
frontend and **Node.js/Express** on the backend.

- Payment method: **Cash on Delivery (COD)** only
- When a customer places an order, an email notification is sent automatically to
  **hijaz8072@gmail.com** with the full order details (customer info + items + total)
- Product data and orders are stored in simple JSON files (`backend/data/`) — no external
  database server required

## Project structure

```
mobile-shop/
├── backend/     # Express API (products, orders, email notifications)
└── frontend/    # React storefront (Vite)
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Now open `.env` and fill in:

- `EMAIL_USER` — a Gmail address you control, used to SEND the notification
- `EMAIL_PASS` — a **Gmail App Password** for that account (see below — this is NOT your normal Gmail password)
- `OWNER_EMAIL` — already set to `hijaz8072@gmail.com`, the address that RECEIVES order emails

### How to get a Gmail App Password

1. Go to https://myaccount.google.com/security and turn on **2-Step Verification** (required for app passwords)
2. Go to https://myaccount.google.com/apppasswords
3. Create an app password for "Mail" — Google gives you a 16-character code
4. Paste that code (no spaces) into `EMAIL_PASS` in your `.env`

Then start the server:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Test it's alive: `http://localhost:5000/api/health`

## 2. Frontend setup

In a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The site runs at `http://localhost:5173`.

## How the order flow works

1. Customer browses phones, adds one to the cart
2. On checkout, they fill in name, phone, address, city (email optional) — payment is
   fixed to Cash on Delivery
3. The frontend calls `POST /api/orders` on the backend
4. The backend:
   - validates stock, saves the order to `backend/data/orders.json`
   - decreases the ordered product's stock in `backend/data/products.json`
   - emails the full order details to `hijaz8072@gmail.com`
5. The customer sees an order confirmation screen with their order ID

If the email fails to send (e.g. `.env` not configured yet), the order still goes
through — it's just logged in the backend console so customers are never blocked.

## Customizing products

Edit `backend/data/products.json` directly — add, remove, or change phones, prices
(in PKR), specs, and stock counts. No code changes needed.

## Going to production

This setup is built for local development / a quick real launch. Before going fully
live, consider:

- Swapping the JSON-file storage for a real database (MongoDB/PostgreSQL) if you expect concurrent orders
- Deploying the backend (Render, Railway, a VPS) and frontend (Vercel, Netlify) separately, updating `VITE_API_URL` and `CLIENT_ORIGIN` accordingly
- Adding an admin view to manage orders/products instead of editing JSON files by hand
