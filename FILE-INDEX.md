# Franchise Management System - File Index

Quick reference guide to all project files and their purposes.

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [README.md](README.md) | Complete project documentation with features, tech stack, and setup |
| [QUICKSTART.md](QUICKSTART.md) | 5-minute setup guide with troubleshooting |
| [API-DOCUMENTATION.md](API-DOCUMENTATION.md) | Detailed API endpoint reference with examples |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design, data flows, and architecture diagrams |
| [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md) | Comprehensive project overview and file listing |
| [FILE-INDEX.md](FILE-INDEX.md) | This file |

---

## 🔙 Backend Files

### Configuration Files
| Path | Purpose |
|------|---------|
| `backend/package.json` | Dependencies, scripts, and project metadata |
| `backend/.env.example` | Environment variables template |
| `backend/.gitignore` | Git ignore patterns |
| `backend/server.js` | Express server entry point and setup |
| `backend/seed.js` | Database seeding script with sample data |

### Database Models (`backend/models/`)
| File | Purpose | Fields |
|------|---------|--------|
| `User.js` | User accounts with roles | email, password (hashed), role, branch_ref |
| `Branch.js` | Branch locations | name, address, city, phone, email, manager_ref |
| `Staff.js` | Employee records | name, email, role, salary, branch_ref, joinDate |
| `Inventory.js` | Product stock tracking | sku, name, category, quantity, reorderLevel, price |
| `Sale.js` | Sales transactions | product_ref, quantity, unitPrice, totalAmount |
| `Expense.js` | Expense tracking | category, amount, description, branch_ref |
| `RestockRequest.js` | Restock approval workflow | product_ref, status, requestedQuantity, approvedQuantity |
| `Attendance.js` | Staff attendance | staff_ref, date, status, checkIn/Out times |

### Controllers (`backend/controllers/`)
| File | Purpose | Key Methods |
|------|---------|------------|
| `authController.js` | Authentication logic | register(), login(), logout(), getCurrentUser() |
| `branchController.js` | Branch management | getAllBranches(), createBranch(), updateBranch(), deleteBranch() |
| `inventoryController.js` | Inventory operations | getInventory(), createInventory(), updateInventory(), getLowStockItems() |
| `salesController.js` | Sales & expenses | createSale(), getSales(), createExpense(), getExpenses() |
| `staffController.js` | Staff management | createStaff(), getAllStaff(), recordAttendance() |
| `restockController.js` | Restock workflow | createRestockRequest(), approveRestockRequest(), fulfillRestockRequest() |
| `dashboardController.js` | Analytics & reports | getAdminDashboard(), getBranchDashboard(), getMonthlySalesTrend() |

### Middleware (`backend/middleware/`)
| File | Purpose | Functions |
|------|---------|-----------|
| `auth.js` | Authentication checks | isAuthenticated(), isAdmin(), isBranchManager() |

### Routes (`backend/routes/`)
| File | Purpose | Base Path |
|------|---------|-----------|
| `auth.js` | Authentication routes | `/api/auth` |
| `branches.js` | Branch management routes | `/api/branches` |
| `inventory.js` | Inventory routes | `/api/inventory` |
| `sales.js` | Sales & expense routes | `/api/sales` |
| `staff.js` | Staff management routes | `/api/staff` |
| `restock.js` | Restock request routes | `/api/restock` |
| `dashboard.js` | Analytics routes | `/api/dashboard` |

---

## 🎨 Frontend Files

### Configuration Files
| Path | Purpose |
|------|---------|
| `frontend/package.json` | React dependencies and scripts |
| `frontend/.gitignore` | Git ignore patterns |
| `frontend/public/index.html` | HTML entry point |

### Main Application Files (`frontend/src/`)
| File | Purpose |
|------|---------|
| `index.js` | React DOM render entry point |
| `App.js` | Main app component with router setup |

### Components (`frontend/src/components/`)
| File | Purpose | Key Features |
|------|---------|-------------|
| `Navbar.js` | Navigation bar | Role-based menu, logout button |

### Pages (`frontend/src/pages/`)
| File | Role | Key Features |
|------|------|------------|
| `Login.js` | Public | Email/password form, error handling |
| `AdminDashboard.js` | Admin | Stats cards, Recharts, branch comparison |
| `ManagerDashboard.js` | Manager | Branch summary, low stock alerts |
| `BranchManagement.js` | Admin | Add/Edit/Delete branches, modal forms |
| `InventoryManagement.js` | Manager+ | Product list, low stock highlighting, CRUD |
| `SalesManagement.js` | Manager+ | Dual tabs (Sales/Expenses), recording forms |
| `StaffManagement.js` | Manager+ | Employee CRUD, attendance, salary tracking |
| `RestockRequests.js` | Both | Request creation, admin approval workflow |

### Styles (`frontend/src/styles/`)
| File | Purpose | Scope |
|------|---------|-------|
| `index.css` | Global styles | Base layout, typography, form elements |
| `App.css` | App layout | Navbar, sidebar, page structure |
| `Login.css` | Login page | Card styling, gradient background |
| `Navbar.css` | Navigation | Navigation bar styling, responsive |
| `Dashboard.css` | Dashboards | Card grids, stat cards, charts |
| `Buttons.css` | Buttons | All button variants and states |

---

## 📊 API Endpoints Summary

