# WadiGo - Enterprise AI-Powered Hyperlocal Commerce Platform

WadiGo is a product-first hyperlocal marketplace where customers shop for items across local merchants effortlessly. The platform intelligently routes orders based on inventory, price, distance, rating, and preparation time.

---

## 🏗️ Repository Structure

```
WadiGo/
├── AGENTS.md             # Master specification & coding rules
├── README.md             # Repository documentation & local setup guide
├── docs/                 # Architectural blueprints & DB schemas
├── frontend/             # React + Vite + TypeScript + Tailwind CSS customer app
└── backend/              # Node.js + Express + TypeScript + Prisma ORM backend
```

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18+
- **XAMPP**: Running Apache and MySQL service
- **Database**: MySQL running at `localhost:3306`

### 2. Backend Setup
```bash
cd backend
npm install
# Create database and push schema
npx prisma db push
# Start backend server
npm run dev
```
Backend server will run on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend application will run on `http://localhost:5173`.

---

## 🌟 Key Features (Milestone 1 - Foundation)
- Modern glassmorphic responsive design system with dark mode support.
- Layered Express backend (Routes $\rightarrow$ Controllers $\rightarrow$ Services $\rightarrow$ Repositories).
- Prisma MySQL ORM models for Users, Merchants, Stores, Products, Inventory, Carts, Orders, and AI logs.
- Axios HTTP client with automatic token injection.
- Socket.IO foundation for real-time order tracking.

---

## 🔒 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=mysql://root:@localhost:3306/wadigo_db
JWT_SECRET=wadigo_super_secret_jwt_key_2026
JWT_REFRESH_SECRET=wadigo_super_secret_refresh_key_2026
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```
