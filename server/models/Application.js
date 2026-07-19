import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    roleName: {
      type: String,
      required: true, // denormalized snapshot — survives even if the role is edited/removed later
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// One application per user per role — no spamming the same role repeatedly
applicationSchema.index({ project: 1, applicant: 1, roleId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;