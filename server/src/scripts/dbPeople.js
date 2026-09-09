require("dotenv").config({ path: require("path").join(__dirname, "..", "..", ".env") });
const pool = require("../config/db");
(async () => {
  const [roles] = await pool.query("SELECT role, status, COUNT(*) c FROM players GROUP BY role, status");
  console.log("PLAYER ROLES:", JSON.stringify(roles));
  const [rows] = await pool.query(
    "SELECT id, name, email, role, status, level, xp, coins, streak, current_grade, current_board, language FROM players ORDER BY role, level DESC LIMIT 60"
  );
  for (const r of rows) console.log([r.role, r.status, r.name, r.email, "L" + r.level, "xp" + r.xp, "c" + r.coins, "s" + r.streak, r.current_grade, r.current_board, r.id.slice(0, 8)].join(" | "));
  console.log("---teacher_boards---"); try { const [t] = await pool.query("SELECT * FROM teacher_boards LIMIT 5"); console.log(JSON.stringify(t)); } catch (e) { console.log(e.message); }
  console.log("---teacher_classes---"); try { const [t] = await pool.query("SELECT * FROM teacher_classes LIMIT 5"); console.log(JSON.stringify(t)); } catch (e) { console.log(e.message); }
  console.log("---teacher_subjects---"); try { const [t] = await pool.query("SELECT * FROM teacher_subjects LIMIT 5"); console.log(JSON.stringify(t)); } catch (e) { console.log(e.message); }
  console.log("---class_streams---"); try { const [t] = await pool.query("SELECT * FROM class_streams LIMIT 8"); console.log(JSON.stringify(t)); } catch (e) { console.log(e.message); }
  console.log("---quizzes---"); try { const [t] = await pool.query("SELECT id, title, subject_code, quiz_type, duration_minutes, total_marks, pass_marks, status FROM quizzes"); console.log(JSON.stringify(t, null, 1)); } catch (e) { console.log(e.message); }
  console.log("---admin_users---"); try { const [t] = await pool.query("SELECT id, name, email, role, status FROM admin_users"); console.log(JSON.stringify(t)); } catch (e) { console.log(e.message); }
  await pool.end();
})().catch((e) => { console.error("ERR", e.message); process.exit(1); });