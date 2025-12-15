# Useful Commands for Election Hub

## Starting Services

### Start Backend Only
```powershell
cd C:\election-hub\backend
node server.js
```

### Start Frontend Only
```powershell
cd C:\election-hub
npm run dev
```

### Setup Database (if not created)
```powershell
cd C:\election-hub\backend
node setup-db.js
```

## Testing API Endpoints

### Get Dashboard Stats
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/stats" | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Get All Voters
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/voters" | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Add a New Voter
```powershell
$body = @{
    vid = "v-001"
    aadhar = "1234-5678-9012"
    name = "John Doe"
    phone = "9876543210"
    dob = "1990-01-15"
    gender = "male"
    address = "123 Main Street"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/voters" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Get All Booths
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/booths" | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Add a New Booth
```powershell
$body = @{
    bid = "b-001"
    location = "Government School"
    time = "08:00 AM - 06:00 PM"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/booths" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Get All Officers
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/officers" | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Add a New Officer
```powershell
$body = @{
    oid = "o-001"
    name = "Dr. Ramesh"
    phone = "9988776655"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/officers" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Get All Assignments
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/assignments" | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Create an Assignment
```powershell
$body = @{
    assignmentId = "a-001"
    voterId = "v-001"
    boothId = "b-001"
    officerId = "o-001"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/assignments" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

## Database Management

### Check if MySQL is running
```powershell
Get-Process | Where-Object {$_.ProcessName -like "*mysql*"}
```

### Start MySQL Service (if installed as service)
```powershell
Start-Service MySQL80  # Replace with your MySQL version
```

### Stop MySQL Service
```powershell
Stop-Service MySQL80  # Replace with your MySQL version
```

## Development Shortcuts

### Kill process on port 5000 (backend)
```powershell
$proc = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($proc) {
    Stop-Process -Id $proc.OwningProcess -Force
    Write-Host "Process on port 5000 killed"
} else {
    Write-Host "No process on port 5000"
}
```

### Kill process on port 8081 (frontend)
```powershell
$proc = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
if ($proc) {
    Stop-Process -Id $proc.OwningProcess -Force
    Write-Host "Process on port 8081 killed"
} else {
    Write-Host "No process on port 8081"
}
```

### Check which processes are using which ports
```powershell
Get-NetTCPConnection -State Listen | Select-Object LocalAddress, LocalPort, OwningProcess, @{Name="ProcessName";Expression={[System.Diagnostics.Process]::GetProcessById($_.OwningProcess).Name}}
```

## NPM Commands

### Install dependencies
```powershell
cd C:\election-hub
npm install

cd C:\election-hub\backend
npm install
```

### Build frontend
```powershell
cd C:\election-hub
npm run build
```

### Preview production build
```powershell
cd C:\election-hub
npm run preview
```

### Run linter
```powershell
cd C:\election-hub
npm run lint
```

## Useful Links

- Frontend: http://localhost:8081
- Backend Health: http://localhost:5000
- API Stats: http://localhost:5000/api/stats
- API Voters: http://localhost:5000/api/voters
- API Booths: http://localhost:5000/api/booths
- API Officers: http://localhost:5000/api/officers
- API Assignments: http://localhost:5000/api/assignments
