const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const app = express();

const fallbackProducts = [
  { id: 1, name: 'Wireless Headphones', price: 99.99, image: 'https://via.placeholder.com/150', stock: 12, description: 'Noise-cancelling wireless over-ear headphones.' },
  { id: 2, name: 'Mechanical Keyboard', price: 149.99, image: 'https://via.placeholder.com/150', stock: 8, description: 'Hot-swappable mechanical keyboard with RGB lighting.' },
  { id: 3, name: 'Ergonomic Mouse', price: 49.99, image: 'https://via.placeholder.com/150', stock: 20, description: 'Precision mouse designed to reduce wrist strain.' },
];

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      image: product.image || 'https://via.placeholder.com/150',
      stock: product.stock,
    }));
  } catch (error) {
    return fallbackProducts;
  }
}

app.get('/api/products', async (req, res) => {
  const products = await getProducts();
  res.json(products);
});

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { items } = req.body || { items: [] };

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items in cart.' });
    }

    const products = await getProducts();
    const totalAmount = items.reduce((total, item) => {
      const product = products.find((p) => p.id === item.id);
      return total + (product ? Number(product.price) * item.quantity : 0);
    }, 0);

    if (totalAmount <= 0) {
      return res.status(400).json({ error: 'Total must be greater than zero.' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Payment intent creation failed.' });
  }
});

app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      await prisma.order.updateMany({
        where: { stripePaymentId: paymentIntent.id },
        data: { status: 'PAID' },
      });
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
