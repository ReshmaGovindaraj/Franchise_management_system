# System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     FRANCHISE MANAGEMENT SYSTEM                         │
│                          Architecture Overview                          │
└─────────────────────────────────────────────────────────────────────────┘

                              CLIENT LAYER
                              ============

    ┌────────────────────────────────────────────────────────┐
    │              React Frontend Application                │
    │                 (Port 3000)                            │
    ├────────────────────────────────────────────────────────┤
    │                                                        │
    │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
    │  │   Admin      │  │   Branch     │  │   Common     │ │
    │  │ Dashboard    │  │ Dashboard    │  │ Components   │ │
    │  ├──────────────┤  ├──────────────┤  ├──────────────┤ │
    │  │ - Analytics  │  │ - Summary    │  │ - Navbar     │ │
    │  │ - Charts     │  │ - Low Stock  │  │ - Modals     │ │
    │  │ - Reports    │  │ - Alerts     │  │ - Tables     │ │
    │  └──────────────┘  └──────────────┘  └──────────────┘ │
    │                                                        │
    │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
    │  │  Branch      │  │  Inventory   │  │  Sales       │ │
    │  │  Management  │  │  Management  │  │  Management  │ │
    │  ├──────────────┤  ├──────────────┤  ├──────────────┤ │
    │  │ - Add/Edit   │  │ - Track      │  │ - Record     │ │
    │  │ - Assign     │  │ - Reorder    │  │ - Expenses   │ │
    │  │   Managers   │  │ - Low Stock  │  │ - Reports    │ │
    │  └──────────────┘  └──────────────┘  └──────────────┘ │
    │                                                        │
    │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
    │  │  Staff       │  │  Restock     │  │  Login       │ │
    │  │  Management  │  │  Requests    │  │              │ │
    │  ├──────────────┤  ├──────────────┤  ├──────────────┤ │
    │  │ - Add/Edit   │  │ - Create     │  │ - Session    │ │
    │  │ - Attendance │  │ - Approve    │  │ - Auth       │ │
    │  │ - Salary     │  │ - Fulfill    │  │ - bcrypt     │ │
    │  └──────────────┘  └──────────────┘  └──────────────┘ │
    │                                                        │
    └────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            │ Axios
                            ▼


                          API LAYER
                          =========

    ┌────────────────────────────────────────────────────────┐
    │          Express.js REST API Server                    │
    │             (Port 5000)                                │
    ├────────────────────────────────────────────────────────┤
    │                                                        │
    │  Middleware Layer                                      │
    │  ├─ Session Authentication                            │
    │  ├─ Role-Based Access Control                         │
    │  └─ CORS Handling                                     │
    │                                                        │
    │  Routes & Controllers                                 │
    │  ├─ /api/auth          → authController               │
    │  ├─ /api/branches      → branchController             │
    │  ├─ /api/inventory     → inventoryController          │
    │  ├─ /api/sales         → salesController              │
    │  ├─ /api/staff         → staffController              │
    │  ├─ /api/restock       → restockController            │
    │  └─ /api/dashboard     → dashboardController          │
    │                                                        │
    │  Business Logic                                        │
    │  ├─ Authentication & Authorization                    │
    │  ├─ Data Validation                                   │
    │  ├─ Business Rules Enforcement                        │
    │  └─ Transaction Management                            │
    │                                                        │
    └────────────────────────────────────────────────────────┘
                            │
                            │ Mongoose
                            │ Driver
                            ▼


                         DATA LAYER
                         ==========

    ┌────────────────────────────────────────────────────────┐
    │              MongoDB Database                          │
    │                                                        │
    ├────────────────────────────────────────────────────────┤
    │                                                        │
    │  Collections (Tables)                                 │
    │                                                        │
    │  ┌────────────────┐  ┌────────────────┐              │
    │  │    Users       │  │   Branches     │              │
    │  │  _id, email    │  │  _id, name,    │              │
    │  │  password,     │  │  address,      │              │
    │  │  role, branch  │  │  manager_ref   │              │
    │  └────────────────┘  └────────────────┘              │
    │                                                        │
    │  ┌────────────────┐  ┌────────────────┐              │
    │  │    Staff       │  │  Inventory     │              │
    │  │  _id, name,    │  │  _id, sku,     │              │
    │  │  email, role,  │  │  name, qty,    │              │
    │  │  salary,       │  │  price,        │              │
    │  │  branch_ref    │  │  branch_ref    │              │
    │  └────────────────┘  └────────────────┘              │
    │                                                        │
    │  ┌────────────────┐  ┌────────────────┐              │
    │  │    Sales       │  │   Expenses     │              │
    │  │  _id, product_ │  │  _id, category,│              │
    │  │  ref, qty,     │  │  amount,       │              │
    │  │  totalAmount,  │  │  description,  │              │
    │  │  branch_ref    │  │  branch_ref    │              │
    │  └────────────────┘  └────────────────┘              │
    │                                                        │
    │  ┌────────────────┐  ┌────────────────┐              │
    │  │ RestockReq     │  │  Attendance    │              │
    │  │  _id, product_ │  │  _id, staff_   │              │
    │  │  ref, qty,     │  │  ref, date,    │              │
    │  │  status,       │  │  status,       │              │
    │  │  requestedBy   │  │  timeIn/Out    │              │
    │  └────────────────┘  └────────────────┘              │
    │                                                        │
    │  Indexes                                              │
    │  ├─ Email (unique)                                    │
    │  ├─ SKU (unique)                                      │
    │  ├─ Branch references                                 │
    │  └─ Compound indexes for queries                      │
    │                                                        │
    └────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════


                      DATA FLOW EXAMPLES

