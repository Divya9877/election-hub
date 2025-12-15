const mysql = require('mysql2');


const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
});

connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL Connection Error:', err.message);
    console.error('\n⚠️  Make sure:');
    console.error('   1. MySQL Server is running');
    console.error('   2. DB credentials in backend/.env are correct');
    console.error('   3. Username and password match your MySQL setup\n');
    process.exit(1);
  }

  console.log('✅ Connected to MySQL\n');

  // Create database
  const createDbQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'election_hub'}`;
  
  connection.query(createDbQuery, (err) => {
    if (err) {
      console.error('❌ Error creating database:', err.message);
      process.exit(1);
    }

    console.log(`✅ Database '${process.env.DB_NAME || 'election_hub'}' ready\n`);

    // Switch to the database
    connection.changeUser({ database: process.env.DB_NAME || 'election_hub' }, (err) => {
      if (err) {
        console.error('❌ Error switching database:', err.message);
        process.exit(1);
      }

      // Create tables
      const tables = [
        // Voters Table
        `CREATE TABLE IF NOT EXISTS voters (
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
        )`,

        // Booths Table
        `CREATE TABLE IF NOT EXISTS booths (
          bid VARCHAR(50) PRIMARY KEY,
          location VARCHAR(255) NOT NULL,
          time VARCHAR(50) NOT NULL,
          assignedCount INT DEFAULT 0,
          completedCount INT DEFAULT 0,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`,

        // Officers Table
        `CREATE TABLE IF NOT EXISTS officers (
          oid VARCHAR(50) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          phone VARCHAR(15) UNIQUE NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`,

        // Assignments Table
        `CREATE TABLE IF NOT EXISTS assignments (
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
        )`
      ];

      let tablesCreated = 0;

      tables.forEach((table) => {
        connection.query(table, (err) => {
          if (err) {
            console.error('❌ Error creating table:', err.message);
            process.exit(1);
          }

          tablesCreated++;
          const tableNames = ['voters', 'booths', 'officers', 'assignments'];
          console.log(`✅ Table '${tableNames[tablesCreated - 1]}' created/verified`);

          if (tablesCreated === tables.length) {
            console.log('\n✅ All tables created successfully!\n');
            console.log('Database Setup Complete!');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('Tables created:');
            console.log('  • voters');
            console.log('  • booths');
            console.log('  • officers');
            console.log('  • assignments');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            connection.end();
            process.exit(0);
          }
        });
      });
    });
  });
});

process.on('error', (err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