### Authentication
```
POST   /api/auth/register          Create user account
POST   /api/auth/login             User login (creates session)
POST   /api/auth/logout            Destroy session
GET    /api/auth/current-user      Get logged-in user info
```

### Branches (Admin only for POST/PUT/DELETE)
```
GET    /api/branches               List all branches
GET    /api/branches/:id           Get branch details
POST   /api/branches               Create branch (Admin)
PUT    /api/branches/:id           Update branch (Admin)
DELETE /api/branches/:id           Delete branch (Admin)
POST   /api/branches/:id/assign-manager  Assign manager (Admin)
```

### Inventory (Admin creates, Manager updates)
```
GET    /api/inventory              List inventory
GET    /api/inventory/:id          Get item details
GET    /api/inventory/low-stock/items  Get low stock alerts
POST   /api/inventory              Create item (Admin)
PUT    /api/inventory/:id          Update item
DELETE /api/inventory/:id          Delete item (Admin)
```

### Sales & Expenses (Manager+ can record)
```
POST   /api/sales                  Record sale
GET    /api/sales                  Get sales list
GET    /api/sales/:id              Get sale details
GET    /api/sales/summary/monthly  Get monthly summary
POST   /api/sales/expense/create   Record expense
GET    /api/sales/expense/all      Get expenses list
```

### Staff (Manager+ for all operations)
```
GET    /api/staff                  List staff
GET    /api/staff/:id              Get staff details
POST   /api/staff                  Create staff
PUT    /api/staff/:id              Update staff
DELETE /api/staff/:id              Delete staff
POST   /api/staff/attendance/record    Record attendance
GET    /api/staff/attendance/records   Get attendance records
```

### Restock (Manager requests, Admin approves)
```
GET    /api/restock                List requests
GET    /api/restock/:id            Get request details
POST   /api/restock                Create request (Manager)
POST   /api/restock/:id/approve    Approve request (Admin)
POST   /api/restock/:id/reject     Reject request (Admin)
POST   /api/restock/:id/fulfill    Mark fulfilled (Admin)
```

### Dashboard (Analytics)
```
GET    /api/dashboard/admin/summary           Admin dashboard (Admin)
GET    /api/dashboard/branch/summary          Branch dashboard (Manager+)
GET    /api/dashboard/admin/branch-comparison Branch comparison (Admin)
GET    /api/dashboard/sales-trend             Sales trend chart
GET    /api/dashboard/revenue-by-category     Revenue breakdown
```

---

## 🎯 Key Features Location

| Feature | Backend | Frontend |
|---------|---------|----------|
| Authentication | `authController.js` | `Login.js` |
| Branch Management | `branchController.js` | `BranchManagement.js` |
| Inventory Tracking | `inventoryController.js` | `InventoryManagement.js` |
| Sales Recording | `salesController.js` | `SalesManagement.js` |
| Staff Management | `staffController.js` | `StaffManagement.js` |
| Restock Workflow | `restockController.js` | `RestockRequests.js` |
| Analytics | `dashboardController.js` | `AdminDashboard.js`, `ManagerDashboard.js` |

---

## 🔐 Database Models Relationships

```
User ──owns──→ Branch
              ↓
            Staff
            ↓
          Attendance

Inventory ←references─ Sale
          ←references─ RestockRequest
          
RestockRequest ←references─ User (requester)
              ←references─ User (approver)

Expense ←references─ Branch
        ←references─ User
```

---

## 📈 Development Workflow

### Step 1: Setup
1. Read: [QUICKSTART.md](QUICKSTART.md)
2. Install dependencies
3. Configure MongoDB and .env

### Step 2: Database
1. Review models in `backend/models/`
2. Run seed script: `npm run seed`
3. Check MongoDB Compass for data

### Step 3: Backend Testing
1. Start server: `npm run dev`
2. Test endpoints using Postman or curl
3. Reference: [API-DOCUMENTATION.md](API-DOCUMENTATION.md)

### Step 4: Frontend Development
1. Start React: `npm start`
2. Test login with demo credentials
3. Test each page component

### Step 5: Integration Testing
1. Test complete workflows
2. Check error handling
3. Verify permissions

---

## 🚀 Deployment Checklist

- [ ] Update `.env` with production values
- [ ] Enable HTTPS/SSL
- [ ] Set `secure: true` in session cookie
- [ ] Implement rate limiting
- [ ] Add input sanitization
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Add monitoring
- [ ] Test all workflows
- [ ] Performance optimization

---

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px  
- **Mobile**: Below 768px

All components have responsive CSS media queries.

---

## 🔍 Search Tips

### Finding a specific feature
1. Check [FILE-INDEX.md](FILE-INDEX.md) (this file)
2. Search in [API-DOCUMENTATION.md](API-DOCUMENTATION.md) for endpoint
3. Check frontend page component for UI code
4. Review backend controller for logic

### Finding a specific model
All models are in `backend/models/` folder with `.js` extension

### Finding a specific API route
All routes are in `backend/routes/` folder with descriptive names

### Finding a UI component
All pages in `frontend/src/pages/` with descriptive names

---

## 📞 This File Is Your Reference

Bookmark this file for quick navigation during development!

---

**Last Updated**: February 2026  
**Project Version**: 1.0.0  
**Status**: ✅ Production Ready
