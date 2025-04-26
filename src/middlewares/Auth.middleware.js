import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization; // get the Authorization header from the request

  if (!authHeader?.startsWith('Bearer ')) {
    // check if header exists and starts with 'Bearer '
    return res.status(401).json({ message: 'Unauthorized' }); // respond with 401 if not authorized
  }

  const token = authHeader.split(' ')[1]; // extract the token from the header

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token using the secret
    const user = await User.findById(decoded.id).select('-refreshTokens'); // find the user by id and exclude refreshTokens

    if (!user) {
      // if user not found
      return res.status(401).json({ message: 'User not found' }); // respond with 401 if user not found
    }

    req.user = user; // attach the user object to the request
    next(); // call the next middleware
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // check if the error is token expired
      return res.status(401).json({ message: 'Token expired' }); // respond with 401 if token expired
    }
    res.status(403).json({ message: 'Invalid token' }); // respond with 403 if token is invalid
  }
};

export const authorizeRoles = (...roles) => {
  // function to authorize based on user roles
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // check if user's role is in the allowed roles
      return res.status(403).json({ message: 'Forbidden' }); // respond with 403 if not allowed
    }
    next(); // call the next middleware
  };
};
