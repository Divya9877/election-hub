const pool = require('./db');

async function main() {
  const demoVoter = {
    vid: 'DEMO-VOTER-1',
    aadhar: '111122223333',
    name: 'Demo Voter',
    phone: '9999000001',
    dob: '1990-01-01',
    gender: 'other',
    address: '123 Demo Street, Test City'
  };

  try {
    const sql = `INSERT INTO voters (vid, aadhar, name, phone, dob, gender, address, status, createdAt, updatedAt)
                 VALUES (?, ?, ?, ?, ?, ?, ?, 'registered', NOW(), NOW())`;

    await pool.query(sql, [
      demoVoter.vid,
      demoVoter.aadhar,
      demoVoter.name,
      demoVoter.phone,
      demoVoter.dob,
      demoVoter.gender,
      demoVoter.address,
    ]);

    console.log('✅ Demo voter inserted:', demoVoter.vid);
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      console.log('ℹ️ Demo voter already exists (duplicate key)');
    } else {
      console.error('❌ Error inserting demo voter:', err && err.message);
      process.exitCode = 1;
    }
  } finally {
    try { await pool.end(); } catch (e) {}
  }
}

main();
