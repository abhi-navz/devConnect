import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// @desc    Add a comment or reply to a post
// @route   POST /api/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { postId, content, parentComment } = req.body;

    if (!content || !content.trim()) {
      res.status(400);
      throw new Error('Comment cannot be empty');
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // If replying, make sure the parent comment actually exists and belongs to the same post
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (!parent || parent.post.toString() !== postId) {
        res.status(400);
        throw new Error('Invalid parent comment');
      }
      // Prevent reply-to-reply: force all replies to attach to a top-level comment
      if (parent.parentComment) {
        res.status(400);
        throw new Error('Cannot reply to a reply');
      }
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content,
      parentComment: parentComment || null,
    });

    const populatedComment = await comment.populate('author', 'name username profilePicture');

    res.status(201).json({ success: true, comment: populatedComment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all comments (+ replies) for a post
// @route   GET /api/comments/post/:postId
// @access  Private
const getCommentsForPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name username profilePicture')
      .sort({ createdAt: 1 }); // oldest first, natural conversation order

    // Nest replies under their parent comment for easy frontend rendering
    const topLevel = comments.filter((c) => !c.parentComment);
    const replies = comments.filter((c) => c.parentComment);

    const structured = topLevel.map((comment) => ({
      ...comment.toObject(),
      replies: replies.filter((r) => r.parentComment.toString() === comment._id.toString()),
    }));

    res.status(200).json({ success: true, count: comments.length, comments: structured });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment (only by its author)
// @route   DELETE /api/comments/:commentId
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this comment');
    }

    // If it's a top-level comment, also delete all its replies to avoid orphans
    if (!comment.parentComment) {
      await Comment.deleteMany({ parentComment: comment._id });
    }

    await comment.deleteOne();

    res.status(200).json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};

export { addComment, getCommentsForPost, deleteComment };