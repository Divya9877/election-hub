# Election Hub - Quick Start Guide

## ✅ System Status

Your Election Hub application is now fully configured and ready to use!

### What's Running:
- ✅ **MySQL Database**: `election_hub` with all tables created
- ✅ **Backend Server**: http://localhost:5000
- ✅ **Frontend Server**: http://localhost:8081

---

## 🚀 How to Use

### Starting the Servers

**Option 1: Automatic (One-Click)**
```powershell
# From the project root directory
./start.bat
```

**Option 2: Manual (Two Terminals)

**Terminal 1 - Backend:**
```powershell
cd C:\election-hub\backend
node server.js
```

**Terminal 2 - Frontend:**
```powershell
cd C:\election-hub
npm run dev
```

---

## 📊 Available Endpoints

### Test the API

**Backend Health Check:**
```
http://localhost:5000/
```

**Dashboard Statistics:**
```
http://localhost:5000/api/stats
```

### Sample API Calls

**Get all voters:**
```bash
curl http://localhost:5000/api/voters
```

**Add a new voter:**
```bash
curl -X POST http://localhost:5000/api/voters \
  -H "Content-Type: application/json" \
  -d '{
    "vid": "v-001",
    "aadhar": "1234-5678-9012",
    "name": "John Doe",
    "phone": "9876543210",
    "dob": "1990-01-15",
    "gender": "male",
    "address": "123 Main Street"
  }'
```

**Get all booths:**
```bash
curl http://localhost:5000/api/booths
```

**Get all officers:**
```bash
curl http://localhost:5000/api/officers
```

**Get all assignments:**
```bash
curl http://localhost:5000/api/assignments
```

---

## 📁 Project Structure

```
election-hub/
├── backend/
│   ├── server.js           # API endpoints
│   ├── db.js               # Database configuration
│   ├── setup-db.js         # Database setup script
│   ├── .env                # Environment variables
│   └── package.json
├── src/
│   ├── services/
│   │   └── api.ts          # Frontend API service
│   ├── store/
│   │   └── voterStore.ts   # State management
│   ├── pages/              # Application pages
│   ├── components/         # React components
│   └── App.tsx             # Main app with routing
├── setup.sql               # SQL schema (if needed)
└── MYSQL_SETUP.md          # Detailed setup guide
```

---

## 🔧 Database Configuration

Current settings (from `backend/.env`):
- **Host:** localhost
- **User:** root
- **Password:** (empty)
- **Database:** election_hub
- **Port:** 5000

### To Change Settings:
Edit `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=election_hub
PORT=5000
```

---

## 📋 Database Tables

### Voters
- vid (Primary Key)
- aadhar (Unique)
- name
- phone (Unique)
- dob
- gender
- address
- status (registered/voted)

### Booths
- bid (Primary Key)
- location
- time
- assignedCount
- completedCount

### Officers
- oid (Primary Key)
- name
- phone (Unique)

### Assignments
- assignmentId (Primary Key)
- voterId (Foreign Key)
- boothId (Foreign Key)
- officerId (Foreign Key)
- timestamp

---

## 🎯 Next Steps

1. **Add Data**: Use the frontend forms to add voters, booths, officers, and create assignments
2. **View Dashboard**: Check the dashboard at http://localhost:8081 to see statistics
3. **Test API**: Try the endpoints listed above with Postman or curl
4. **Customize**: Modify components and pages as needed

---

## ❓ Troubleshooting

### Backend won't start
- Ensure MySQL is running
- Check `backend/.env` credentials
- Verify database `election_hub` exists

### Frontend won't load
- Ensure backend is running on port 5000
- Check browser console for errors
- Frontend may be on port 8081 if 8080 is in use

### Database error
- Run: `node backend/setup-db.js` to create/verify tables
- Check MySQL is running

### CORS errors
- Ensure backend URL in `src/services/api.ts` is correct
- Backend CORS is enabled for all origins

---

## 📞 API Reference

For complete API documentation, see `MYSQL_SETUP.md`

**All endpoints support:**
- GET (retrieve)
- POST (create)
- PUT (update)
- DELETE (remove)

---

## ✨ Features Implemented

✅ Voter Management (CRUD)
✅ Booth Management (CRUD)
✅ Officer Management (CRUD)
✅ Assignment Management (CRUD)
✅ Dashboard with Statistics
✅ Voter Status Tracking
✅ Data Validation
✅ Error Handling
✅ MySQL Integration
✅ RESTful API

---

## 🎉 You're All Set!

Your Election Hub application is ready to use. Happy coding!

Visit: **http://localhost:8081** to get started!
