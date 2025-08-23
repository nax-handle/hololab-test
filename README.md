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
- [Describe](#-describe)

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
- **Real-time State Management** with React Query (TanStack Query)
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
- **TanStack Query** - Server state management
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

## 📖 Describe

### Getting Started

You can access the CRM application at `https://hololab.interview.io.vn/overview`. The application features a clean, intuitive interface with the following main sections:

### 🏠 Dashboard Overview

Navigate to `/overview` to access the main dashboard:

- **Statistics Cards**: View key metrics including total orders, revenue, in-progress orders, and completed orders
- **Revenue Chart**: Interactive chart with multiple time periods (1D, 7D, 1M, 1Y, All)
- **Date Range Filter**: Select custom date ranges to analyze specific periods
- **Recent Orders**: Quick view of the latest orders with status indicators

### 👥 Customer Management

Access customer management at `/customer`:

#### Creating Customers

1. Click the **"Add Customer"** button
2. Fill in the required information:
   - Full Name
   - Email Address
   - Phone Number
   - Company Name
   - Address
3. Click **"Create Customer"** to save

#### Managing Customers

- **Search**: Use the search bar to find customers by name, email, phone, or company
- **View Details**: Click the eye icon to view customer details and associated orders
- **Edit Customer**: Click the edit icon to update customer information
- **Delete Customer**: Click the delete icon to soft-delete a customer (data is preserved)
- **Export Data**: Use the "Export Excel" button to download customer data

### 📋 Order Management

Access order management at `/order`:

#### Creating Orders

1. Click the **"Add Order"** button
2. Fill in the order details:
   - **Customer**: Enter customer ID or email address
   - **Order Type**: Select from Sales, Service, or Subscription
   - **Total Amount**: Enter the order value
   - **Description**: Add optional order description
3. Click **"Create Order"** to save

#### Managing Orders

- **Search & Filter**:
  - Search by customer, description, or order ID
  - Filter by status, order type, amount range, and date range
  - Use active filters to refine your view
- **Status Management**:
  - **Pending** → **Processing** → **Completed**
  - **Pending** → **Cancelled**
  - **Processing** → **Cancelled**
- **Bulk Operations**:
  - Select multiple pending orders using checkboxes
  - Delete selected orders with confirmation dialog
- **Export Data**: Download filtered order data to Excel

#### Order Status Workflow

<img width="1207" height="416" alt="image" src="https://github.com/user-attachments/assets/655db243-94de-4d37-8c10-7bfc91d14037" />

### 🔍 Advanced Features

#### Filtering and Search

- **Debounced Search**: Real-time search with optimized performance
- **Multi-criteria Filtering**: Combine multiple filters for precise results
- **Date Range Selection**: Custom date pickers for time-based filtering
- **Active Filter Management**: View and remove applied filters easily

#### Data Export

- **Excel Export**: Download customer and order data in Excel format
- **Filtered Exports**: Export only the data matching your current filters
- **Bulk Data**: Export large datasets efficiently

#### Responsive Design

- **Mobile-First**: Optimized for mobile devices and tablets
- **Adaptive Tables**: Columns hide/show based on screen size
- **Touch-Friendly**: Large touch targets for mobile interaction

### 🎯 Common Workflows

#### Processing a New Order

1. **Customer Check**: Verify customer exists or create new customer
2. **Order Creation**: Create order with customer association
3. **Status Updates**: Move order through workflow (Pending → Processing → Completed)
4. **Analytics**: Track order in dashboard metrics

#### Monthly Reporting

1. **Dashboard**: Navigate to overview page
2. **Date Filter**: Select monthly date range
3. **Export Data**: Download order data for the period
4. **Analysis**: Review revenue charts and statistics

#### Customer Service

1. **Search Customer**: Find customer by email or phone
2. **View History**: Check customer's order history
3. **Order Management**: Update order status or add new orders
4. **Communication**: Use order descriptions for notes and updates
