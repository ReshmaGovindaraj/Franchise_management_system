const User = require('../models/User');
const Branch = require('../models/Branch');

// Register user
exports.register = async (req, res) => {
  try {
    const { username, email, password, role, branch } = req.body;

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      username,
      email,
      password,
      role: role || 'Branch Manager',
      branch: branch || null
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      userId: user._id,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).populate('branch');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'User account is inactive' });
    }

    // Store user info in session
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.email = user.email;
    req.session.role = user.role;
    req.session.branch = user.branch;

    console.log('User logged in:', {
      userId: user._id,
      email: user.email,
      role: user.role,
      branchId: user.branch?._id,
      sessionId: req.sessionID
    });

    res.json({
      message: 'Login successful',
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      branch: user.branch
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Logout user
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.session.userId) {
      console.warn('getCurrentUser: No userId in session');
      return res.status(401).json({ message: 'Not authenticated' });
    }

    console.log('getCurrentUser: Fetching user', {
      userId: req.session.userId,
      sessionId: req.sessionID
    });

    const user = await User.findById(req.session.userId).populate('branch');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      branch: user.branch
    });
  } catch (error) {
    console.error('getCurrentUser error:', error);
    res.status(500).json({ message: error.message });
  }
};
