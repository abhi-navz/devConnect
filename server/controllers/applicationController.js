import Application from "../models/Application.js";
import Project from "../models/Project.js";

// @desc    Apply to a specific role on a project
// @route   POST /api/applications
// @access  Private
const applyToRole = async (req, res, next) => {
  try {
    const { projectId, roleId, message } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    if (project.owner.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error("You cannot apply to your own project");
    }

    const role = project.rolesNeeded.id(roleId);
    if (!role) {
      res.status(404);
      throw new Error("Role not found on this project");
    }

    if (role.filled) {
      res.status(400);
      throw new Error("This role has already been filled");
    }

    const existing = await Application.findOne({
      project: projectId,
      applicant: req.user._id,
      roleId,
    });
    if (existing) {
      res.status(400);
      throw new Error("You have already applied to this role");
    }

    const application = await Application.create({
      project: projectId,
      applicant: req.user._id,
      roleId,
      roleName: role.roleName,
      message: message || "",
    });

    const populated = await application.populate(
      "applicant",
      "name username profilePicture skills"
    );

    res.status(201).json({ success: true, application: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for a project (owner only)
// @route   GET /api/applications/project/:projectId
// @access  Private
const getApplicationsForProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to view these applications");
    }

    const applications = await Application.find({
      project: req.params.projectId,
    })
      .populate(
        "applicant",
        "name username profilePicture skills githubUsername"
      )
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications the logged-in user has sent
// @route   GET /api/applications/mine
// @access  Private
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("project", "title status")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept an application — marks role filled, auto-rejects other pending applicants for that role
// @route   PUT /api/applications/:applicationId/accept
// @access  Private (project owner only)
const acceptApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      res.status(404);
      throw new Error("Application not found");
    }

    const project = await Project.findById(application.project);
    if (!project) {
      res.status(404);
      throw new Error("Associated project not found");
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to manage applications for this project");
    }

    if (application.status !== "pending") {
      res.status(400);
      throw new Error("This application has already been resolved");
    }

    // Mark this application accepted
    application.status = "accepted";
    await application.save();

    // Mark the role as filled on the project
    const role = project.rolesNeeded.id(application.roleId);
    if (role) {
      role.filled = true;
      await project.save();
    }

    // Auto-reject all other pending applications for the same role
    await Application.updateMany(
      {
        project: application.project,
        roleId: application.roleId,
        _id: { $ne: application._id },
        status: "pending",
      },
      { status: "rejected" }
    );

    res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject an application
// @route   PUT /api/applications/:applicationId/reject
// @access  Private (project owner only)
const rejectApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      res.status(404);
      throw new Error("Application not found");
    }

    const project = await Project.findById(application.project);
    if (!project) {
      res.status(404);
      throw new Error("Associated project not found");
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to manage applications for this project");
    }

    if (application.status !== "pending") {
      res.status(400);
      throw new Error("This application has already been resolved");
    }

    application.status = "rejected";
    await application.save();

    res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

export {
  applyToRole,
  getApplicationsForProject,
  getMyApplications,
  acceptApplication,
  rejectApplication,
};
