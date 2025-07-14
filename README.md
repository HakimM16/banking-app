# 🏦 Banking Application

A secure and user-friendly banking system that allows customers to create and manage accounts, perform transactions, and maintain financial records. Built with **Next.js** (frontend), **Spring Boot** (backend), and **PostgreSQL** (database).

## 🔧 Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/)
- **Backend:** [Spring Boot](https://spring.io/projects/spring-boot)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Authentication:** JWT / Spring Security (planned)
- **Deployment:** Docker / Kubernetes (optional for production)

## ✨ Features

### 👤 User Management
- Secure user registration and login
- Authentication with encrypted passwords
- Profile management with personal and contact details

### 💼 Account Management
- Create and manage different types of accounts (e.g., Checking, Savings)
- View account details and current balances
- Handle account status (Active, Inactive, Frozen)

### 💸 Transaction Operations
- Internal money transfers between user accounts
- Deposit and withdrawal functionality
- Searchable and filterable transaction history

### 🔐 Security & Compliance
- Secure login system with encrypted credentials
- Session handling with timeout/auto logout
- Transaction validation and configurable limits

## 📂 Project Structure

```
/client          -> Next.js frontend
/server          -> Spring Boot backend
/database        -> PostgreSQL setup (scripts/migrations)
README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 18.x)
- Java 17+
- PostgreSQL
- Docker (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/banking-app.git
cd banking-app
```

### 2. Set Up the Database

- Create a PostgreSQL database named `banking_app`
- Set credentials in `/server/src/main/resources/application.properties` or use environment variables

### 3. Run the Backend (Spring Boot)

```bash
cd server
./mvnw spring-boot:run
```

### 4. Run the Frontend (Next.js)

```bash
cd client
npm install
npm run dev
```

## ⚙️ Configuration

- **Backend config:** `/server/src/main/resources/application.properties`
- **Frontend config:** `/client/.env.local`

## 📌 Future Enhancements

- Two-factor authentication (2FA)
- Mobile responsiveness and PWA support
- Admin dashboard for monitoring and management
- Notifications via email/SMS
