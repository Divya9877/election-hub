const pool = require('./db');

async function main() {
  try {
    const [rows] = await pool.query('SELECT 1 as ok');
    console.log('DB test query result:', rows);
    await pool.end();
  } catch (err) {
    console.error('Connection test error (full):', err);
    try { await pool.end(); } catch (e) {}
    process.exit(1);
  }
}

main();
