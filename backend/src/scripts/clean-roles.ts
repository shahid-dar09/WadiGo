/// <reference types="node" />
import { PrismaClient, RoleName } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanRoles() {
  console.log('🧹 Cleaning up user roles...');

  // 1. For darshahid45ds@gmail.com: Keep ONLY ADMIN role
  const adminUser = await prisma.user.findUnique({
    where: { email: 'darshahid45ds@gmail.com' },
    include: { roles: { include: { role: true } } },
  });

  if (adminUser) {
    const adminRole = await prisma.role.findUnique({ where: { name: RoleName.ADMIN } });
    if (adminRole) {
      // Delete all existing roles for this user
      await prisma.userRole.deleteMany({ where: { userId: adminUser.id } });
      // Assign ONLY ADMIN role
      await prisma.userRole.create({
        data: { userId: adminUser.id, roleId: adminRole.id },
      });
      console.log('✅ darshahid45ds@gmail.com set to ONLY [ADMIN] role');
    }
  }

  // 2. For shahiddar5221@gmail.com: Keep ONLY DELIVERY_PARTNER role
  const deliveryUser = await prisma.user.findUnique({
    where: { email: 'shahiddar5221@gmail.com' },
    include: { roles: { include: { role: true } } },
  });

  if (deliveryUser) {
    const deliveryRole = await prisma.role.findUnique({ where: { name: RoleName.DELIVERY_PARTNER } });
    if (deliveryRole) {
      // Delete all existing roles for this user
      await prisma.userRole.deleteMany({ where: { userId: deliveryUser.id } });
      // Assign ONLY DELIVERY_PARTNER role
      await prisma.userRole.create({
        data: { userId: deliveryUser.id, roleId: deliveryRole.id },
      });
      console.log('✅ shahiddar5221@gmail.com set to ONLY [DELIVERY_PARTNER] role');
    }
  }

  console.log('🎉 Role cleanup completed successfully!');
}

cleanRoles()
  .catch((err) => {
    console.error('❌ Error during role cleanup:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
