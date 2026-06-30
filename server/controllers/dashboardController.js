
const Project = require("../models/Project");
const JoinRequest = require("../models/JoinRequest");

// GET /api/dashboard/my-projects
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.user.id,
    })
      .populate("members", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET /api/dashboard/joined-projects
const getJoinedProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id,
      owner: { $ne: req.user.id },
    })
      .populate("owner", "name email profilePicture")
      .populate("members", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET /api/dashboard/my-requests
const getMyRequests = async (req, res) => {
  try {
    const requests = await JoinRequest.find({
      applicant: req.user.id,
    })
      .populate(
        "project",
        "title description technologies status projectImage"
      )
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMyProjects,
  getJoinedProjects,
  getMyRequests,
};
