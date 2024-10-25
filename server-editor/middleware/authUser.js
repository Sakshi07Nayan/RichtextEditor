const passport = require('passport');
const jwt = require('jsonwebtoken');

// Utility function to extract token from different sources
const extractToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  } else if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
};

const authorizeUser = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({
      error: true,
      message: "No auth token"
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Use passport JWT strategy for authentication
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        return res.status(500).json({ 
          error: true, 
          message: "Internal server error" 
        });
      }
      
      if (!user) {
        return res.status(401).json({
          error: true,
          message: info ? info.message : "Invalid or expired token"
        });
      }
      
      req.user = user;
      next();
    })(req, res, next);
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: "Invalid or expired token"
    });
  }
};

module.exports = authorizeUser;