# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Endpoints

### Register
**POST** `/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "role": "Branch Manager",
  "branch": "branch_id_optional"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": "user_id",
  "role": "Branch Manager"
}
```

### Login
**POST** `/auth/login`

Authenticates user and creates session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "userId": "user_id",
  "username": "username",
  "email": "user@example.com",
  "role": "Admin",
  "branch": { "branch_data" }
}
```

### Logout
**POST** `/auth/logout`

Destroys user session.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### Get Current User
**GET** `/auth/current-user`

Retrieves current logged-in user information.

**Response:**
```json
{
  "userId": "user_id",
  "username": "username",
  "email": "user@example.com",
  "role": "Admin",
  "branch": { "branch_data" }
}
```

## Branch Endpoints

### Get All Branches
**GET** `/branches`

Retrieves all branches.

**Response:**
```json
[
  {
    "_id": "branch_id",
    "name": "Delhi North Branch",
    "address": "123 Main Street",
    "city": "Delhi",
    "phone": "9876543210",
    "email": "branch@example.com",
    "manager": { "user_data" },
    "status": "Active"
  }
]
```

### Get Branch by ID
**GET** `/branches/:id`

Retrieves specific branch details.

**Response:**
```json
{
  "_id": "branch_id",
  "name": "Branch Name",
  ...
}
```

### Create Branch (Admin Only)
**POST** `/branches`

**Request Body:**
```json
{
  "name": "New Branch",
  "address": "123 Street",
  "city": "City Name",
  "phone": "9876543210",
  "email": "branch@example.com"
}
```

**Response:**
```json
{
  "message": "Branch created successfully",
  "branch": { "branch_data" }
}
```

### Update Branch (Admin Only)
**PUT** `/branches/:id`

**Request Body:**
```json
{
  "name": "Updated Name",
  "address": "New Address",
  "city": "New City",
  "phone": "9876543211",
  "email": "newemail@example.com",
  "status": "Active"
}
```

## Inventory Endpoints

### Get All Inventory
**GET** `/inventory?branchId=branch_id`

Retrieves inventory items. Optional branch filter.

**Response:**
```json
[
  {
    "_id": "inventory_id",
    "name": "Dell XPS 13",
    "sku": "SKU-1000",
    "category": "Laptops",
    "quantity": 25,
    "reorderLevel": 10,
    "price": 89999,
    "branch": { "branch_data" }
  }
]
```

### Get Low Stock Items
**GET** `/inventory/low-stock/items?branchId=branch_id`

Retrieves items below reorder level.

### Create Inventory (Admin Only)
**POST** `/inventory`

**Request Body:**
```json
{
  "name": "Product Name",
  "sku": "SKU-1001",
  "category": "Laptops",
  "quantity": 50,
  "reorderLevel": 10,
  "price": 45999,
  "branch": "branch_id",
  "supplier": "Supplier Name"
}
```

### Update Inventory
**PUT** `/inventory/:id`

**Request Body:**
```json
{
  "quantity": 45,
  "name": "Updated Name",
  "price": 46999
}
```

## Sales Endpoints

### Record Sale
**POST** `/sales`

**Request Body:**
```json
{
  "product": "product_id",
  "quantity": 2,
  "unitPrice": 89999,
  "branch": "branch_id",
  "paymentMethod": "Cash",
  "notes": "Customer note"
}
```

**Response:**
```json
{
  "message": "Sale recorded successfully",
  "sale": { "sale_data" }
}
```

### Get Sales
**GET** `/sales?branchId=branch_id&startDate=2024-01-01&endDate=2024-01-31`

Retrieves sales records with optional filters.

### Create Expense
**POST** `/sales/expense/create`

**Request Body:**
```json
{
  "category": "Utilities",
  "amount": 5000,
  "description": "Monthly utilities bill",
  "branch": "branch_id",
  "expenseDate": "2024-01-15"
}
```

## Staff Endpoints

### Get All Staff
**GET** `/staff?branchId=branch_id`

**Response:**
```json
[
  {
    "_id": "staff_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "Sales Associate",
    "salary": 25000,
    "branch": { "branch_data" },
    "status": "Active",
    "joinDate": "2024-01-01"
  }
]
```

### Create Staff
**POST** `/staff`

**Request Body:**
```json
{
  "name": "New Employee",
  "email": "emp@example.com",
  "phone": "9876543210",
  "role": "Sales Associate",
  "salary": 25000,
  "branch": "branch_id",
  "joinDate": "2024-01-15"
}
```

### Update Staff
**PUT** `/staff/:id`

**Request Body:**
```json
{
  "name": "Updated Name",
  "salary": 26000,
  "status": "Active"
}
```

## Restock Endpoints

### Create Restock Request
**POST** `/restock`

**Request Body:**
```json
{
  "product": "product_id",
  "branch": "branch_id",
  "requestedQuantity": 50,
  "reason": "Low stock alert"
}
```

### Get All Restock Requests
**GET** `/restock?status=Pending&branchId=branch_id`

**Response:**
```json
[
  {
    "_id": "request_id",
    "product": { "product_data" },
    "branch": { "branch_data" },
    "requestedQuantity": 50,
    "approvedQuantity": null,
    "status": "Pending",
    "reason": "Low stock",
    "requestedBy": { "user_data" },
    "approvedBy": null,
    "requestDate": "2024-01-15"
  }
]
```

### Approve Restock (Admin Only)
**POST** `/restock/:id/approve`

**Request Body:**
```json
{
  "approvedQuantity": 50,
  "adminNotes": "Approved for immediate delivery"
}
```

### Reject Restock (Admin Only)
**POST** `/restock/:id/reject`

**Request Body:**
```json
{
  "adminNotes": "Not in budget this month"
}
```

### Fulfill Restock (Admin Only)
**POST** `/restock/:id/fulfill`

Updates inventory when restock is received.

## Dashboard Endpoints

### Admin Dashboard Summary
**GET** `/dashboard/admin/summary`

**Response:**
```json
{
  "totalBranches": 3,
  "activeBranches": 3,
  "totalStaff": 12,
  "monthlySales": {
    "total": 250000,
    "count": 15
  },
  "lowStockItems": [],
  "topSellingProducts": []
}
```

### Branch Dashboard Summary
**GET** `/dashboard/branch/summary`

**Response:**
```json
{
  "branch": "Branch Name",
  "totalStaff": 4,
  "totalProducts": 24,
  "monthlySales": { "total": 50000, "count": 5 },
  "monthlyExpenses": { "total": 15000 },
  "lowStockItems": []
}
```

### Sales Trend
**GET** `/dashboard/sales-trend?branchId=branch_id&months=12`

Returns monthly sales data for charting.

### Branch Comparison
**GET** `/dashboard/admin/branch-comparison?startDate=2024-01-01&endDate=2024-01-31`

Compares sales performance across branches.

## Error Responses

### 400 Bad Request
```json
{
  "message": "Required fields missing"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized - Please login"
}
```

### 403 Forbidden
```json
{
  "message": "Forbidden - Admin access required"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal Server Error",
  "error": "Error details"
}
```

## Authentication Headers

All protected endpoints require active session. Session ID is automatically handled by the browser.

## Rate Limiting

For production, implement rate limiting:
- 100 requests per minute per IP
- 1000 requests per hour per user

## Pagination

For large data sets, add pagination:

```
GET /endpoint?page=1&limit=20
```

Response:
```json
{
  "data": [],
  "totalPages": 5,
  "currentPage": 1,
  "totalRecords": 100
}
```

## Testing Endpoints

Use tools like Postman or curl:

```bash
# Test health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Get branches
curl http://localhost:5000/api/branches
```

## Webhook Events (Future)

- `sale.created` - When a sale is recorded
- `inventory.updated` - When stock level changes
- `restock.approved` - When restock is approved
- `user.created` - When new user is added
