const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization']; // get the authorization header from the request
  const token = authHeader && authHeader.split(' ')[1]; // extract the token from the header if it exists

  if (!token) {
    // if token does not exist
    return res.status(401).json({
      success: false, // indicate failure
      message: 'Access denied. No token provided. Please login to continue', // error message if token is missing
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify and decode the JWT token
    req.user = await User.findById(decoded.id).select('-password'); // find user by id from token, exclude password
    if (!req.user) return res.status(401).json({ message: 'User not found' }); // if user not found
    next(); // proceed to the next middleware
  } catch (e) {
    // if error occurs during token verification
    console.error('Error during decode token:', e); // log the error to console
    if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please login again.',
      });
    }
    return res.status(500).json({
      success: false, // indicate failure
      message: 'Something went wrong!', // generic error message
    });
  }
};

module.exports = authMiddleware;
