import Post from '../models/Post.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { content, projectName, tags } = req.body;

    if (!content || !content.trim()) {
      res.status(400);
      throw new Error('Post content cannot be empty');
    }

    const post = await Post.create({
      author: req.user._id,
      content,
      projectName: projectName || '',
      tags: tags || [],
    });

    const populatedPost = await post.populate('author', 'name username profilePicture');

    res.status(201).json({ success: true, post: populatedPost });
  } catch (error) {
    next(error);
  }
};

// @desc    Get global feed (all posts, newest first)
// @route   GET /api/posts
// @access  Private
const getFeed = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name username profilePicture')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ success: true, count: posts.length, posts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts by a specific user
// @route   GET /api/posts/user/:userId
// @access  Private
const getPostsByUser = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'name username profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: posts.length, posts });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post (only by its author)
// @route   DELETE /api/posts/:postId
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this post');
    }

    await post.deleteOne();

    res.status(200).json({ success: true, message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Like or unlike a post (toggle)
// @route   PUT /api/posts/:postId/like
// @access  Private
const toggleLike = async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.postId);
  
      if (!post) {
        res.status(404);
        throw new Error('Post not found');
      }
  
      const userId = req.user._id.toString();
      const alreadyLiked = post.likes.some((id) => id.toString() === userId);
  
      if (alreadyLiked) {
        post.likes = post.likes.filter((id) => id.toString() !== userId);
      } else {
        post.likes.push(req.user._id);
      }
  
      await post.save();
  
      res.status(200).json({
        success: true,
        likesCount: post.likes.length,
        liked: !alreadyLiked,
      });
    } catch (error) {
      next(error);
    }
  };

export { createPost, getFeed, getPostsByUser, deletePost, toggleLike };