# 🚀 CRM Application

A modern Customer Relationship Management (CRM) system built with NestJS backend and Next.js frontend, featuring comprehensive customer and order management capabilities.

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Docker Setup](#-docker-setup)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Usage](#-usage)

### Key Capabilities

- **Customer Management**: Create, view, edit, and soft-delete customers
- **Order Management**: Complete order lifecycle management with status tracking
- **Analytics Dashboard**: Revenue charts, order statistics, and business insights
- **Advanced Filtering**: Multi-criteria filtering for orders and customers
- **Bulk Operations**: Efficient bulk delete operations with detailed confirmation
- **Data Export**: Excel export functionality for orders and customers
- **Responsive Design**: Mobile-first approach with modern UI components

## CRM Monorepo — Structure

### Repository Layout

```bash
├─ .github/
│  └─ workflows/
│     └─ deploy.yml
├─ crm-backend/
├─ crm-frontend/
└─
```

#### crm-frontend:

```
crm-frontend/
├─ public/
├─ src/
│  ├─ app/
│  │  ├─ overview/
│  │  ├─ order/
│  │  └─ customer/
│  ├─ components/
│  │  ├─ layout/
│  │  ├─ providers/
│  │  ├─ ui/
│  │  ├─ order/
│  │  └─ customer/
│  ├─ hooks/
│  ├─ services/
│  ├─ lib/
│  ├─ schemas/
│  └─ types/
├─ components.json
├─ tailwind.config.js
├─ tsconfig.json
└─ package.json
```

#### crm-backend:

```
crm-backend/
├─ src/
│  ├─ main.ts
│  ├─ app.module.ts
│  ├─ config/
│  ├─ common/
│  │  ├─decorators/
│  │  ├─dto/
│  │  ├─enums/
│  │  ├─interceptors/
│  ├─ modules/
│  │  ├─ orders/
│  │  │  ├─ orders.controller.ts
│  │  │  ├─ orders.service.ts
│  │  │  ├─ repository/
│  │  │  ├─ dto/
│  │  │  └─ schemas/
│  │  └─ customers/
│  └─ utils/
├─ test/
├─ Dockerfile
└─ package.json

```

## ✨ Features

### Backend Features

- **RESTful API** with comprehensive CRUD operations
- **MongoDB Integration** with Mongoose ODM
- **Swagger Documentation** for API endpoints
- **Advanced Pagination** with sorting and filtering
- **Soft Deletion** for data integrity
- **Revenue Analytics** with time-based bucketing (1D, 7D, 1M, 1Y, ALL)
- **Order Overview Statistics** (total, in-progress, completed, revenue)
- **Data Validation** with class-validator and class-transformer
- **CORS Configuration** for cross-origin requests

### Frontend Features

- **Modern React UI** with Next.js 15 and App Router
- **Shadcn/UI Components** for consistent design system
- **Real-time State Management** with React Query
- **Form Handling** with React Hook Form and Zod validation
- **Responsive Tables** with sorting, filtering, and pagination
- **Modal System** for CRUD operations
- **Bulk Selection** with confirmation dialogs
- **Excel Export** functionality
- **Debounced Search** for optimal performance

## 🛠 Technology Stack

### Backend

- **NestJS** - Progressive Node.js framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Swagger** - API documentation
- **Class Validator** - Validation decorators
- **TypeScript** - Type-safe development

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Modern component library
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Recharts** - Data visualization
- **Axios** - HTTP client

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v22)
- **npm**
- **MongoDB** (local installation or MongoDB Atlas)
- **Docker** (optional, for containerized deployment)
- **Git**

## ⚡ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/nax-handle/hololab-test.git
cd hololab-test
```

### 2. Backend Setup

```bash
cd crm-backend

npm install

cp .env.example .env

npm run start:dev
```

The backend will be available at `http://localhost:8888` with Swagger documentation at `http://localhost:8888/api`

### 3. Frontend Setup

```bash
cd crm-frontend

npm install

cp .env.example .env.local

npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🐳 Docker Setup

### Backend Docker Setup

```bash
# Navigate to backend directory
cd crm-backend

# Build Docker image
docker build -t crm-backend .

# Run container
docker run -p 8888:8888 --env-file .env crm-backend
```

## 🔧 Environment Variables

### Backend (.env)

```env
NODE_ENV=development|production
PORT=8888
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crm?retryWrites=true&w=majority
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8888
```

## 📚 API Documentation

Once the backend is running, you can access the interactive Swagger documentation at:

**URL**: `http://localhost:8888/api`
