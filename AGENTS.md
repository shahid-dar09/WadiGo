# AGENTS.md - WadiGo Master Specification & Architecture Rules

## 1. Project Vision
**WadiGo** is an enterprise-grade, AI-powered hyperlocal commerce platform designed around a **PRODUCT-FIRST** shopping experience. Customers search and shop for products rather than browsing individual storefronts. The engine dynamically aggregates and selects the best merchant(s) for order fulfillment based on:
- Inventory availability & freshness
- Competitive pricing
- Proximity & distance
- Estimated delivery & preparation time
- Merchant ratings & fulfillment metrics

---

## 2. Complete Phase Roadmap
- **Phase 0**: Architectural Planning & Core Scaffolding
- **Phase 1**: Customer Web Application (Vite + React + TS + Tailwind)
- **Phase 2**: Backend Expansion (Node.js + Express + TS + Prisma + Socket.IO)
- **Phase 3**: Frontend-Backend Integration & Realtime Sync
- **Phase 4**: Merchant Dashboard & Inventory Management
- **Phase 5**: Delivery Partner Dashboard & Logistics Dispatch
- **Phase 6**: Admin Dashboard & Platform Governance
- **Phase 7**: AI Engine & Smart Hyperlocal Optimization
- **Phase 8**: Android Application (React Native / Android Native)
- **Phase 9**: iOS Application

---

## 3. Technology Stack Rules
### Frontend (`/frontend`)
- Framework: React 18+ with TypeScript (Strict mode)
- Build Tool: Vite
- Styling: Tailwind CSS (Vanilla CSS design system custom tokens, smooth animations, glassmorphism)
- State Management: Zustand
- Data Fetching & HTTP: Axios
- Form Handling & Validation: React Hook Form + Zod
- Animations: Framer Motion
- Icons: Lucide React

### Backend (`/backend`)
- Runtime: Node.js 18+ (TypeScript)
- Framework: Express.js (Layered Architecture: Controller $\rightarrow$ Service $\rightarrow$ Repository)
- ORM: Prisma ORM (Prisma Client + Prisma Migrate)
- Database: MySQL (`wadigo_db`)
- Realtime: Socket.IO
- Security: JWT, Refresh Tokens, bcrypt, Helmet, CORS, Rate Limiting
- Input Validation: Zod schemas for all endpoints

---

## 4. Coding Standards & Architecture Rules
- **Clean Layered Architecture**:
  - `Routes`: Map HTTP methods to Controller actions.
  - `Controllers`: Handle request extraction, trigger validation, delegate to Service, format `ApiResponse`.
  - `Services`: Contain domain business logic, orchestration, and transaction control.
  - `Repositories`: Interface directly with Prisma Client for data access.
- **Type Safety**: No usage of `any`. Explicit interfaces for all request parameters, payload bodies, and domain models.
- **Response Standardization**:
  All API endpoints return:
  ```json
  {
    "success": true | false,
    "message": "Human readable message",
    "data": { ... } | null,
    "errors": [ ... ] | null,
    "meta": { ... } | null
  }
  ```
- **Error Handling**: Use custom `ApiError` class with HTTP status code and clean message. Never leak stack traces or internal raw SQL errors in production.


## 5. Security & Database Rules
- Use local XAMPP MySQL during development: `DATABASE_URL=mysql://root:@localhost:3306/wadigo_db`
- Every table must possess:
  - Primary Key (`id` String UUID or CUID)
  - `createdAt` and `updatedAt` timestamps
  - Appropriate foreign keys, constraints, and indexes on frequent queries (e.g. `merchantId`, `categoryId`, `orderId`, `status`).
- Always hash passwords using `bcrypt` (10 rounds).
- Sensitive configuration MUST be loaded from environment variables (`.env`).
