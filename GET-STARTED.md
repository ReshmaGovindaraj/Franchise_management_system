# 🎯 GET STARTED - Franchise Management System

## 🚀 You Have Exactly 5 Minutes to Get Running!

### ⏱️ Timeline
- **Minute 1-2**: Backend setup
- **Minute 2-3**: Database seeding  
- **Minute 3-4**: Frontend setup
- **Minute 4-5**: Test login

---

## Step 1️⃣: Backend Setup (2 min)

### Terminal 1 - Navigate and Install
```bash
cd backend
npm install
```
Wait for npm to finish... ☕

### Create .env file
Copy this exactly:
```
MONGODB_URI=mongodb://localhost:27017/franchise-management
PORT=5000
SESSION_SECRET=franchise-secret-key-2024
```

Save as `backend/.env`

### Seed Database
```bash
npm run seed
```

You should see:
```
✅ Database seeded successfully!

Demo Credentials:
Admin: admin@example.com / password123
Manager 1: manager1@example.com / password123
```

### Start Backend Server
```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected successfully
```

**✅ Backend is LIVE!**

---

## Step 2️⃣: Frontend Setup (2 min)

### Terminal 2 - Navigate and Install
```bash
cd frontend
npm install
```

### Start Frontend Server
```bash
npm start
```

The app will automatically open on `http://localhost:3000`

If it doesn't open, manually go there in your browser.

**✅ Frontend is LIVE!**

---

## Step 3️⃣: Login & Test (1 min)

### Admin Login
```
Email:    admin@example.com
Password: password123
```

Click "Login" → You should see the **Admin Dashboard** ✅

### Manager Login
Try another browser tab:
```
Email:    manager1@example.com
Password: password123
```

Click "Login" → You should see the **Branch Manager Dashboard** ✅

---

## 🎉 Success! You're Running!

### What You Can Now Do:

#### As Admin:
- ✅ View company dashboard
- ✅ See all branches
- ✅ Manage inventory across branches
- ✅ View sales analytics
- ✅ Approve/reject restock requests

#### As Manager:
- ✅ View branch dashboard
- ✅ Record daily sales
- ✅ Track expenses
- ✅ Manage staff
- ✅ Request restocks
- ✅ Update inventory

---

## 🔧 Quick Navigation Guide

### From Admin Dashboard:
```
Navigation Menu:
  • Dashboard ▶ (Home - Stats & Charts)
  • Branches ▶ (Add/Edit/Delete branches)
  • Inventory ▶ (View all products)
  • Sales ▶ (View sales records)
  • Restock Requests ▶ (Approve/Reject)
```

### Try These Actions:

**1. Add a New Product (Admin)**
- Go to Inventory
- Click "Add Product"
- Fill in: Name, SKU, Category, Price
- Click Save

**2. Record a Sale (Manager)**
- Go to Sales tab
- Click "Record Sale"
- Select product, quantity, payment method
- Click Save

**3. Create Restock Request (Manager)**
- Go to Restock Requests
- Click "Create Request"
- Select product, quantity
- Select reason
- Click Submit

**4. Approve Restock (Admin)**
- Go to Restock Requests
- See pending requests
- Click "Approve"
- Enter quantity
- Click OK

**5. View Dashboard Charts (Admin)**
- Go to Admin Dashboard
- See monthly sales trends
- View branch comparison
- See top-selling products

---

## 📊 What You're Looking At

### Admin Dashboard Shows:
```
┌─────────────────────────────────┐
│ Total Branches: 3               │
│ Active Branches: 3              │
│ Total Staff: 12                 │
│ Monthly Sales: ₹250,000         │
└─────────────────────────────────┘

Plus:
• Monthly Sales Trend Chart
• Branch Comparison Chart
• Top 5 Selling Products
• Low Stock Alerts
```

### Manager Dashboard Shows:
```
┌─────────────────────────────────┐
│ Your Branch: [Branch Name]      │
│ Total Staff: 4                  │
│ Total Products: 24              │
│ Monthly Sales: ₹50,000          │
│ Monthly Expenses: ₹15,000       │
└─────────────────────────────────┘

Plus:
• Low Stock Items
```

---

## 🧪 Test Workflow

### Complete Sales Workflow (5 min):

1. **Login as Manager**
   ```
   Email: manager1@example.com
   Password: password123
   ```

2. **Record a Sale**
   - Click "Sales" in menu
   - Click "Record Sale"
   - Select: iPhone 14 Pro
   - Quantity: 2
   - Unit Price: 129999
   - Payment: Cash
   - Click Save

3. **See the Sale**
   - Sale appears in Sales table
   - Inventory automatically updated

4. **Check Dashboard**
   - Go to Dashboard
   - See updated sales total
   - See low stock alerts

5. **Create Restock**
   - Click "Restock Requests"
   - Click "Create Request"
   - Select: iPhone 14 Pro
   - Quantity: 10
   - Click Submit

6. **Logout & Login as Admin**
   ```
   Email: admin@example.com
   Password: password123
   ```

7. **Approve Restock**
   - Click "Restock Requests"
   - See pending request
   - Click "Approve"
   - Approve 10 units
   - Click OK

8. **Manager Fulfills It**
   - Logout (Click Logout button)
   - Login as Manager again
   - Go back to Restock Requests
   - Click "Fulfill"
   - Inventory updated automatically

