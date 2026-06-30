
const express = require("express");
const router = express.Router();

const {
  acceptRequest,
  rejectRequest,
} = require("../controllers/requestController");

const { protect } = require("../middleware/authMiddleware");

router.put("/:requestId/accept", protect, acceptRequest);
router.put("/:requestId/reject", protect, rejectRequest);

module.exports = router;

