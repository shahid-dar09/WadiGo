import { PrismaClient, RoleName, MerchantStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting WadiGo Database Seeding...');

  // 1. Create Roles
  const roles = [RoleName.CUSTOMER, RoleName.MERCHANT, RoleName.DELIVERY_PARTNER, RoleName.ADMIN];
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} role` },
    });
  }
  console.log('✅ Roles seeded');

  // 2. Hash default password
  const passwordHash = await bcrypt.hash('WadiGo123!', 10);

  // 3. Create Admin User
  const adminRole = await prisma.role.findUnique({ where: { name: RoleName.ADMIN } });
  const admin = await prisma.user.upsert({
    where: { email: 'admin@wadigo.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@wadigo.com',
      passwordHash,
      phone: '+91 99999 00000',
      roles: { create: { roleId: adminRole!.id } },
    },
  });
  console.log('✅ Admin user created: admin@wadigo.com / WadiGo123!');

  // 4. Create Merchant User & Profile & Store
  const merchantRole = await prisma.role.findUnique({ where: { name: RoleName.MERCHANT } });
  const merchantUser = await prisma.user.upsert({
    where: { email: 'merchant@wadigo.com' },
    update: {},
    create: {
      name: 'Rajesh Kumar',
      email: 'merchant@wadigo.com',
      passwordHash,
      phone: '+91 98765 43210',
      roles: { create: { roleId: merchantRole!.id } },
    },
  });

  const merchantProfile = await prisma.merchantProfile.upsert({
    where: { userId: merchantUser.id },
    update: {},
    create: {
      userId: merchantUser.id,
      businessName: 'Fresh Mart Organics',
      contactEmail: 'merchant@wadigo.com',
      contactPhone: '+91 98765 43210',
      status: MerchantStatus.APPROVED,
      rating: 4.8,
    },
  });

  const store = await prisma.store.upsert({
    where: { id: 'store-fresh-mart-main' },
    update: {},
    create: {
      id: 'store-fresh-mart-main',
      merchantId: merchantProfile.id,
      name: 'Fresh Mart - MG Road Branch',
      address: '42 MG Road, Sector 4, Bengaluru, Karnataka 560001',
      latitude: 12.9716,
      longitude: 77.5946,
      radiusKm: 15,
      prepTimeMinutes: 15,
    },
  });
  console.log('✅ Merchant user & store created: merchant@wadigo.com / WadiGo123!');

  // 5. Create Categories
  const categoriesData = [
    { name: 'Fresh Fruits & Vegetables', slug: 'fresh-fruits-vegetables', description: 'Farm fresh organic produce delivered daily' },
    { name: 'Dairy & Breakfast', slug: 'dairy-breakfast', description: 'Milk, butter, eggs, paneer & morning essentials' },
    { name: 'Bakery & Snacks', slug: 'bakery-snacks', description: 'Freshly baked bread, biscuits & crispy snacks' },
    { name: 'Beverages', slug: 'beverages', description: 'Juices, soft drinks, tea & coffee' },
    { name: 'Groceries & Staples', slug: 'groceries-staples', description: 'Rice, wheat flour, pulses, spices & oils' },
  ];

  const categoriesMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoriesMap[cat.slug] = created.id;
  }
  console.log('✅ Categories seeded');

  // 6. Create Products & Inventory
  const productsData = [
    {
      name: 'Organic Farm Fresh Milk 1L',
      slug: 'organic-farm-fresh-milk-1l',
      catSlug: 'dairy-breakfast',
      unit: '1 Litre',
      description: 'Pure, pasteurized farm fresh milk delivered within 2 hours of milking.',
      imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
      price: 65,
      salePrice: 60,
    },
    {
      name: 'Whole Wheat Fresh Bread 400g',
      slug: 'whole-wheat-fresh-bread-400g',
      catSlug: 'bakery-snacks',
      unit: '400g pack',
      description: '100% whole wheat bread baked fresh every morning with no added preservatives.',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      price: 45,
      salePrice: 40,
    },
    {
      name: 'Organic Bananas 1kg',
      slug: 'organic-bananas-1kg',
      catSlug: 'fresh-fruits-vegetables',
      unit: '1 kg',
      description: 'Naturally ripened organic Robusta bananas packed with potassium.',
      imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
      price: 50,
      salePrice: 45,
    },
    {
      name: 'Fresh Alphonso Mangoes 1kg',
      slug: 'fresh-alphonso-mangoes-1kg',
      catSlug: 'fresh-fruits-vegetables',
      unit: '1 kg',
      description: 'Handpicked premium Alphonso mangoes direct from Ratnagiri orchards.',
      imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
      price: 299,
      salePrice: 249,
    },
    {
      name: 'Premium Basmati Rice 5kg',
      slug: 'premium-basmati-rice-5kg',
      catSlug: 'groceries-staples',
      unit: '5 kg bag',
      description: 'Extra long grain aromatic basmati rice aged for superior fragrance and fluffiness.',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
      price: 550,
      salePrice: 499,
    },
  ];

  for (const item of productsData) {
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        categoryId: categoriesMap[item.catSlug],
        name: item.name,
        slug: item.slug,
        description: item.description,
        unit: item.unit,
        imageUrl: item.imageUrl,
      },
    });

    await prisma.inventoryItem.upsert({
      where: {
        storeId_productId_variantId: {
          storeId: store.id,
          productId: product.id,
          variantId: null as any,
        },
      } as any,
      update: {
        price: item.price,
        salePrice: item.salePrice,
        stockQuantity: 50,
        isAvailable: true,
      },
      create: {
        storeId: store.id,
        productId: product.id,
        price: item.price,
        salePrice: item.salePrice,
        stockQuantity: 50,
        isAvailable: true,
      },
    });
  }

  console.log('✅ Products & Inventory seeded');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
