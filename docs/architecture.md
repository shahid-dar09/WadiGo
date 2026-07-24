# WadiGo System Architecture

## 1. System High-Level Overview
WadiGo operates as a multi-sided hyperlocal engine connecting Customers, Merchants, and Delivery Partners:

```
+-----------------------------------------------------------------------+
|                         Customer Web App                              |
|          (React + Vite + TypeScript + Tailwind + Zustand)             |
+-----------------------------------------------------------------------+
                                   | HTTP / WebSocket
                                   v
+-----------------------------------------------------------------------+
|                          Backend Server                               |
|                  (Node.js + Express + Socket.IO)                      |
|                                                                       |
|  [ Routes ] -> [ Controllers ] -> [ Services ] -> [ Repositories ]    |
+-----------------------------------------------------------------------+
                                   | ORM
                                   v
+-----------------------------------------------------------------------+
|                           Database                                    |
|                      (MySQL - XAMPP / Prisma)                         |
+-----------------------------------------------------------------------+
```

---

## 2. Core Hyperlocal Routing Logic (Product-First Engine)
When a customer searches or places an order for a product:
1. System queries all `InventoryItem` records where `productId` matches and `stockQuantity` > 0.
2. System evaluates candidate `Store` locations within the customer's max delivery radius.
3. Scoring algorithm calculates:
   $$\text{Score} = w_1(\text{Distance}) + w_2(\text{Price}) + w_3(\text{PrepTime}) - w_4(\text{MerchantRating})$$
4. The merchant with the optimal score is selected for fulfillment.

---

## 3. Realtime Architecture (Socket.IO)
- Customer order tracking room: `order:{orderId}`
- Merchant dashboard room: `merchant:{merchantId}`
- Delivery agent dispatch room: `driver:{driverId}`
