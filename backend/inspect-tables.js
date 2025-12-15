const pool = require('./db');

async function inspectTable(table) {
  try {
    const [countRows] = await pool.query(`SELECT COUNT(*) AS cnt FROM \`${table}\``);
    const count = countRows[0].cnt;
    console.log(`\n=== ${table} (${count} rows) ===`);

    if (count === 0) {
      console.log('(no rows)');
      return;
    }

      const orderByMap = {
        voters: 'vid',
        booths: 'bid',
        officers: 'oid',
        assignments: 'assignmentId',
      };

      const orderBy = orderByMap[table];
      const q = orderBy
        ? `SELECT * FROM \`${table}\` ORDER BY \`${orderBy}\` ASC LIMIT 10`
        : `SELECT * FROM \`${table}\` LIMIT 10`;

      const [rows] = await pool.query(q);
      console.table(rows);
  } catch (err) {
    console.error(`Error inspecting table ${table}:`, err.message);
  }
}

async function main() {
  const tables = ['voters', 'booths', 'officers', 'assignments'];
  console.log('Inspecting database tables:');
  for (const t of tables) {
    await inspectTable(t);
  }
  // Close pool
  try {
    await pool.end();
  } catch (e) {
    // ignore
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
