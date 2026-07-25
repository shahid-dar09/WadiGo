import { CartRepository } from '../repositories/cart.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { ApiError } from '../utils/api-error.js';
import { AddCartItemInput, UpdateCartItemInput } from '../schemas/cart.schema.js';

export class CartService {
  static async getCart(userId: string) {
    const cart = await CartRepository.findOrCreateCart(userId);

    const items = await Promise.all(
      cart.items.map(async (item) => {
        // Find the best available price for this product
        const product = await ProductRepository.findById(item.productId);
        const inventory = product?.inventory ?? [];
        const cheapest = inventory.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))[0];

        return {
          id: item.id,
          productId: item.productId,
          productName: item.product.name,
          imageUrl: item.product.imageUrl,
          unit: item.product.unit,
          quantity: item.quantity,
          variant: item.variant,
          price: cheapest?.salePrice ?? cheapest?.price ?? 0,
          storeId: cheapest?.storeId,
          isAvailable: inventory.some((i) => i.stockQuantity > 0),
        };
      })
    );

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const deliveryFee = subtotal > 0 ? 25 : 0; // Flat ₹25 delivery fee
    const total = subtotal + deliveryFee;

    return { cartId: cart.id, items, subtotal, deliveryFee, total };
  }

  static async addItem(userId: string, input: AddCartItemInput) {
    const product = await ProductRepository.findById(input.productId);
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    const hasStock = product.inventory.some((i) => i.isAvailable && i.stockQuantity > 0);
    if (!hasStock) {
      throw ApiError.badRequest('Product is currently out of stock');
    }

    const cart = await CartRepository.findOrCreateCart(userId);
    await CartRepository.addItem(cart.id, {
      productId: input.productId,
      variantId: input.variantId,
      quantity: input.quantity,
    });

    return this.getCart(userId);
  }

  static async updateItem(userId: string, itemId: string, input: UpdateCartItemInput) {
    const cartItem = await CartRepository.findCartItemById(itemId);
    if (!cartItem || cartItem.cart.userId !== userId) {
      throw ApiError.notFound('Cart item not found');
    }

    await CartRepository.updateItem(itemId, input.quantity);
    return this.getCart(userId);
  }

  static async removeItem(userId: string, itemId: string) {
    const cartItem = await CartRepository.findCartItemById(itemId);
    if (!cartItem || cartItem.cart.userId !== userId) {
      throw ApiError.notFound('Cart item not found');
    }

    await CartRepository.removeItem(itemId);
    return this.getCart(userId);
  }

  static async clearCart(userId: string) {
    const cart = await CartRepository.findOrCreateCart(userId);
    await CartRepository.clearCart(cart.id);
    return { message: 'Cart cleared successfully' };
  }
}
