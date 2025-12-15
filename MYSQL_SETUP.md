# Election Hub - MySQL Setup & API Integration Guide

## 1. Database Setup

### Create MySQL Database

```sql
CREATE DATABASE election_hub;
USE election_hub;
```

### Create Tables

Run these SQL commands in your MySQL client:

```sql
-- Voters Table
CREATE TABLE voters (
  vid VARCHAR(50) PRIMARY KEY,
  aadhar VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  dob DATE NOT NULL,
  gender ENUM('male', 'female', 'other') NOT NULL,
  address TEXT NOT NULL,
  status ENUM('registered', 'voted') DEFAULT 'registered',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_phone (phone),
  INDEX idx_aadhar (aadhar),
  INDEX idx_status (status)
);

-- Booths Table
CREATE TABLE booths (
  bid VARCHAR(50) PRIMARY KEY,
  location VARCHAR(255) NOT NULL,
  time VARCHAR(50) NOT NULL,
  assignedCount INT DEFAULT 0,
  completedCount INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Officers Table
CREATE TABLE officers (
  oid VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Assignments Table
CREATE TABLE assignments (
  assignmentId VARCHAR(50) PRIMARY KEY,
  voterId VARCHAR(50) NOT NULL,
  boothId VARCHAR(50) NOT NULL,
  officerId VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (voterId) REFERENCES voters(vid) ON DELETE CASCADE,
  FOREIGN KEY (boothId) REFERENCES booths(bid) ON DELETE CASCADE,
  FOREIGN KEY (officerId) REFERENCES officers(oid) ON DELETE CASCADE,
  INDEX idx_voter (voterId),
  INDEX idx_booth (boothId),
  INDEX idx_officer (officerId)
);
```

## 2. Environment Configuration

Update `backend/.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=election_hub
PORT=5000
```

## 3. Installation

### Install Dependencies

**Backend:**
```powershell
cd backend
npm install
```

**Frontend:**
```powershell
cd ..
npm install
```

## 4. Running the Application

### Option 1: Using the Start Script (Windows)
```powershell
double-click start.bat
```

### Option 2: Manual Start (Two Terminals)

**Terminal 1 - Backend:**
```powershell
cd c:\election-hub\backend
node server.js
```

**Terminal 2 - Frontend:**
```powershell
cd c:\election-hub
npm run dev
```

## 5. API Endpoints

### Voters
- `GET /api/voters` - Get all voters
- `GET /api/voters/:vid` - Get voter by ID
- `POST /api/voters` - Create new voter
- `PUT /api/voters/:vid` - Update voter
- `DELETE /api/voters/:vid` - Delete voter

### Booths
- `GET /api/booths` - Get all booths
- `GET /api/booths/:bid` - Get booth by ID
- `POST /api/booths` - Create new booth
- `PUT /api/booths/:bid` - Update booth
- `DELETE /api/booths/:bid` - Delete booth

### Officers
- `GET /api/officers` - Get all officers
- `GET /api/officers/:oid` - Get officer by ID
- `POST /api/officers` - Create new officer
- `PUT /api/officers/:oid` - Update officer
- `DELETE /api/officers/:oid` - Delete officer

### Assignments
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/voter/:voterId` - Get assignments by voter
- `GET /api/assignments/booth/:boothId` - Get assignments by booth
- `POST /api/assignments` - Create new assignment
- `DELETE /api/assignments/:assignmentId` - Delete assignment

### Stats
- `GET /api/stats` - Get dashboard statistics

## 6. Testing the API

Use Postman or curl to test:

```bash
# Get all voters
curl http://localhost:5000/api/voters

# Add a new voter
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

# Get dashboard stats
curl http://localhost:5000/api/stats
```

## 7. Frontend Integration

The frontend is already configured with API service (`src/services/api.ts`) that connects to these endpoints.

To use the API in your components:

```typescript
import { fetchVoters, addVoter } from '@/services/api';

// In your component:
const voters = await fetchVoters();
```

## 8. Key Files

- **Backend:** `backend/server.js` - All API endpoints
- **Backend Config:** `backend/.env` - Database credentials
- **Frontend Service:** `src/services/api.ts` - API client functions
- **Frontend Store:** `src/store/voterStore.ts` - Zustand store (update to use API)

## 9. Troubleshooting

### MySQL Connection Error
- Ensure MySQL is running
- Check DB credentials in `.env`
- Verify database `election_hub` exists

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: Vite automatically tries alternate ports

### CORS Errors
- Backend has CORS enabled for all origins (production: restrict this)
- Verify frontend and backend URLs match in `api.ts`

## 10. Production Checklist

- [ ] Update DB credentials in `.env`
- [ ] Restrict CORS origins in `server.js`
- [ ] Add input validation and sanitization
- [ ] Implement authentication/authorization
- [ ] Add error logging
- [ ] Enable HTTPS
- [ ] Deploy to production server
