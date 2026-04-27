# Horizon UI - Core Banking & Management System ⚡️

A powerful, modern, and comprehensive Core Banking and Microfinance Management System built with **Next.js 15**, **React 19**, and **Tailwind CSS**. This platform provides a robust solution for managing branches, members, and a wide array of financial products with a premium user interface.

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/horizon-ui/horizon-tailwind-react-nextjs)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)

---

## 🌟 Overview

Horizon UI Banking System is designed for financial institutions and microfinance organizations to streamline their operations. From member onboarding and branch management to tracking complex transactions and managing various deposit/loan accounts, this system offers a centralized dashboard with real-time insights.

---

## ✨ Key Features

### 🏢 Branch & Zone Management
- **Hierarchical Structure**: Manage zones and branches across different regions.
- **Geo-Fencing**: Enable/disable geo-fencing for branch-specific operations.
- **Level Management**: Define different branch levels and administrative hierarchies.

### 👥 Member & User Management
- **Multi-Role Access**: Dedicated portals for Admins, Members, and Agents with granular permissions.
- **Member Onboarding**: Comprehensive onboarding process including Aadhaar/PAN verification and bank details.
- **Verification Workflow**: Integrated account verification tokens and expiry management.

### 💰 Financial Products
- **Savings & Current Accounts**: Real-time balance tracking and transaction history.
- **Fixed Deposits (FD)**: Manage principal amounts, interest rates, tenure, and maturity calculations.
- **Recurring Deposits (RD)**: Track monthly installments, interest earned, and maturity dates.
- **Monthly Income Schemes (MIS)**: Automated monthly payout tracking and investment management.
- **Loan Management**: EMI calculations, outstanding amount tracking, and purpose-based loan disbursement.

### 📊 Advanced Analytics
- **ApexCharts Integration**: Interactive data visualization for financial trends and member growth.
- **Reporting**: Detailed reports for banking operations, member status, and branch performance.

### 🛠 Technical Excellence
- **API Documentation**: Built-in **Swagger UI** for easy API testing and integration.
- **Prisma ORM**: Robust database management with TypeSafe queries.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile views using Tailwind CSS.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Chakra UI](https://chakra-ui.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: JWT-based auth (jose, jsonwebtoken, bcryptjs)
- **Charts**: [ApexCharts](https://apexcharts.com/)
- **Tables**: [TanStack Table](https://tanstack.com/table/v8)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Documentation**: [Swagger JSDoc](https://github.com/Surnet/swagger-jsdoc)

---

## 🛠 Getting Started

### Prerequisites

- **Node.js**: LTS version (v18 or higher recommended)
- **PostgreSQL**: A running instance or a cloud database (e.g., Neon Tech)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/saika/horizon-tailwind-react-nextjs-main.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="your_postgresql_connection_string"
   JWT_SECRET="your_secure_secret_key"
   JWT_EXPIRES_IN="1d"
   ```

4. **Database Setup**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📄 API Documentation

This project includes integrated Swagger documentation. Once the server is running, you can access the API explorer at:
`http://localhost:3000/swagger`

---

## 🤝 Community & Support

- 💬 [Join our Discord](https://discord.gg/f6tEKFBd4m)
- 🐞 [Report an Issue](https://github.com/saika/horizon-tailwind-react-nextjs-main/issues)

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

© 2024 Simmmple. Optimized and customized for Core Banking Operations.

