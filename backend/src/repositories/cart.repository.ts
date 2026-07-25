import { prisma } from '../config/prisma.js';

export class CartRepository {
  static async findOrCreateCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, imageUrl: true, unit: true } },
            variant: { select: { id: true, name: true, sku: true } },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: { select: { id: true, name: true, imageUrl: true, unit: true } },
              variant: { select: { id: true, name: true, sku: true } },
            },
          },
        },
      });
    }

    return cart;
  }

  static async findCartItem(cartId: string, productId: string, variantId?: string) {
    return prisma.cartItem.findFirst({
      where: { cartId, productId, variantId: variantId || null },
    });
  }

  static async addItem(cartId: string, data: {
    productId: string;
    variantId?: string;
    quantity: number;
  }) {
    // Check if item already exists
    const existing = await this.findCartItem(cartId, data.productId, data.variantId);
    if (existing) {
      return prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + data.quantity },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId,
        productId: data.productId,
        variantId: data.variantId,
        quantity: data.quantity,
      },
    });
  }

  static async updateItem(itemId: string, quantity: number) {
    if (quantity <= 0) {
      return prisma.cartItem.delete({ where: { id: itemId } });
    }
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  static async removeItem(itemId: string) {
    return prisma.cartItem.delete({ where: { id: itemId } });
  }

  static async clearCart(cartId: string) {
    return prisma.cartItem.deleteMany({ where: { cartId } });
  }

  static async findCartItemById(itemId: string) {
    return prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });
  }
}
