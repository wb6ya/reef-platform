# 🌾 Reef Platform (منصة ريف)
**The Ultimate Mobile-First C2C Agricultural Marketplace**

Reef is a high-performance, strictly mobile-first marketplace built specifically to connect rural farmers, equipment owners, and livestock breeders. Engineered for low-bandwidth networks and older demographics, Reef prioritizes massive touch targets, ultra-fast stateless edge architecture, and seamless native RTL (Right-to-Left) mirroring.

---

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Database:** Neon Serverless PostgreSQL
- **ORM:** Prisma
- **Styling:** Tailwind CSS (Strictly using RTL CSS Logical Properties)
- **Authentication:** Custom Passwordless OTP via edge-compatible `jose` JWTs
- **State Management:** `zustand` with `localStorage` persistence for stateless caching.
- **PWA:** `next-pwa` for offline capabilities and app-like installation
- **Icons:** Lucide React

---

## ✨ Core Engineering Features

### 1. Dynamic JSONB Schema Engine
Instead of rigid database tables, Reef uses a highly dynamic `JSONB` schema model. Categories (like *Livestock* vs. *Equipment*) define their own required fields natively in the database. The React Hook Form engine dynamically parses these schemas to generate contextual UI wizards on the fly.

### 2. Native Edge Client-Side Compression
To support rural users with slow 3G/4G connections, Reef bypasses traditional massive S3 uploads. It leverages native HTML5 `<canvas>` APIs to compress 8MB camera photos into ultra-tiny 40KB `WebP` strings *before* they leave the device, enabling instant Base64 serverless storage.

### 3. Stateless OTP & Edge JWTs
NextAuth/Auth.js was explicitly rejected to minimize middleware bloat. Reef uses a custom stateless session architecture. Phone numbers generate an OTP, which signs a highly secure `jose` JWT into an `httpOnly` cookie. The Next.js Edge Middleware intercepts and validates routes in milliseconds without ever hitting the database.

### 4. Stateless Polling Chat & Dual Communication
WebSockets are notoriously unreliable on rural cellular networks. Reef's internal chat uses Server Actions and Next.js `router.refresh()` to create an incredibly fast, stateless long-polling inbox. Sellers are also deeply integrated with WhatsApp via pre-filled `wa.me` intents.

### 5. Flawless Native RTL Compliance
Every piece of the UI uses CSS Logical Properties (`ps-`, `pe-`, `ms-`, `me-`). The application flawlessly mirrors layouts without a single `flex-row-reverse` hack, ensuring total visual perfection in both Arabic and English.

### 6. Stateless Zustand Persistence
To avoid heavy database queries for user preferences like "Favorites", Reef utilizes `zustand` with `localStorage` middleware. Global state is completely detached from the Next.js server, allowing for instantaneous client-side UI updates.

---

## 🛠️ Getting Started Locally

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database URL (Neon recommended)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@host/neondb"
   JWT_SECRET="your-super-secret-key-must-be-32-chars-long"
   ```

3. **Sync the Database Schema:**
   ```bash
   npx prisma db push
   ```

4. **Seed the Dynamic Categories:**
   Populate the database with the core dynamic JSONB schemas:
   ```bash
   npx tsx prisma/seed.ts
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the platform!
