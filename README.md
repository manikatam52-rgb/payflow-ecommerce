# PayFlow E-Commerce Storefront

A full-stack e-commerce storefront featuring a modern React UI, dynamic shopping cart, Express REST APIs, Prisma ORM, and integrated Stripe payment gateway processing.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- SQLite for local development, or PostgreSQL for production-style setup
- Stripe account for API keys

---

## 🛠️ Backend Setup (`/server`)

```bash
cd server
npm install

# Configure environment variables in .env
# Required values:
# PORT=5000
# CLIENT_URL=http://localhost:5173
# STRIPE_SECRET_KEY=your_stripe_secret_key
# DATABASE_URL="file:./dev.db"  # for local SQLite setup

# Create the local database and apply schema
npx prisma migrate dev --name init
npm run db:seed

# Start backend server
npm run dev
```

---

## 🎨 Frontend Setup (`/client`)

```bash
cd client
npm install

# Configure environment variables in .env
# Required values:
# VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
# VITE_API_URL=http://localhost:5000

# Start frontend application
npm run dev
```

---

## 📂 Key File Architecture

- **`server/`**
  - `index.js` — Express server routes and Stripe payment intent handlers
  - `prisma/schema.prisma` — Prisma ORM data models
  - `prisma/seed.js` — Seed data for the storefront products
  - `.env` — Server environment configuration

- **`client/`**
  - `src/App.jsx` — Main storefront app and cart management
  - `src/CheckoutForm.jsx` — Stripe Elements payment integration
  - `.env` — Frontend environment configuration

---

## 🔐 Stripe Setup

Create a Stripe test account and add your keys to the environment files:

- Backend: `server/.env`
  - `STRIPE_SECRET_KEY=...`
- Frontend: `client/.env`
  - `VITE_STRIPE_PUBLISHABLE_KEY=...`

---

## 🧪 Run the Full Stack

Start both apps in separate terminals:

```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm run dev
```

Then open:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## � Docker Setup

This project includes a root Docker setup for the backend and a frontend container for local development.

```bash
# Build and run both services
docker compose up --build
```

Then open:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

To stop the stack:

```bash
docker compose down
```

---

## 🔎 Backend Health Check

The backend can be checked directly with:

```bash
curl http://localhost:5000/api/products
```

This should return the seeded product list if the server is running correctly.

---

## �📝 Git

```bash
git add README.md
git commit -m "Docs: Update README with setup and run instructions"
git push origin main
```
