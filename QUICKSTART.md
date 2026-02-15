# Quick Start Guide - Franchise Management System

## Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

## Step-by-Step Setup

### 1. Start MongoDB
If using local MongoDB:
```bash
mongod
```

Or ensure your MongoDB Atlas connection string is ready.

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup (New Terminal)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

The frontend will open on `http://localhost:3000`

## Login with Demo Credentials

### Admin Account
- Email: `admin@example.com`
- Password: `password123`

### Branch Manager Account (any of these)
- Email: `manager1@example.com` / `password123`
- Email: `manager2@example.com` / `password123`
- Email: `manager3@example.com` / `password123`

## First Steps After Login

### As Admin:
1. Go to Dashboard to view company-wide analytics
2. Navigate to Branches to see all branch locations
3. Check Restock Requests to approve/reject requests
4. Review Inventory across all branches
5. Analyze sales trends and branch performance

### As Branch Manager:
1. View your Branch Dashboard
2. Record daily Sales
3. Record Expenses
4. Manage your branch inventory
5. Create Restock Requests
6. Manage Staff

## API Server Health Check

```bash
# Test if backend is running
curl http://localhost:5000/api/health
```

Expected response:
```json
{ "status": "Server is running" }
```

## Key Features to Try

### 1. Branch Management (Admin Only)
- Add/edit/delete branches
- Assign branch managers
- View branch details

### 2. Sales Recording (Manager+)
- Record sales transactions
- Track payment methods
- Automatic inventory deduction

### 3. Inventory Tracking (All Users)
- View current stock levels
- See low stock alerts
- Request restocks
- Update product quantities

### 4. Staff Management (Manager+)
- Add/edit staff members
- Track salaries and roles
- Manage employment status
- Record attendance

### 5. Restock Management
- Branch managers request restocks
- Admin approves/rejects/fulfills
- Automatic inventory updates

### 6. Analytics Dashboard
- Monthly sales trends
- Branch comparison charts
- Top-selling products
- Revenue by category

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
# macOS/Linux:
lsof -i :5000
# Windows:
netstat -ano | findstr :5000

# Kill the process and try again or use different port
# Update .env with new PORT
```

### MongoDB connection error
```bash
# Check MongoDB is running
# For MongoDB Atlas, verify connection string in .env
# Format: mongodb+srv://username:password@cluster.mongodb.net/franchise-management
```

### Frontend won't connect to backend
```bash
# Ensure proxy is set in frontend/package.json:
# "proxy": "http://localhost:5000"

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Session/Login issues
- Clear browser cookies and cache
- Restart backend server
- Ensure SESSION_SECRET is set in .env

## Database Structure

The system creates these MongoDB collections on first run:

- **users** - User accounts with roles
- **branches** - Branch locations
- **staff** - Employee records
- **inventories** - Product stock tracking
- **sales** - Sales transactions
- **expenses** - Expense records
- **restock_requests** - Restock approvals
- **attendances** - Staff attendance

## File Structure

```
Franchise_management/
├── backend/
│   ├── models/                 (Database schemas)
│   ├── routes/                 (API endpoints)
│   ├── controllers/            (Business logic)
│   ├── middleware/             (Auth middleware)
│   ├── server.js              (Express server)
│   ├── seed.js                (Populate DB)
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/             (Page components)
│   │   ├── components/        (Reusable components)
│   │   ├── styles/            (CSS files)
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env
│
└── README.md                  (Full documentation)
```

## Performance Tips

1. **Indexing**: Add indexes to frequently queried fields
2. **Pagination**: Implement pagination for large data sets
3. **Caching**: Add Redis for session caching
4. **Compression**: Enable gzip compression in Express

## Next Steps for Production

1. Remove dummy data and create real users
2. Set up proper authentication (JWT or OAuth)
3. Configure HTTPS/SSL
4. Set up email notifications
5. Implement backup strategy
6. Set up monitoring and logging
7. Configure production database
8. Implement rate limiting
9. Add input validation and sanitization
10. Set up CI/CD pipeline

## Useful Development Commands

### Backend
```bash
# Watch mode with nodemon
npm run dev

# Production mode
npm start

# Seed database
npm run seed
```

### Frontend
```bash
# Development mode
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Support & Documentation

- Full API documentation in README.md
- Database schema details in models/
- Component structure in frontend/src/
- Configuration examples in .env.example

## Quick Reference

| What | Admin | Manager |
|------|-------|---------|
| Dashboard | ✓ | ✓ |
| Branches | ✓ | - |
| Inventory | ✓ | ✓ |
| Sales | ✓ | ✓ |
| Staff | - | ✓ |
| Restock | ✓ (approve) | ✓ (request) |
| Reports | ✓ | ✓ |

Happy managing! 🚀
