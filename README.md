# 💻 Enterprise IT Device Management System (DeviceHub)

An enterprise-grade, full-stack IT asset and device management platform engineered with **Java 21 (Spring Boot 3)**, **React 18 (TypeScript & Tailwind CSS)**, **PostgreSQL 16**, **Docker**, and **GitHub Actions (CI/CD)**.

![Status](https://img.shields.io/badge/Status-Production%20Ready-emerald?style=for-the-badge)
![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## 🌟 Key Features

- 🔐 **Stateless JWT Security & RBAC:** Complete authentication flow with JSON Web Tokens, **BCrypt** password hashing, and Role-Based Access Control (`ROLE_ADMIN` & `ROLE_EMPLOYEE`).
- 💻 **Complete Device Inventory Management (CRUD):** Real-time asset lifecycle management with unique serial number tracking, categorical filtering (*Laptop, Phone, Monitor, Accessory*), and dynamic statuses (*Available, Assigned, Maintenance*).
- 🔄 **One-Click Assignment & Return Workflow:** Seamless device assignment to employees with technical handover notes and instant return verification.
- 📜 **Immutable Audit Trail (Assignment History):** Automated timeline logs capturing historical assignments, return timestamps, recipient profiles, and asset condition notes.
- 🎨 **Modern & Intuitive User Experience:** Responsive web dashboard built with React 18, TypeScript, Tailwind CSS, Lucide icons, live statistics widgets, dynamic search, and custom dropdown components.
- 🐳 **Production-Ready Multi-Stage Dockerization:** Optimized multi-stage Docker builds for backend and frontend with an **Nginx Reverse Proxy**.
- 🤖 **Automated CI/CD Pipeline:** GitHub Actions workflow executing build verification, type checking, unit tests, and Docker container compilation on every commit.

---

## 🏗️ System Architecture

```
[ Client / Browser ] ──( HTTP / JWT )──► [ Nginx Reverse Proxy :80 ]
                                                  │
                       ┌──────────────────────────┴──────────────────────────┐
                       ▼                                                     ▼
             [ React 18 SPA ]                                    [ Spring Boot 3 REST API :8080 ]
         ( TypeScript + Tailwind )                               ( Spring Security + Data JPA )
                                                                             │
                                                                             ▼
                                                                  [ PostgreSQL 16 DB ]
```

---

## 🚀 Quick Start with Docker

Run the entire platform (PostgreSQL + Spring Boot Backend + React Frontend + pgAdmin) with a single command:

```bash
docker compose up --build -d
```

### 🌐 Service Endpoints

| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend Web App** | [http://localhost:3000](http://localhost:3000) | Main React Management Dashboard |
| **Backend REST API** | [http://localhost:8080/api/v1](http://localhost:8080/api/v1) | Spring Boot REST Endpoints |
| **pgAdmin (Database UI)** | [http://localhost:5050](http://localhost:5050) | PostgreSQL Management Portal |

---

## 🧪 Pre-configured Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **👑 IT Administrator** | `admin@devicemanagement.com` | `Password123!` |

---

## 📡 REST API Reference

### 🔑 Authentication Endpoints (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register a new user (`ADMIN` or `EMPLOYEE`) |
| `POST` | `/api/v1/auth/login` | Public | Authenticate and retrieve JWT Bearer Token |

### 💻 Device Endpoints (`/api/v1/devices`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/devices` | Authenticated | Retrieve all devices with optional `category` and `status` query filters |
| `GET` | `/api/v1/devices/{id}` | Authenticated | Get detailed device profile by ID |
| `POST` | `/api/v1/devices` | Admin Only | Register a new IT asset |
| `PUT` | `/api/v1/devices/{id}` | Admin Only | Update existing device information |
| `DELETE` | `/api/v1/devices/{id}` | Admin Only | Delete an unassigned device |
| `POST` | `/api/v1/devices/{id}/assign` | Admin Only | Assign device to an employee with notes |
| `POST` | `/api/v1/devices/{id}/return` | Admin Only | Return device to inventory |
| `GET` | `/api/v1/devices/{id}/history` | Authenticated | View full immutable assignment timeline |

---

## 📂 Project Structure

```text
device-management-system/
├── backend/
│   ├── src/main/java/com/devicemanagement/
│   │   ├── controller/       # REST API Controllers (Auth, Device, User)
│   │   ├── service/          # Business Logic, Validation & Transactions
│   │   ├── repository/       # Spring Data JPA Repositories
│   │   ├── model/            # JPA Database Entities (User, Device, History)
│   │   ├── security/         # JWT Filter, UserDetails & SecurityConfig
│   │   ├── dto/              # Request & Response Data Transfer Objects
│   │   └── exception/        # Global Exception Handler
│   ├── src/main/resources/   # Application Configuration (application.yml)
│   ├── pom.xml               # Maven Dependencies (Java 21, Spring Boot 3)
│   └── Dockerfile            # Multi-stage Java 21 runtime build
├── frontend/
│   ├── src/
│   │   ├── components/       # Modals (Device, Assign, History), Custom Dropdowns, Navbar
│   │   ├── pages/            # Login & Dashboard Views
│   │   ├── context/          # Global Authentication Context & State
│   │   ├── services/         # Axios Client with automatic JWT Interceptors
│   │   └── types/            # Strict TypeScript Interfaces & Enums
│   ├── nginx.conf            # Single Page Application routing & Reverse Proxy
│   ├── vite.config.ts        # Vite Build Configuration
│   ├── tailwind.config.js    # Tailwind CSS Styling
│   └── Dockerfile            # Multi-stage Node build with Nginx
├── .github/
│   └── workflows/
│       └── ci-cd.yml         # GitHub Actions Automated CI/CD Pipeline
└── docker-compose.yml        # Full-Stack Orchestration Configuration
```

---

## 🛠️ Local Development Setup

### Backend Prerequisites:
- **Java 21 JDK**
- **Maven 3.9+**
- **PostgreSQL 16** (or run via Docker: `docker compose up postgres-db -d`)

```bash
cd backend
mvn clean spring-boot:run
```

### Frontend Prerequisites:
- **Node.js 20+**
- **NPM 10+**

```bash
cd frontend
npm install
npm run dev
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
