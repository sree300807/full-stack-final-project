# LEDGER Backend API • Node.js, Express, JWT & MongoDB

A production-grade, secure RESTful API for **LEDGER Personal Finance Management Web Application**, built with **Express.js**, **JWT (JSON Web Tokens)**, and **MongoDB with Mongoose ODM**.

---

## 🏗️ Architecture & Tech Stack

- **Runtime**: Node.js (CommonJS)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (`jsonwebtoken`) with `Bearer` Authorization headers
- **Password Security**: Salted SHA-256 Hashing with `bcryptjs`
- **Security & CORS**: Cross-Origin Resource Sharing (`cors`)

---

## 📁 Directory Structure (MVC Pattern)

```
server/
├── config/
│   └── db.js                 # MongoDB connection logic
├── controllers/
│   ├── authController.js     # User registration, login & profile
│   ├── transactionController.js # Transaction CRUD & aggregated stats
│   └── budgetController.js    # Budget limits vs real-time spending
├── middleware/
│   ├── authMiddleware.js     # JWT Bearer verification & user injection
│   └── errorMiddleware.js    # Centralized 404 & Mongoose error handler
├── models/
│   ├── User.js               # User schema with bcrypt pre-save hook
│   ├── Transaction.js        # Transaction schema with indexes
│   └── Budget.js             # Budget schema with unique compound index
├── routes/
│   ├── authRoutes.js         # /api/auth routes
│   ├── transactionRoutes.js  # /api/transactions routes
│   └── budgetRoutes.js       # /api/budgets routes
├── utils/
│   └── generateToken.js      # JWT signing helper (30-day expiry)
├── .env                      # Environment config (PORT, MONGO_URI, JWT_SECRET)
├── package.json              # Backend dependencies
└── server.js                 # Application entry point
```

---

## 🔐 Authentication Flow (JWT)

1. **User Registers / Logs in** (`POST /api/auth/register` or `POST /api/auth/login`).
2. Server validates password against the salted hash stored in MongoDB using `bcrypt.compare`.
3. Server generates a signed JWT containing the user's `_id` and signs it using `JWT_SECRET`.
4. Client stores the token and passes it in the `Authorization` header for subsequent requests:
   ```http
   Authorization: Bearer <your_jwt_token_here>
   ```
5. `authMiddleware.protect` extracts the token, verifies the signature, and attaches the authenticated user document to `req.user`.

---

## 📡 Complete REST API Endpoints

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user (returns user data + JWT) |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/auth/me` | Protected (JWT) | Get current user's profile |
| `PUT` | `/api/auth/me` | Protected (JWT) | Update profile, currency, theme, savings goal |

### 2. Transactions (`/api/transactions`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/transactions` | Protected (JWT) | Get all transactions with search, type, category & date filters |
| `POST` | `/api/transactions` | Protected (JWT) | Create a new transaction |
| `PUT` | `/api/transactions/:id` | Protected (JWT) | Update an existing transaction |
| `DELETE`| `/api/transactions/:id` | Protected (JWT) | Remove a transaction |
| `GET` | `/api/transactions/stats` | Protected (JWT) | Get total balance, monthly savings, and category distribution |

### 3. Budgets (`/api/budgets`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/budgets` | Protected (JWT) | Get category budgets + real-time calculated spending |
| `POST` | `/api/budgets` | Protected (JWT) | Set or update monthly category budget limit |
| `DELETE`| `/api/budgets/:id` | Protected (JWT) | Delete a budget limit |

---

## 🚀 How to Run the Server

```bash
# 1. Navigate to the server folder
cd /Users/bookpro/Projects/ledger-finance-app/server

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server with auto-reload
npm run dev

# Or start standard production server
npm start
```

---

## 🧪 Quick Test Commands (cURL / Postman)

### 1. Register a Test User:
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aarav Sharma",
    "email": "aarav@fintech.io",
    "password": "Password123"
  }'
```

### 2. Login:
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "aarav@fintech.io",
    "password": "Password123"
  }'
```

### 3. Create a Transaction (Replace `<TOKEN>` with your JWT):
```bash
curl -X POST http://localhost:5001/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "description": "TechCorp Monthly Salary",
    "amount": 145000,
    "type": "income",
    "category": "Salary"
  }'
```
