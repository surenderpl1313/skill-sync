const Project = require("../models/Project");

// POST /api/projects
const createProject = async (req, res) => {
  try {
    const { title, description, technologies, status } = req.body;
    const project = await Project.create({
      title,
      description,
      technologies,
      status,
      owner: req.user.id,
    });
    res.status(201).json({ message: "Project created", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner", "name email profilePicture")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email profilePicture bio skills")
      .populate("members", "name email profilePicture");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Only the owner can edit this project" });

    const { title, description, technologies, status } = req.body;
    if (title) project.title = title;
    if (description) project.description = description;
    if (technologies) project.technologies = technologies;
    if (status) project.status = status;

    await project.save();
    res.json({ message: "Project updated", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Only the owner can delete this project" });

    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/projects/search?tech=React&name=Recipe
const searchProjects = async (req, res) => {
  try {
    const { tech, name } = req.query;
    const query = {};

    if (tech) query.technologies = { $in: [new RegExp(tech, "i")] };
    if (name) query.title = { $regex: name, $options: "i" };

    const projects = await Project.find(query)
      .populate("owner", "name email profilePicture")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  searchProjects,
};