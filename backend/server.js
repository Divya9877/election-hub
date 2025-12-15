require('dotenv').config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Simple request logger to help debug API calls from the frontend
app.use((req, res, next) => {
  try {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.originalUrl} - body:`, req.body);
  } catch (e) {
    // ignore logging errors
  }
  next();
});

const PORT = process.env.PORT || 5000;

// ==================== HEALTH CHECK ====================
app.get("/", (req, res) => {
  res.send("Backend is running ✔️");
});

// ==================== VOTERS ENDPOINTS ====================

// GET all voters
app.get("/api/voters", async (req, res) => {
  try {
    const [voters] = await db.query("SELECT * FROM voters");

    // Support pretty-printing JSON when ?pretty=true is provided
    if (req.query && req.query.pretty === 'true') {
      res.setHeader('Content-Type', 'application/json');
      return res.send(JSON.stringify(voters, null, 2));
    }

    res.json(voters);
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err.message });
  }
});

// GET single voter by ID
app.get("/api/voters/:vid", async (req, res) => {
  const { vid } = req.params;
  try {
    const [voter] = await db.query("SELECT * FROM voters WHERE vid = ?", [vid]);
    if (voter.length === 0) {
      return res.status(404).json({ message: "Voter not found" });
    }
    res.json(voter[0]);
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err.message });
  }
});

// POST new voter
app.post("/api/voters", async (req, res) => {
  const { vid, aadhar, name, phone, dob, gender, address } = req.body;
  
  // Validation
  if (!vid || !aadhar || !name || !phone || !dob || !gender || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await db.query(
      "INSERT INTO voters (vid, aadhar, name, phone, dob, gender, address, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, 'registered', NOW(), NOW())",
      [vid, aadhar, name, phone, dob, gender, address]
    );
    res.status(201).json({ message: "Voter added successfully", vid });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Voter with this Aadhar or Phone already exists" });
    }
    res.status(500).json({ message: "Error adding voter", error: err.message });
  }
});

// UPDATE voter
app.put("/api/voters/:vid", async (req, res) => {
  const { vid } = req.params;
  const { name, phone, address, status } = req.body;
  
  if (!name || !phone || !address || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result] = await db.query(
      "UPDATE voters SET name=?, phone=?, address=?, status=?, updatedAt=NOW() WHERE vid=?",
      [name, phone, address, status, vid]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Voter not found" });
    }
    
    res.json({ message: "Voter updated successfully" });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Phone number already in use" });
    }
    res.status(500).json({ message: "Error updating voter", error: err.message });
  }
});

// DELETE voter
app.delete("/api/voters/:vid", async (req, res) => {
  const { vid } = req.params;
  try {
    const [result] = await db.query("DELETE FROM voters WHERE vid=?", [vid]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Voter not found" });
    }
    
    res.json({ message: "Voter deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting voter", error: err.message });
  }
});

// ==================== BOOTHS ENDPOINTS ====================

// GET all booths
app.get("/api/booths", async (req, res) => {
  try {
    const [booths] = await db.query("SELECT * FROM booths");

    if (req.query && req.query.pretty === 'true') {
      res.setHeader('Content-Type', 'application/json');
      return res.send(JSON.stringify(booths, null, 2));
    }

    res.json(booths);
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err.message });
  }
});

// GET single booth by ID
app.get("/api/booths/:bid", async (req, res) => {
  const { bid } = req.params;
  try {
    const [booth] = await db.query("SELECT * FROM booths WHERE bid = ?", [bid]);
    if (booth.length === 0) {
      return res.status(404).json({ message: "Booth not found" });
    }
    res.json(booth[0]);
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err.message });
  }
});

// POST new booth
app.post("/api/booths", async (req, res) => {
  const { bid, location, time } = req.body;
  
  if (!bid || !location || !time) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await db.query(
      "INSERT INTO booths (bid, location, time, assignedCount, completedCount, createdAt, updatedAt) VALUES (?, ?, ?, 0, 0, NOW(), NOW())",
      [bid, location, time]
    );
    res.status(201).json({ message: "Booth added successfully", bid });
  } catch (err) {
    res.status(500).json({ message: "Error adding booth", error: err.message });
  }
});

// UPDATE booth
app.put("/api/booths/:bid", async (req, res) => {
  const { bid } = req.params;
  const { location, time } = req.body;
  
  if (!location || !time) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result] = await db.query(
      "UPDATE booths SET location=?, time=?, updatedAt=NOW() WHERE bid=?",
      [location, time, bid]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booth not found" });
    }
    
    res.json({ message: "Booth updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating booth", error: err.message });
  }
});

// DELETE booth
app.delete("/api/booths/:bid", async (req, res) => {
  const { bid } = req.params;
  try {
    const [result] = await db.query("DELETE FROM booths WHERE bid=?", [bid]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booth not found" });
    }
    
    res.json({ message: "Booth deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting booth", error: err.message });
  }
});

// ==================== OFFICERS ENDPOINTS ====================

// GET all officers
app.get("/api/officers", async (req, res) => {
  try {
    const [officers] = await db.query("SELECT * FROM officers");

    if (req.query && req.query.pretty === 'true') {
      res.setHeader('Content-Type', 'application/json');
      return res.send(JSON.stringify(officers, null, 2));
    }

    res.json(officers);
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err.message });
  }
});

// GET single officer by ID
app.get("/api/officers/:oid", async (req, res) => {
  const { oid } = req.params;
  try {
    const [officer] = await db.query("SELECT * FROM officers WHERE oid = ?", [oid]);
    if (officer.length === 0) {
      return res.status(404).json({ message: "Officer not found" });
    }
    res.json(officer[0]);
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err.message });
  }
});

// POST new officer
app.post("/api/officers", async (req, res) => {
  const { oid, name, phone } = req.body;
  
  if (!oid || !name || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await db.query(
      "INSERT INTO officers (oid, name, phone, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())",
      [oid, name, phone]
    );
    res.status(201).json({ message: "Officer added successfully", oid });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Officer with this phone already exists" });
    }
    res.status(500).json({ message: "Error adding officer", error: err.message });
  }
});

// UPDATE officer
app.put("/api/officers/:oid", async (req, res) => {
  const { oid } = req.params;
  const { name, phone } = req.body;
  
  if (!name || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result] = await db.query(
      "UPDATE officers SET name=?, phone=?, updatedAt=NOW() WHERE oid=?",
      [name, phone, oid]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Officer not found" });
    }
    
    res.json({ message: "Officer updated successfully" });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Phone number already in use" });
    }
    res.status(500).json({ message: "Error updating officer", error: err.message });
  }
});

// DELETE officer
app.delete("/api/officers/:oid", async (req, res) => {
  const { oid } = req.params;
  try {
    const [result] = await db.query("DELETE FROM officers WHERE oid=?", [oid]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Officer not found" });
    }
    
    res.json({ message: "Officer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting officer", error: err.message });
  }
});

// ==================== ASSIGNMENTS ENDPOINTS ====================

// GET all assignments
app.get("/api/assignments", async (req, res) => {
  try {
    const [assignments] = await db.query("SELECT * FROM assignments");

    if (req.query && req.query.pretty === 'true') {
      res.setHeader('Content-Type', 'application/json');
      return res.send(JSON.stringify(assignments, null, 2));
    }

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err.message });
  }
});

// GET assignments by voter ID
app.get("/api/assignments/voter/:voterId", async (req, res) => {
  const { voterId } = req.params;
  try {
    const [assignments] = await db.query(
      "SELECT * FROM assignments WHERE voterId = ?",
      [voterId]
    );
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err.message });
  }
});

// GET assignments by booth ID
app.get("/api/assignments/booth/:boothId", async (req, res) => {
  const { boothId } = req.params;
  try {
    const [assignments] = await db.query(
      "SELECT * FROM assignments WHERE boothId = ?",
      [boothId]
    );
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err.message });
  }
});

// POST new assignment
app.post("/api/assignments", async (req, res) => {
  const { assignmentId, voterId, boothId, officerId } = req.body;
  
  if (!assignmentId || !voterId || !boothId || !officerId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if voter, booth, and officer exist
    const [voter] = await db.query("SELECT * FROM voters WHERE vid = ?", [voterId]);
    const [booth] = await db.query("SELECT * FROM booths WHERE bid = ?", [boothId]);
    const [officer] = await db.query("SELECT * FROM officers WHERE oid = ?", [officerId]);

    if (voter.length === 0 || booth.length === 0 || officer.length === 0) {
      return res.status(400).json({ message: "Invalid voter, booth, or officer ID" });
    }

    await db.query(
      "INSERT INTO assignments (assignmentId, voterId, boothId, officerId, timestamp) VALUES (?, ?, ?, ?, NOW())",
      [assignmentId, voterId, boothId, officerId]
    );

    // Update booth assigned count
    await db.query(
      "UPDATE booths SET assignedCount = assignedCount + 1, updatedAt = NOW() WHERE bid = ?",
      [boothId]
    );

    res.status(201).json({ message: "Assignment created successfully", assignmentId });
  } catch (err) {
    res.status(500).json({ message: "Error creating assignment", error: err.message });
  }
});

// DELETE assignment
app.delete("/api/assignments/:assignmentId", async (req, res) => {
  const { assignmentId } = req.params;
  try {
    // Get the assignment first to get boothId
    const [assignment] = await db.query(
      "SELECT * FROM assignments WHERE assignmentId = ?",
      [assignmentId]
    );

    if (assignment.length === 0) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const boothId = assignment[0].boothId;

    // Delete assignment
    await db.query("DELETE FROM assignments WHERE assignmentId = ?", [assignmentId]);

    // Update booth assigned count
    await db.query(
      "UPDATE booths SET assignedCount = assignedCount - 1, updatedAt = NOW() WHERE bid = ?",
      [boothId]
    );

    res.json({ message: "Assignment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting assignment", error: err.message });
  }
});

// ==================== STATS ENDPOINT ====================

// GET dashboard stats
app.get("/api/stats", async (req, res) => {
  try {
    const [voterStats] = await db.query(
      "SELECT COUNT(*) as total, SUM(CASE WHEN status = 'voted' THEN 1 ELSE 0 END) as voted FROM voters"
    );
    
    const [boothStats] = await db.query("SELECT COUNT(*) as total FROM booths");
    const [officerStats] = await db.query("SELECT COUNT(*) as total FROM officers");
    const [assignmentStats] = await db.query("SELECT COUNT(*) as total FROM assignments");

    const totalVoters = voterStats[0].total || 0;
    const votedVoters = voterStats[0].voted || 0;
    const totalBooths = boothStats[0].total || 0;
    const totalOfficers = officerStats[0].total || 0;
    const totalAssignments = assignmentStats[0].total || 0;

    res.json({
      totalVoters,
      registeredVoters: totalVoters - votedVoters,
      votedVoters,
      totalBooths,
      totalOfficers,
      totalAssignments,
      votingPercentage: totalVoters > 0 ? Math.round((votedVoters / totalVoters) * 100) : 0,
    });
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err.message });
  }
});

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`✔️ Backend server running at http://localhost:${PORT}`);
});
