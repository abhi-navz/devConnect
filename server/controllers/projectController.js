import Project from '../models/Project.js';
import Application from '../models/Application.js';

// @desc    Create a new project with roles needed
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { title, description, techStack, rolesNeeded } = req.body;

    if (!title || !description) {
      res.status(400);
      throw new Error('Title and description are required');
    }

    const project = await Project.create({
      title,
      description,
      owner: req.user._id,
      techStack: techStack || [],
      rolesNeeded: rolesNeeded || [],
    });

    const populated = await project.populate('owner', 'name username profilePicture');

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
    const query = { status: 'open' };

    if (skill) {
      query['rolesNeeded.skillsRequired'] = { $regex: `^${skill}$`, $options: 'i' };
    }

    const projects = await Project.find(query)
      .populate('owner', 'name username profilePicture')
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
      'owner',
      'name username profilePicture'
    );

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
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
      .populate('owner', 'name username profilePicture')
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
      throw new Error('Project not found');
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this project');
    }

    project.status = status;
    await project.save();

    res.status(200).json({ success: true, project });
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
      throw new Error('Project not found');
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this project');
    }

    // Clean up all applications tied to this project to avoid orphaned records
    await Application.deleteMany({ project: project._id });
    await project.deleteOne();

    res.status(200).json({ success: true, message: 'Project deleted' });
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
};