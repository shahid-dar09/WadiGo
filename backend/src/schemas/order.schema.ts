import { z } from 'zod';

export const placeOrderSchema = z.object({
  addressId: z.string().min(1, 'Delivery address is required'),
  notes: z.string().max(500).optional(),
  paymentMethod: z.enum(['COD']).default('COD'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'MERCHANT_ASSIGNED',
    'PREPARING',
    'READY_FOR_PICKUP',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ]),
  notes: z.string().optional(),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
