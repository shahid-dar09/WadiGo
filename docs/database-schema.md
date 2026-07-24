# WadiGo Database Schema Documentation

## Database System: MySQL (`wadigo_db`) via Prisma ORM

### Core Entities & Relationships

1. **User & Auth**:
   - `User`: Primary user accounts (Customers, Merchants, Drivers, Admins).
   - `Role`: Security roles (CUSTOMER, MERCHANT, DELIVERY_PARTNER, ADMIN).
   - `UserRole`: Many-to-many junction between Users and Roles.
   - `RefreshToken`: Secure session tokens for JWT authentication.

2. **Merchant & Store**:
   - `MerchantProfile`: Business identity details, verification status, and ratings.
   - `Store`: Physical store outlets with geo-coordinates (`latitude`, `longitude`), address, and active status.
   - `StoreOperatingHours`: Weekly opening/closing schedule.

3. **Catalog & Inventory**:
   - `Category`: Hierarchical product categories (e.g. Fresh Produce, Dairy, Electronics).
   - `Product`: Master product entity (name, slug, description, image, unit, category).
   - `ProductVariant`: SKU variations (size, color, weight).
   - `InventoryItem`: Store-level stock mapping containing `storeId`, `productId`, `variantId`, `price`, `salePrice`, `stockQuantity`, `isAvailable`.

4. **Cart & Checkout**:
   - `Cart`: User active shopping cart.
   - `CartItem`: Items attached to cart with selected product and optional target store.

5. **Order & Logistics**:
   - `Order`: Customer order header (`orderNumber`, `customerId`, `totalAmount`, `status`, `paymentStatus`, `deliveryAddress`).
   - `OrderItem`: Line items within an order.
   - `OrderMerchantAssignment`: Assignment record matching stores to order items.
   - `OrderStatusHistory`: Audit trail of order status updates.

6. **Customer Profile & AI Logs**:
   - `CustomerAddress`: Delivery addresses with coordinates.
   - `Review`: Merchant/Product ratings and reviews.
   - `AiSearchQuery` & `AiRecommendationLog`: Tracking search intent and AI recommendation events.
