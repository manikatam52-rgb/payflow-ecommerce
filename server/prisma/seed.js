const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.deleteMany({});

  await prisma.product.createMany({
    data: [
      {
        name: 'Wireless Noise-Canceling Headphones',
        description: 'High-fidelity audio with active noise cancellation and 30-hour battery life.',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        category: 'Electronics',
        stock: 12,
      },
      {
        name: 'Minimalist Mechanical Keyboard',
        description: 'Compact RGB wireless mechanical keyboard with hot-swappable switches.',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
        category: 'Electronics',
        stock: 18,
      },
      {
        name: 'Ergonomic Leather Desk Chair',
        description: 'Premium breathable leather chair designed for lumbar support and all-day comfort.',
        price: 249.5,
        image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=500&q=80',
        category: 'Furniture',
        stock: 6,
      },
      {
        name: 'Smart Fitness Watch',
        description: 'Track heart rate, sleep, workouts, and notifications with a 7-day battery.',
        price: 129.95,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        category: 'Electronics',
        stock: 9,
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
