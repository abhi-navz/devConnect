import User from '../models/User.js';

// @desc    Get a user's public profile by username
// @route   GET /api/users/:username
// @access  Private
const getUserByUsername = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update logged-in user's own profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const { bio, skills, githubUsername, portfolio, location, profilePicture } = req.body;

    // Only update fields that were actually sent — allows partial updates
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills; // expects an array of strings
    if (githubUsername !== undefined) user.githubUsername = githubUsername;
    if (portfolio !== undefined) user.portfolio = portfolio;
    if (location !== undefined) user.location = location;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture,
        skills: updatedUser.skills,
        githubUsername: updatedUser.githubUsername,
        portfolio: updatedUser.portfolio,
        location: updatedUser.location,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { getUserByUsername, updateProfile };