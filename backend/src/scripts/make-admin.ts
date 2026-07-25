/// <reference types="node" />
import { PrismaClient, RoleName } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.log('❌ Usage: npx ts-node src/scripts/make-admin.ts <user-email>');
    console.log('Example: npx ts-node src/scripts/make-admin.ts darshahid45ds@gmail.com');
    process.exit(1);
  }

  console.log(`🔍 Looking up user with email: ${email}...`);
  const user = await prisma.user.findUnique({
    where: { email },
    include: { roles: { include: { role: true } } },
  });

  if (!user) {
    console.log(`❌ User with email "${email}" was not found in the database.`);
    console.log('Please make sure the user has registered first.');
    process.exit(1);
  }

  const adminRole = await prisma.role.findUnique({
    where: { name: RoleName.ADMIN },
  });

  if (!adminRole) {
    console.log('❌ ADMIN role not found in database. Please run seed script first.');
    process.exit(1);
  }

  const hasAdminRole = user.roles.some((r) => r.role.name === RoleName.ADMIN);
  if (hasAdminRole) {
    console.log(`✅ User "${email}" already has the ADMIN role!`);
    console.log(`🔑 You can sign in at: http://localhost:5173/auth/admin/login`);
    process.exit(0);
  }

  await prisma.userRole.create({
    data: {
      userId: user.id,
      roleId: adminRole.id,
    },
  });

  console.log(`🎉 SUCCESS! User "${email}" (ID: ${user.id}) has been granted the ADMIN role.`);
  console.log(`🔑 You can now log into the Admin Portal at: http://localhost:5173/auth/admin/login`);
}

makeAdmin()
  .catch((err) => {
    console.error('❌ Error assigning ADMIN role:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
