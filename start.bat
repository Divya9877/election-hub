@echo off
REM Start both backend and frontend

echo.
echo ========================================
echo  Election Hub - Development Environment
echo ========================================
echo.

REM Check if node_modules exists in backend
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    npm install
    cd ..
)

REM Check if node_modules exists in frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
)

echo.
echo Starting servers...
echo.

REM Start backend in new window
cd backend
start cmd /k "npm install && node server.js"

REM Wait a moment for backend to start
timeout /t 3

REM Start frontend
cd ..
npm run dev

echo.
echo ========================================
echo  Servers started!
echo  Frontend: http://localhost:8081
echo  Backend:  http://localhost:5000
echo ========================================
echo.
