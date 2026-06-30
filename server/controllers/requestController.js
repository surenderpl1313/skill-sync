
const JoinRequest = require("../models/JoinRequest");
const Project = require("../models/Project");

// POST /api/projects/:projectId/request
const sendRequest = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.owner.toString() === req.user.id) {
      return res.status(400).json({
        message: "You cannot join your own project",
      });
    }

    if (project.members.includes(req.user.id)) {
      return res.status(400).json({
        message: "You are already a member of this project",
      });
    }

    const existingRequest = await JoinRequest.findOne({
      applicant: req.user.id,
      project: req.params.projectId,
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You have already sent a request for this project",
      });
    }

    const request = await JoinRequest.create({
      applicant: req.user.id,
      project: req.params.projectId,
      message: req.body.message || "",
    });

    res.status(201).json({
      message: "Join request sent successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET /api/projects/:projectId/requests
const getProjectRequests = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only the owner can view requests",
      });
    }

    const requests = await JoinRequest.find({
      project: req.params.projectId,
    }).populate(
      "applicant",
      "name email profilePicture skills bio"
    );

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// PUT /api/requests/:requestId/accept
const acceptRequest = async (req, res) => {
  try {
    const request = await JoinRequest.findById(
      req.params.requestId
    ).populate("project");

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (request.project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only the owner can accept requests",
      });
    }

    request.status = "accepted";
    await request.save();

    const project = await Project.findById(
      request.project._id
    );

    const alreadyMember = project.members.some(
      (member) => member.toString() === request.applicant.toString()
    );

    if (!alreadyMember) {
      project.members.push(request.applicant);
      await project.save();
    }

    res.status(200).json({
      message: "Request accepted successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// PUT /api/requests/:requestId/reject
const rejectRequest = async (req, res) => {
  try {
    const request = await JoinRequest.findById(
      req.params.requestId
    ).populate("project");

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (request.project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only the owner can reject requests",
      });
    }

    request.status = "rejected";
    await request.save();

    res.status(200).json({
      message: "Request rejected successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sendRequest,
  getProjectRequests,
  acceptRequest,
  rejectRequest,
};
