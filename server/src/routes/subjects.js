const express = require("express");
const { getSubjects } = require("../lib/gameLogic");

const router = express.Router();

// GET /api/subjects - the Subject Selection screen, shown ahead of Board +
// Class selection. Each entry's `status` is "active" (real worlds/lessons/
// questions exist - see src/data/seedData.js) or "coming_soon" (listed on
// the roadmap, no content yet).
router.get("/", async (req, res, next) => {
  try {
    const data = await getSubjects();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