═══════════════════════════════════════════════════════════════════════════


EXAMPLE 1: RECORDING A SALE
─────────────────────────────

User                Browser              Server                MongoDB
  │                   │                    │                      │
  │─ Click "Record"─→ │                    │                      │
  │                   │─ Show Form        │                      │
  │                   │←─ (Modal)         │                      │
  │                   │                    │                      │
  │─ Fill & Submit───→│                    │                      │
  │                   │─ POST /api/sales──→│                      │
  │                   │ {product, qty...}  │─ Validate────────────→
  │                   │                    │ {Check inventory}     │
  │                   │                    │←─ OK─────────────────│
  │                   │                    │                      │
  │                   │                    │─ Create Sale ────────→
  │                   │                    │←─ Sale Created───────│
  │                   │←─ Response─────────│                      │
  │←─ Show Success───│                    │─ Update Inventory───→
  │                   │                    │←─ Updated───────────│
  │                   │                    │                      │
  └─ Refresh List────→│                    │                      │
                      │─ GET /api/sales───→│─ Query Sales─────────→
                      │                    │←─ Sale list──────────│
                      │←─ Updated List────│                      │


EXAMPLE 2: RESTOCK REQUEST WORKFLOW
────────────────────────────────────

Manager             Browser              Server              Admin             DB
  │                   │                    │                   │                │
  │─ Request Restock→ │─ POST /restock────→│                   │                │
  │                   │                    │─ Create Request───────────────────→│
  │                   │←─ Confirmed───────│                   │←─ Saved────────│
  │                   │                    │                   │                │
  │                   │                    │  [Admin reviews]  │                │
  │                   │                    │                   │                │
  │                   │                    │←─ Approve request┬│                │
  │                   │                    │  POST /restock/│  │                │
  │                   │                    │  :id/approve    │  │                │
  │                   │                    │                   ├→│─ Update────→│
  │                   │                    │                   │  │  Status    │
  │                   │                    │                   │  │←─ Updated──│
  │                   │                    │←─ Approved────────│  │            │
  │                   │                    │                   │  │            │
  │─ See Approval────→│─ GET /restock────→│                   │  │            │
  │                   │                    │─ Query approved───────→            │
  │                   │←─ Approved Status─│  requests        │  │            │
  │                   │                    │←─ Return data────────│            │
  │                   │                    │                   │  │            │
  │─ Fulfill────────→ │─ POST /restock/   │                   │  │            │
  │                   │   :id/fulfill─────→│                   │  │            │
  │                   │                    │─ Update Inv──────────────────────→│
  │                   │←─ Fulfilled───────│  add approved qty │  │            │
  │                   │                    │                   │  │←─ Updated──│
  │                   │                    │                   │  │            │
  └─────────────────  └────────────────────└───────────────────  └────────────


