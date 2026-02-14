# Franchise Management System

A comprehensive web-based management system for an electronics retail chain with dual roles: Branch Manager and Admin.

## Features

### Core Capabilities
- **Branch Management**: Admin can create, update, and manage branches with manager assignments
- **Sales Tracking**: Record daily sales with payment methods and automatic inventory updates
- **Inventory Management**: Track product stock levels, manage reorder requests, and track low stock items
- **Staff Management**: Manage employees per branch including roles, salaries, and attendance
- **Expense Tracking**: Record and categorize branch expenses
- **Restock System**: Branch managers request restocks, admins approve/reject
- **Dashboard Analytics**: View sales trends, branch performance, and top-selling products

### User Roles

**Admin (Head Office)**
- View company-wide dashboards and analytics
- Manage all branches
- Create product inventory
- Approve/reject restock requests
- View branch performance metrics

**Branch Manager**
- Record daily sales and expenses
- Manage branch inventory
- Request product restocks
- Manage staff members
- View branch-specific reports

## Tech Stack

### Backend
- **Node.js** with **Express.js** - REST API server
- **MongoDB** with **Mongoose** - Database
- **express-session** - Session-based authentication
- **bcryptjs** - Password hashing

### Frontend
- **React.js 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **CSS3** - Styling

## Project Structure

```
Franchise_management/
├── backend/
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Authentication middleware
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/       # React pages
│   │   ├── components/  # Reusable components
│   │   ├── styles/      # CSS files
│   │   ├── App.js       # Main App component
│   │   └── index.js     # React entry point
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (local or cloud connection string)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/franchise-management
PORT=5000
SESSION_SECRET=your-secret-key-here
```

4. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Application will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/current-user` - Get current user info

### Branches
- `GET /api/branches` - Get all branches
- `GET /api/branches/:id` - Get branch by ID
- `POST /api/branches` - Create branch (Admin only)
- `PUT /api/branches/:id` - Update branch (Admin only)
- `DELETE /api/branches/:id` - Delete branch (Admin only)
- `POST /api/branches/:id/assign-manager` - Assign manager (Admin only)

### Inventory
- `GET /api/inventory` - Get inventory items
- `GET /api/inventory/:id` - Get item by ID
- `GET /api/inventory/low-stock/items` - Get low stock items
- `POST /api/inventory` - Create item (Admin only)
- `PUT /api/inventory/:id` - Update item (Manager+)
- `DELETE /api/inventory/:id` - Delete item (Admin only)

### Sales
- `POST /api/sales` - Record sale (Manager+)
- `GET /api/sales` - Get sales list
- `POST /api/sales/expense/create` - Create expense (Manager+)
- `GET /api/sales/expense/all` - Get expenses

### Staff
- `GET /api/staff` - Get staff list
- `POST /api/staff` - Create staff (Manager+)
- `PUT /api/staff/:id` - Update staff (Manager+)
- `DELETE /api/staff/:id` - Delete staff (Manager+)
- `POST /api/staff/attendance/record` - Record attendance (Manager+)

### Restock Requests
- `GET /api/restock` - Get restock requests
- `POST /api/restock` - Create request (Manager+)
- `POST /api/restock/:id/approve` - Approve request (Admin only)
- `POST /api/restock/:id/reject` - Reject request (Admin only)
- `POST /api/restock/:id/fulfill` - Fulfill request (Admin only)

### Dashboard
- `GET /api/dashboard/admin/summary` - Admin dashboard (Admin only)
- `GET /api/dashboard/branch/summary` - Branch dashboard (Manager+)
- `GET /api/dashboard/admin/branch-comparison` - Branch comparison (Admin only)
- `GET /api/dashboard/sales-trend` - Sales trend analytics
- `GET /api/dashboard/revenue-by-category` - Revenue breakdown

## Sample Data

### Demo Credentials

**Admin Account**
- Email: `admin@example.com`
- Password: `password123`

**Branch Manager Account**
- Email: `manager@example.com`
- Password: `password123`

## Database Models

### User
- username, email, password, role, branch, isActive, createdAt

### Branch
- name, address, city, phone, email, manager, status, createdAt, updatedAt

### Staff
- name, email, phone, role, salary, branch, status, joinDate, createdAt, updatedAt

### Inventory
- name, sku, category, quantity, reorderLevel, price, branch, supplier, lastRestocked, createdAt, updatedAt

### Sale
- product, quantity, unitPrice, totalAmount, branch, saleDate, paymentMethod, notes, createdAt

### Expense
- category, amount, description, branch, expenseDate, createdBy, createdAt

### RestockRequest
- product, branch, requestedQuantity, approvedQuantity, status, reason, requestedBy, approvedBy, requestDate, approvalDate, adminNotes, createdAt

### Attendance
- staff, branch, date, status, checkInTime, checkOutTime, notes, createdAt

## Authentication

The system uses session-based authentication with the following flow:

1. User logs in with email and password
2. Password is verified against bcrypt hash
3. Session is created and stored in server
4. Subsequent requests include session ID
5. Middleware verifies role-based permissions

## Usage Examples

### Adding a New Branch (Admin)
1. Login as Admin
2. Navigate to "Branches"
3. Click "Add New Branch"
4. Fill in branch details
5. Save

### Recording Sales (Branch Manager)
1. Login as Branch Manager
2. Navigate to "Sales"
3. Click "Record Sale"
4. Select product, quantity, payment method
5. System automatically deducts inventory

### Requesting Restock (Branch Manager)
1. Navigate to "Restock Requests"
2. Click "Create Request"
3. Select product and requested quantity
4. Submit
5. Admin reviews and approves/rejects
6. Once approved, manager can fulfill request

## Security Considerations

- Passwords are hashed using bcryptjs
- Session-based authentication for simplicity
- Role-based access control (RBAC)
- Input validation on both frontend and backend

For production, consider:
- JWT tokens instead of sessions
- HTTPS/SSL encryption
- Input sanitization
- Rate limiting
- CORS configuration
- Database backups

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Mobile Support

The UI is fully responsive and works on mobile devices, tablets, and desktops.

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB service is running
- Check MONGODB_URI in .env file
- Verify database credentials

### Port Already in Use
- Change PORT in .env (default 5000)
- Or kill process using the port

### CORS Error
- Ensure proxy is set in frontend package.json
- Check backend CORS configuration

## Future Enhancements

- Email notifications for approvals
- SMS alerts for low stock
- Advanced reporting with PDF export
- Multi-language support
- Two-factor authentication
- Integration with payment gateways
- Mobile app version
- Real-time notifications

## License

ISC

## Support

For issues or questions, please refer to the documentation or contact the development team.
