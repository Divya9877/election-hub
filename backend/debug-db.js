const pool = require('./db');

async function main() {
  try {
    const [current] = await pool.query('SELECT DATABASE() as db');
    console.log('Connected to database:', current[0].db);

    const [dbs] = await pool.query('SHOW DATABASES');
    console.log('\nDatabases:');
    dbs.forEach(d => console.log(' -', d.Database));

    console.log('\nTables in election_hub:');
    const [tables] = await pool.query("SHOW TABLES FROM `election_hub`");
    tables.forEach(t => console.log(' -', Object.values(t)[0]));

    console.log('\nChecking voters table rows (explicit DB reference):');
    const [rows] = await pool.query('SELECT * FROM `election_hub`.voters LIMIT 20');
    console.log('Rows returned:', rows.length);
    if (rows.length > 0) console.table(rows);

    await pool.end();
  } catch (err) {
    console.error('Debug DB error:', err.message);
    try { await pool.end(); } catch(e) {}
    process.exit(1);
  }
}

main();
