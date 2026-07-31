# Vault-Password-Credential-Management-System
# 🔐 SecureVault - Password & Credential Management System

SecureVault is a secure password and credential management system developed using **Spring Boot**, **React**, and **PostgreSQL**. It allows users to register, log in, and securely manage their credentials with password recovery through OTP verification.

---

## 🚀 Features

- 👤 User Registration
- 🔑 User Login
- 🔒 BCrypt Password Encryption
- 📧 Forgot Password using Email OTP
- ✅ OTP Verification
- 🔄 Secure Password Reset
- ⚠️ Global Exception Handling
- 🗄️ PostgreSQL Database Integration
- 🌐 RESTful APIs
- 💻 React Frontend

---

## 🛠️ Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- PostgreSQL
- Maven
- JavaMailSender

### Frontend
- React
- Vite
- React Router DOM
- Axios
- CSS

---

## 📂 Project Structure

### Backend

```
backend/
├── controller
├── dto
├── entity
├── repository
├── service
├── exception
└── config
```

### Frontend

```
frontend/
├── pages
├── components
├── services
├── styles
└── assets
```

---

## 🔄 Authentication Flow

```
Register
   │
   ▼
Login
   │
   ▼
Forgot Password
   │
   ▼
Email OTP
   │
   ▼
Verify OTP
   │
   ▼
Reset Password
   │
   ▼
Login with New Password
```

---

## ⚙️ Installation

### Backend

```bash
git clone <repository-url>

cd backend

mvn spring-boot:run
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## 📌 Future Enhancements

- JWT Authentication
- Password Vault Module
- Credential Categories
- Password Generator
- Password Strength Checker
- Search Credentials
- User Profile Management

---

## 👨‍💻 Author

**Mohammed Zain**

GitHub: https://github.com/MohammedZain39