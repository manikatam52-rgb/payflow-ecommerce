const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const products = [
    {
      name: 'Wireless Headphones',
      description: 'Noise-cancelling wireless over-ear headphones.',
      price: 99.99,
      image: 'https://via.placeholder.com/150',
      stock: 12,
    },
    {
      name: 'Mechanical Keyboard',
      description: 'Hot-swappable mechanical keyboard with RGB lighting.',
      price: 149.99,
      image: 'https://via.placeholder.com/150',
      stock: 8,
    },
    {
      name: 'Ergonomic Mouse',
      description: 'Precision mouse designed to reduce wrist strain.',
      price: 49.99,
      image: 'https://via.placeholder.com/150',
      stock: 20,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: product,
      create: product,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
