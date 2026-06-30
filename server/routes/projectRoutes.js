
const express = require("express");
const router = express.Router();

const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  searchProjects,
} = require("../controllers/projectController");

const {
  sendRequest,
  getProjectRequests,
} = require("../controllers/requestController");

const { protect } = require("../middleware/authMiddleware");

// Search projects
router.get("/search", searchProjects);

// Project CRUD
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", protect, createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

// Join requests
router.post("/:projectId/request", protect, sendRequest);
router.get("/:projectId/requests", protect, getProjectRequests);

module.exports = router;

