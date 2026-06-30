
const express = require("express");
const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
  getUserById,
  getAllUsers,
  getUsersBySkill,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// Logged-in user's profile
router.get("/profile", protect, getMyProfile);
router.put("/profile", protect, updateMyProfile);

// Search users by skill
router.get("/skills/:skill", getUsersBySkill);

// Get all users
router.get("/", protect, getAllUsers);

// Get public profile by ID
router.get("/:id", getUserById);

module.exports = router;
