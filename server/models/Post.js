import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      trim: true,
      maxlength: [1000, 'Post cannot exceed 1000 characters'],
    },
    projectName: {
      type: String,
      trim: true,
      default: '',
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null, // optional — links to an actual DevSync project if selected
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
      },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
export default Post;