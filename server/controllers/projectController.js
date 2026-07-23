import Project from "../models/Project.js";
import Application from "../models/Application.js";
import User from '../models/User.js';

// @desc    Create a new project with roles needed
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { title, description, techStack, rolesNeeded } = req.body;

    if (!title || !description) {
      res.status(400);
      throw new Error("Title and description are required");
    }

    const project = await Project.create({
      title,
      description,
      owner: req.user._id,
      techStack: techStack || [],
      rolesNeeded: rolesNeeded || [],
    });

    const populated = await project.populate(
      "owner",
      "name username profilePicture"
    );

    res.status(201).json({ success: true, project: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Browse all open projects (with optional skill filter)
// @route   GET /api/projects?skill=React
// @access  Private
const getAllProjects = async (req, res, next) => {
  try {
    const { skill } = req.query;
    const query = { status: "open" };

    if (skill) {
      // Partial, case-insensitive match against EITHER the tech stack OR any role's required skills
      const regex = { $regex: skill.trim(), $options: "i" };
      query.$or = [
        { techStack: regex },
        { "rolesNeeded.skillsRequired": regex },
      ];
    }

    const projects = await Project.find(query)
      .populate("owner", "name username profilePicture")
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ success: true, count: projects.length, projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single project by ID
// @route   GET /api/projects/:projectId
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId).populate(
      "owner",
      "name username profilePicture"
    );

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// @desc    Get projects owned by the logged-in user
// @route   GET /api/projects/mine
// @access  Private
const getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ owner: req.user._id })
      .populate("owner", "name username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: projects.length, projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project status (open/closed) — only by owner
// @route   PUT /api/projects/:projectId/status
// @access  Private
const updateProjectStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this project");
    }

    project.status = status;
    await project.save();

    const populated = await project.populate(
      "owner",
      "name username profilePicture"
    );

    res.status(200).json({ success: true, project: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project — only by owner
// @route   DELETE /api/projects/:projectId
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to delete this project");
    }

    // Clean up all applications tied to this project to avoid orphaned records
    await Application.deleteMany({ project: project._id });
    await project.deleteOne();

    res.status(200).json({ success: true, message: "Project deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project details (owner only) — full replace of editable fields
// @route   PUT /api/projects/:projectId
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to edit this project");
    }

    const { title, description, techStack, rolesNeeded } = req.body;

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (techStack !== undefined) project.techStack = techStack;
    if (rolesNeeded !== undefined) project.rolesNeeded = rolesNeeded;

    const updated = await project.save();
    const populated = await updated.populate(
      "owner",
      "name username profilePicture"
    );

    res.status(200).json({ success: true, project: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Suggest developers for a specific role based on skill overlap
// @route   GET /api/projects/:projectId/suggestions/:roleId
// @access  Private (project owner only)
const suggestDevelopersForRole = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to view suggestions for this project');
    }

    const role = project.rolesNeeded.id(req.params.roleId);
    if (!role) {
      res.status(404);
      throw new Error('Role not found on this project');
    }

    const requiredSkills = role.skillsRequired.map((s) => s.toLowerCase());

    if (requiredSkills.length === 0) {
      return res.status(200).json({
        success: true,
        suggestions: [],
        message: 'This role has no specific skills listed to match against',
      });
    }

    // Exclude the project owner from suggestions
    const candidates = await User.find({ _id: { $ne: project.owner } }).select(
      'name username profilePicture skills bio'
    );

    const scored = candidates
      .map((candidate) => {
        const candidateSkills = (candidate.skills || []).map((s) => s.toLowerCase());
        const matchedSkills = requiredSkills.filter((skill) => candidateSkills.includes(skill));
        const matchScore = Math.round((matchedSkills.length / requiredSkills.length) * 100);

        return {
          user: candidate,
          matchScore,
          matchedSkills: role.skillsRequired.filter((s) =>
            matchedSkills.includes(s.toLowerCase())
          ),
        };
      })
      .filter((entry) => entry.matchScore > 0) // no point suggesting 0% matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10); // top 10 only

    res.status(200).json({ success: true, suggestions: scored });
  } catch (error) {
    next(error);
  }
};

export {
  createProject,
  getAllProjects,
  getProjectById,
  getMyProjects,
  updateProjectStatus,
  deleteProject,
  updateProject,
  suggestDevelopersForRole,
};
