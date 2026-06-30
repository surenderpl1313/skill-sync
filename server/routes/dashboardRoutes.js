
const express = require("express");
const router = express.Router();

const {
  getMyProjects,
  getJoinedProjects,
  getMyRequests,
} = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");

router.get("/my-projects", protect, getMyProjects);
router.get("/joined-projects", protect, getJoinedProjects);
router.get("/my-requests", protect, getMyRequests);

module.exports = router;
