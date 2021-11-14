
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const plans = [ {
    id: 'free',
    name: "Free",
    price: 0,
    features: {},
  },
  {
    id: 'basic',
    name: "Basic",
    price: 400,
    features: {},
  }
  ,{
    id: 'pro',
    name: "Pro",
    price: 1000,
    features: {},
  }];
  await prisma.plans.createMany({
    data: plans 
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });