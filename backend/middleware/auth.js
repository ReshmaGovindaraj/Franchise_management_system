// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized - Please login' });
  }
  next();
};

// Middleware to check if user is Admin
const isAdmin = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized - Please login' });
  }
  if (req.session.role !== 'Admin') {
    return res.status(403).json({ message: 'Forbidden - Admin access required' });
  }
  next();
};

// Middleware to check if user is Branch Manager
const isBranchManager = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized - Please login' });
  }
  if (req.session.role !== 'Branch Manager' && req.session.role !== 'Admin') {
    return res.status(403).json({ message: 'Forbidden - Branch Manager access required' });
  }
  next();
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isBranchManager
};
