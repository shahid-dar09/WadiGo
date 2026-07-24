import { PrismaClient, RoleName } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding initial roles...');

  const roles = [
    { name: RoleName.CUSTOMER, description: 'Customer shopping user' },
    { name: RoleName.MERCHANT, description: 'Merchant store owner' },
    { name: RoleName.DELIVERY_PARTNER, description: 'Logistics delivery partner' },
    { name: RoleName.ADMIN, description: 'Platform administrator' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
  }

  console.log('✅ Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