═══════════════════════════════════════════════════════════════════════════


                      AUTHENTICATION FLOW

═══════════════════════════════════════════════════════════════════════════

1. LOGIN PROCESS
───────────────
   User enters: email + password
         │
         ├─→ POST /api/auth/login
         │
         ├─→ Backend:
         │   - Find user by email
         │   - Compare password with bcrypt
         │   - Validate user is active
         │
         ├─→ If valid:
         │   - Create session
         │   - Set session cookie
         │   - Return user info + role
         │
         └─→ Frontend:
             - Store user in state
             - Redirect to dashboard
             - Attach session to requests


2. PROTECTED ROUTES
──────────────────
   Every request to protected endpoint
         │
         ├─→ Client sends request with session
         │
         ├─→ Server middleware checks:
         │   - Is session valid?
         │   - Does user have permission?
         │   - Is action allowed for role?
         │
         └─→ Process or reject


3. ROLE-BASED ACCESS
────────────────────
   Admin can:  Create anything, Approve requests, View all data
   Manager can: Record sales, Request stocks, Manage own branch
   User:       View only data relevant to them


═══════════════════════════════════════════════════════════════════════════


                    FILE RELATIONSHIPS

═══════════════════════════════════════════════════════════════════════════

React Components               → API Endpoints              → Database Models
──────────────────              ──────────────              – ────────────────

Login.js                        POST /auth/login            User
                               POST /auth/register

AdminDashboard.js              GET /dashboard/admin/       Branch, Sale
                              summary                      Inventory,
                              GET /dashboard/sales-       RestockRequest
                              trend

InventoryManagement.js         GET /inventory              Inventory
                               POST /inventory
                               PUT /inventory/:id

SalesManagement.js             POST /sales                 Sale, Expense
                               GET /sales                  Inventory
                               POST /sales/expense

StaffManagement.js             GET /staff                  Staff
                               POST /staff                 Attendance
                               PUT /staff/:id

RestockRequests.js             GET /restock                RestockRequest
                               POST /restock              Inventory
                               POST /restock/:id/approve

BranchManagement.js            GET /branches              Branch
                               POST /branches             User
                               PUT /branches/:id

Navbar.js                       POST /auth/logout          User
                               GET /auth/current-user
```

## Flow Diagram Legend

```
  → : Data flow / HTTP request
  ← : Response / returned data
  ┌─ : Top corner
  ─┴ : Divider
  │  : Vertical line
```

## Security Layers

```
┌─────────────────────────────────────────┐
│  Browser (HTTPS recommended)            │
├─────────────────────────────────────────┤
│  Session Cookie (Secure + HttpOnly)    │
├─────────────────────────────────────────┤
│  Express Middleware Authentication      │
├─────────────────────────────────────────┤
│  Role-Based Access Control (RBAC)       │
├─────────────────────────────────────────┤
│  Mongoose Schema Validation              │
├─────────────────────────────────────────┤
│  MongoDB Database (Indexed + Backup)    │
└─────────────────────────────────────────┘
```

## Scalability Considerations

```
Current Single-Server Setup:
  Frontend (Port 3000) → Backend (Port 5000) → MongoDB (Port 27017)

Future Multi-Server Setup:
  
  Load Balancer
        │
        ├─ Backend 1 (5000)
        ├─ Backend 2 (5001)  ─ Session Store (Redis)
        ├─ Backend 3 (5002)
        │
        └─ MongoDB Replica Set
           ├─ Primary
           ├─ Secondary 1
           └─ Secondary 2
```

## Technology Stack Diagram

```
┌──────────────────────────────────────────────────┐
│                 TECHNOLOGY STACK                 │
├──────────────────────────────────────────────────┤
│                                                  │
│  Frontend Layer        Middle Layer    Backend   │
│  ─────────────         ──────────      ───────  │
│                                                  │
│  React 18              Express.js      Mongoose│
│  React Router          Node.js         MongoDB │
│  Recharts              bcryptjs        Indexes │
│  Axios                 Sessions        Validation
│  CSS3                  CORS            Queries │
│                        Middleware      Admin    │
│                                        Only     │
│                                                  │
└──────────────────────────────────────────────────┘
```
