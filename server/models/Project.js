import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: true,
      trim: true,
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    filled: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true } // each role gets its own _id so applications can reference a specific role
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    techStack: {
      type: [String],
      default: [],
    },
    rolesNeeded: {
      type: [roleSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;