import { OrderRepository } from '../repositories/order.repository.js';
import { CartRepository } from '../repositories/cart.repository.js';
import { AddressRepository } from '../repositories/address.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { ApiError } from '../utils/api-error.js';
import { PlaceOrderInput, UpdateOrderStatusInput } from '../schemas/order.schema.js';
import { OrderStatus } from '@prisma/client';

export class OrderService {
  static async placeOrder(userId: string, input: PlaceOrderInput) {
    // 1. Get user's cart
    const cart = await CartRepository.findOrCreateCart(userId);
    if (cart.items.length === 0) {
      throw ApiError.badRequest('Your cart is empty. Add items before placing an order.');
    }

    // 2. Validate delivery address belongs to user
    const address = await AddressRepository.findById(input.addressId);
    if (!address || address.userId !== userId) {
      throw ApiError.badRequest('Invalid delivery address selected');
    }

    // 3. Build order items with prices
    const orderItems: Array<{
      productId: string;
      variantId?: string;
      storeId: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }> = [];

    let subtotal = 0;

    for (const item of cart.items) {
      const product = await ProductRepository.findById(item.productId);
      if (!product) continue;

      // Select the cheapest available inventory store
      const available = product.inventory
        .filter((i) => i.isAvailable && i.stockQuantity >= item.quantity)
        .sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));

      if (available.length === 0) {
        throw ApiError.badRequest(`Product "${product.name}" is out of stock`);
      }

      const best = available[0];
      const unitPrice = best.salePrice ?? best.price;
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId ?? undefined,
        storeId: best.storeId,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });
    }

    const deliveryFee = 25;
    const taxAmount = 0;
    const discountAmount = 0;
    const finalAmount = subtotal + deliveryFee - discountAmount + taxAmount;

    // 4. Generate unique order number
    const orderNumber = await OrderRepository.generateOrderNumber();

    // 5. Create the order
    const order = await OrderRepository.create({
      customerId: userId,
      orderNumber,
      totalAmount: subtotal,
      deliveryFee,
      taxAmount,
      discountAmount,
      finalAmount,
      deliveryAddressId: input.addressId,
      notes: input.notes,
      paymentMethod: input.paymentMethod,
      items: orderItems,
    });

    // 6. Clear the cart after successful order
    await CartRepository.clearCart(cart.id);

    return order;
  }

  static async getMyOrders(userId: string, page: number, limit: number) {
    return OrderRepository.findByCustomerId(userId, page, limit);
  }

  static async getOrderById(orderId: string, userId: string, userRoles: string[]) {
    const order = await OrderRepository.findById(orderId);
    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    // Customers can only view their own orders; admin/merchant can view all
    if (!userRoles.includes('ADMIN') && !userRoles.includes('MERCHANT') && order.customerId !== userId) {
      throw ApiError.forbidden('You do not have permission to view this order');
    }

    return order;
  }

  static async updateOrderStatus(orderId: string, input: UpdateOrderStatusInput, changedByUserId: string) {
    const order = await OrderRepository.findById(orderId);
    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    await OrderRepository.updateStatus(orderId, input.status as OrderStatus, input.notes, changedByUserId);

    const updated = await OrderRepository.findById(orderId);
    return updated;
  }

  static async getAllOrdersForAdmin(params: { page: number; limit: number; status?: string }) {
    return OrderRepository.findAllForAdmin({
      page: params.page,
      limit: params.limit,
      status: params.status as OrderStatus | undefined,
    });
  }

  static async getMerchantOrders(storeId: string, params: { page: number; limit: number; status?: string }) {
    return OrderRepository.findByStoreId(storeId, {
      page: params.page,
      limit: params.limit,
      status: params.status as OrderStatus | undefined,
    });
  }
}
