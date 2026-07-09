# Deployment Guide — Circuit & Signal Mobile Shop

This guide takes your project from "code on GitHub" to a live website with a
working backend, using two free hosting services that connect directly to
your GitHub repo.

- **Backend** (Node/Express) → deployed on **Render** (render.com)
- **Frontend** (React) → deployed on **Vercel** (vercel.com)

Both auto-deploy: once connected, every time you push new code to GitHub,
your live site updates automatically.

---

## Step 0 — Push your code to GitHub first

Deploying only works from a GitHub repo, so make sure `mobile-shop` (with
`backend/` and `frontend/` folders) is already pushed to GitHub before
continuing.

---

## Step 1 — Deploy the backend on Render

1. Go to https://render.com and sign up / log in **using your GitHub account**
2. Click **New +** → **Web Service**
3. Select your `mobile-shop` GitHub repo
4. Fill in these settings:
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. Scroll to **Environment Variables** and add these (same values as your local `.env`):
   | Key | Value |
   |---|---|
   | `EMAIL_USER` | your sending Gmail address |
   | `EMAIL_PASS` | your 16-character Gmail App Password |
   | `OWNER_EMAIL` | `hijaz8072@gmail.com` |
   | `CLIENT_ORIGIN` | leave as `http://localhost:5173` for now — you'll update this in Step 3 |
6. Click **Create Web Service**

Render will build and deploy it. Once done, you'll get a live URL like:
`https://mobile-shop-backend.onrender.com`

Test it works by opening `https://mobile-shop-backend.onrender.com/api/health`
in your browser — it should show `{"status":"ok"}`.

> **Note:** on Render's free tier, the backend "sleeps" after 15 minutes of no
> traffic and takes ~30-50 seconds to wake up on the next request. This is
> normal for free hosting — upgrading to a paid instance removes this delay.

---

## Step 2 — Deploy the frontend on Vercel

1. Go to https://vercel.com and sign up / log in **using your GitHub account**
2. Click **Add New** → **Project**
3. Select your `mobile-shop` GitHub repo
4. Fill in these settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite (should auto-detect)
5. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://mobile-shop-backend.onrender.com/api` (use YOUR Render URL from Step 1) |
6. Click **Deploy**

You'll get a live URL like: `https://mobile-shop.vercel.app`

---

## Step 3 — Connect the two (important!)

Go back to your **Render** backend service → **Environment** tab → update:

| Key | Value |
|---|---|
| `CLIENT_ORIGIN` | `https://mobile-shop.vercel.app` (your actual Vercel URL) |

Save — Render will redeploy automatically. This step is required, otherwise
the backend will block requests coming from your live frontend (CORS).

---

## Step 4 — Test the live site

1. Open your Vercel URL
2. Browse a phone, add to cart, checkout with a test order
3. Check `hijaz8072@gmail.com` — you should receive the order notification email

---

## Every future update

Just push your changes to GitHub (`git add . && git commit -m "..." && git push`).
Both Render and Vercel watch your repo and redeploy automatically — no extra
steps needed.

---

## A note on data storage

This project stores products/orders in JSON files on the backend server.
Render's free tier does **not** guarantee that filesystem changes persist
across restarts/redeploys — so orders could occasionally reset. This is fine
for testing and light use, but if you plan to run this as a real store
long-term, it's worth upgrading to a proper database (MongoDB Atlas has a
free tier that pairs well with this setup). Ask if you'd like help wiring
that in.
