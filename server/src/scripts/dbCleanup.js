require("dotenv").config({ path: require("path").join(__dirname, "..", "..", ".env") });
const pool = require("../config/db");

(async () => {
  const before = {};
  for (const t of ["learning_contents", "topics", "concepts", "units"]) {
    const [c] = await pool.query(`SELECT COUNT(*) n FROM ${t}`);
    before[t] = c[0].n;
  }

  await pool.query(`DELETE lc FROM learning_contents lc LEFT JOIN topics t ON lc.topic_id=t.id WHERE t.id IS NULL`);
  await pool.query(`DELETE t FROM topics t LEFT JOIN concepts c ON t.concept_id=c.id WHERE c.id IS NULL`);
  await pool.query(`DELETE c FROM concepts c LEFT JOIN units u ON c.unit_id=u.id WHERE u.id IS NULL`);
  await pool.query(`DELETE u FROM units u JOIN (SELECT subject_code, name FROM units GROUP BY subject_code, name HAVING COUNT(*)>1) dup ON u.subject_code=dup.subject_code AND u.name=dup.name WHERE u.id NOT IN (SELECT mid FROM (SELECT MIN(id) mid FROM units GROUP BY subject_code, name) m)`);

  console.log("Before:", JSON.stringify(before));
  for (const t of ["learning_contents", "topics", "concepts", "units"]) {
    const [c] = await pool.query(`SELECT COUNT(*) n FROM ${t}`);
    console.log(`  ${t}: ${before[t]} -> ${c[0].n}`);
  }
  await pool.end();
})().catch((e) => {
  console.error("CLEANUP ERR", e.message);
  process.exit(1);
});