require("dotenv").config();
const pool = require("../src/config/db");
const { seedSchoolCohort } = require("../lib/seedSchool");

(async () => {
  try {
    const [ins] = await pool.query(
      `INSERT INTO schools (name, normalized_name) VALUES (?, ?)`,
      [`Probe Seed ${Date.now()}`, `probe-seed-${Date.now()}`]
    );
    const [rows] = await pool.query("SELECT LAST_INSERT_ID() AS id");
    const schoolId = rows[0].id;
    console.log("scratch school id =", schoolId);
    const res = await seedSchoolCohort(schoolId, { board: "CBSE", grades: ["9"], subjects: ["physics", "chemistry"] });
    console.log("RESULT:", res);
  } catch (err) {
    console.error("FULL ERROR:", err);
  } finally {
    await pool.end();
  }
})();