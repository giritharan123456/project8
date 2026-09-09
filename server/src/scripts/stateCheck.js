require("dotenv").config({ path: require("path").join(__dirname, "..", "..", ".env") });
const pool = require("../config/db");

(async () => {
  const [demos] = await pool.query("SELECT id, role, name, email, current_grade, current_board, school_id FROM players WHERE email LIKE '%@demo.chemquest.gg' ORDER BY current_grade, current_board, name");
  console.log("DEMO (email holders):");
  for (const x of demos) console.log(`  ${x.id} | ${x.role} | ${x.name} | ${x.email} | g=${x.current_grade} b=${x.current_board} school=${x.school_id}`);

  const [stu] = await pool.query("SELECT id, name, email, current_grade, current_board, school_id FROM players WHERE role='STUDENT' AND email IS NULL ORDER BY id LIMIT 40");
  console.log("\nSTUDENTS w/o email (first 40):");
  for (const x of stu) console.log(`  ${x.id} | ${x.name} | g=${x.current_grade} b=${x.current_board} school=${x.school_id}`);

  for (const t of ["admin_users", "class_subjects", "board_subjects"]) {
    const [cols] = await pool.query("SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=? ORDER BY ORDINAL_POSITION", [t]);
    console.log(`\n${t} cols: ${cols.map((c) => c.COLUMN_NAME).join(", ")}`);
  }
  const [au] = await pool.query("SELECT * FROM admin_users");
  console.log("\nADMIN_USERS:");
  for (const x of au) console.log(`  ${JSON.stringify(x)}`);

  const [cs] = await pool.query("SELECT * FROM class_subjects LIMIT 40");
  console.log("\nCLASS_SUBJECTS (first 40):");
  for (const x of cs) console.log(`  ${JSON.stringify(x)}`);

  const [bs] = await pool.query("SELECT * FROM board_subjects LIMIT 30");
  console.log("\nBOARD_SUBJECTS (first 30):");
  for (const x of bs) console.log(`  ${JSON.stringify(x)}`);

  await pool.end();
})().catch((e) => {
  console.error("ERR", e.message);
  process.exit(1);
});