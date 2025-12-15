-- Create election_hub database if it doesn't exist
CREATE DATABASE IF NOT EXISTS election_hub;
USE election_hub;

-- Drop existing tables (optional - for fresh start)
-- DROP TABLE IF EXISTS assignments;
-- DROP TABLE IF EXISTS voters;
-- DROP TABLE IF EXISTS booths;
-- DROP TABLE IF EXISTS officers;

-- Voters Table
CREATE TABLE IF NOT EXISTS voters (
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
CREATE TABLE IF NOT EXISTS booths (
  bid VARCHAR(50) PRIMARY KEY,
  location VARCHAR(255) NOT NULL,
  time VARCHAR(50) NOT NULL,
  assignedCount INT DEFAULT 0,
  completedCount INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Officers Table
CREATE TABLE IF NOT EXISTS officers (
  oid VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
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

-- Sample data (optional)
-- INSERT INTO voters VALUES ('v-001', '1234-5678-9012', 'John Doe', '9876543210', '1990-01-15', 'male', '123 Main Street', 'registered', NOW(), NOW());
-- INSERT INTO booths VALUES ('b-001', 'Government School', '08:00 AM - 06:00 PM', 0, 0, NOW(), NOW());
-- INSERT INTO officers VALUES ('o-001', 'Dr. Ramesh', '9988776655', NOW(), NOW());
