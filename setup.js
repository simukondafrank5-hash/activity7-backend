// Run once: npm run setup  (creates the table, adds seed records only if the table is empty)
const fs = require("fs");
const path = require("path");
const pool = require("../db");

(async () => {
  try {
    await pool.query(fs.readFileSync(path.join(__dirname, "..", "schema.sql"), "utf8"));
    const count = await pool.query("SELECT COUNT(*)::int AS n FROM records");
    if (count.rows[0].n === 0) {
      await pool.query(fs.readFileSync(path.join(__dirname, "..", "seed.sql"), "utf8"));
      console.log("Table created and seed records inserted.");
    } else {
      console.log("Table already has records; seed skipped.");
    }
  } catch (error) {
    console.error("Setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