**✅ Full workflow completed!**

---

## 🐛 Troubleshooting (30 sec)

### Backend won't start
```bash
# Check if port 5000 is in use
# Change PORT in .env to 5001
# Restart: npm run dev
```

### Frontend won't load
```bash
# Press Ctrl+C to stop
# Clear cache: npm cache clean --force
# Restart: npm start
```

### Can't login
```bash
# Check if seed script ran successfully
# Rerun: npm run seed (from backend folder)
# Restart backend and frontend
```

### MongoDB error
```bash
# Make sure MongoDB is running
# Check connection string in .env
# For local: mongodb://localhost:27017/franchise-management
```

---

## 📁 File Structure Reference

```
Your Project:
├── backend/                    (API Server - Port 5000)
│   ├── models/                (Database schemas)
│   ├── controllers/           (Business logic)
│   ├── routes/                (API endpoints)
│   ├── middleware/            (Authentication)
│   ├── server.js              (Server file)
│   └── seed.js                (Sample data)
│
├── frontend/                  (React App - Port 3000)
│   ├── src/
│   │   ├── pages/            (8 page components)
│   │   ├── components/       (Navbar)
│   │   ├── styles/           (CSS files)
│   │   ├── App.js            (Main component)
│   │   └── index.js          (Entry point)
│   └── public/
│
└── Documentation/
    ├── README.md              (Full guide)
    ├── QUICKSTART.md          (This file)
    ├── API-DOCUMENTATION.md   (All endpoints)
    ├── ARCHITECTURE.md        (System design)
    └── FILE-INDEX.md          (File reference)
```

---

## 🔑 Key Features Quick Reference

| Feature | Path | How to Access |
|---------|------|---------------|
| Dashboard | Home | Click Dashboard in menu |
| Sales | Manager | Click Sales → Record Sale |
| Inventory | All | Click Inventory → View/Add |
| Staff | Manager | Click Staff → Add/Manage |
| Branches | Admin | Click Branches → Manage |
| Restock | Manager | Click Restock Requests |
| Reports | Admin | Go to Dashboard → View Charts |

---

## 💡 Pro Tips

1. **Use Different Browsers**
   - Chrome for Admin
   - Firefox for Manager
   - Test multiple users simultaneously

2. **Check Browser Console**
   - Press F12 → Console
   - See any errors there
   - Helps with debugging

3. **Check Network Tab**
   - Press F12 → Network
   - See API calls
   - Check response data

4. **Test on Mobile**
   - Use Chrome DevTools
   - Device Toolbar (Ctrl+Shift+M)
   - Design is responsive!

5. **Modify Sample Data**
   - Edit seed.js
   - Rerun: npm run seed
   - Fresh data loaded

---

## 📚 Learn More

### Next Steps:
1. ✅ Read [README.md](README.md) - Full features
2. ✅ Check [API-DOCUMENTATION.md](API-DOCUMENTATION.md) - All endpoints
3. ✅ Study [ARCHITECTURE.md](ARCHITECTURE.md) - System design
4. ✅ Explore [FILE-INDEX.md](FILE-INDEX.md) - Navigate code

### Explore Code:
1. Check frontend page files in `src/pages/`
2. Review backend controllers in `controllers/`
3. Understand models in `backend/models/`
4. See API routes in `backend/routes/`

---

## 🎓 What You've Just Deployed

```
✅ Full-Stack MERN Application
✅ 50+ API Endpoints
✅ 8 Database Models
✅ 8 React Pages
✅ Role-Based Access Control
✅ Real-time Data Management
✅ Analytics & Charts
✅ Responsive Design
✅ Authentication System
✅ Production-Ready Code
```

---

## 🎉 Celebrate!

You now have a **fully functional Franchise Management System** running!

This system includes:
- ✅ Multi-branch support
- ✅ Inventory tracking
- ✅ Sales recording
- ✅ Staff management
- ✅ Restock workflow
- ✅ Analytics dashboard
- ✅ User authentication
- ✅ Professional UI

---

## ❓ Need Help?

### Documentation
- 📖 Open [README.md](README.md) in your project
- 🔌 Check [API-DOCUMENTATION.md](API-DOCUMENTATION.md)
- 🏗️ Review [ARCHITECTURE.md](ARCHITECTURE.md)

### Stuck?
1. Check error message in console
2. Read troubleshooting above
3. Verify MongoDB is running
4. Verify .env file is correct
5. Check ports aren't in use

---

## 🚀 You're Ready!

**Backend**: Running on `http://localhost:5000` ✅  
**Frontend**: Running on `http://localhost:3000` ✅  
**Database**: Connected and seeded ✅  
**Ready to Test**: Click links below ✅

---

## 🔗 Quick Links

- Admin Dashboard: http://localhost:3000
- Backend API: http://localhost:5000/api/health
- Database: MongoDB (check with Compass)

---

## ⏰ Time Check
- Started: Now
- Installation: ~5 minutes
- Testing: ~5 minutes
- **Total: Ready to demo in 10 minutes!**

---

**🎊 Welcome to Your Franchise Management System! 🎊**

**Version**: 1.0.0  
**Status**: Production Ready  
**Support**: Full documentation included

---

### Next Action:
👉 **Go to http://localhost:3000 and login!** 👈

```
Demo Credentials:
Email: admin@example.com
Password: password123
```

**Happy Managing! 🚀**
