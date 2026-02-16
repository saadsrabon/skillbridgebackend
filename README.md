# SkillBridge 🎓 Backend

**The Powerhouse Behind Expert Connections**

A robust Node.js & Express backend for the SkillBridge LMS platform. It handles authentication, profile management, tutor availability, booking logic, and administrative controls using Prisma ORM and PostgreSQL.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Better Auth (Session-based)
- **Validation:** Zod

## 🛠️ Prerequisites

- Node.js 18+
- PostgreSQL instance running
- Backend environment variables configured

## 📦 Installation

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/skillbridge"
   BETTER_AUTH_SECRET="your_secret"
   BETTER_AUTH_URL="http://localhost:5000"
   APP_URL="http://localhost:3000"
   # Email configuration (SMTP)
   # Google OAuth configuration
   ```

## 🗄️ Database Setup

1. **Run migrations**
   ```bash
   npx prisma migrate dev
   ```
2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```
3. **Seed the database**
   ```bash
   npm run seed
   ```

## 🏃 Running the Server

- **Development Mode:**
  ```bash
  npm run dev
  ```
- **Build & Production:**
  ```bash
  npm run build
  npm start
  ```

## 🏗️ Project Architecture

The project follows a modular structure:
- **`src/modules`**: Core business logic divided into modules:
  - `auth`: User authentication and session management.
  - `profile`: Student and Tutor profile CRUD.
  - `availiblity`: Tutor slot management.
  - `boooking`: Booking workflow and review system.
  - `subject`: Education subjects and categories.
  - `admin`: User management and analytics.
- **`src/middlewares`**: Authentication checks (`authChecker`), error handling, and request logging.
- **`src/lib`**: Shared utilities and Prisma client singleton.
- **`prisma/schema`**: Split Prisma models for better maintainability.

## 📄 API Documentation

- A detailed integration guide for the frontend can be found in [FRONTEND_API.md](FRONTEND_API.md).
- A Postman collection is available at `SkillBridge_Postman_Collection.json`.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git checkout -b feature/AmazingFeature`)
5. Open a Pull Request
