import jwt from 'jsonwebtoken';
import User from '../models/User.js';

class AuthService {
  // Generate a new access token for the user
  generateAccessToken(user) {
    return jwt.sign(
      {
        id: user._id, // user's unique identifier
        email: user.email, // user's email address
        role: user.role, // user's role
      },
      process.env.JWT_SECRET, // secret key for signing access token
      { expiresIn: '15m' } // token expires in 15 minutes
    );
  }

  // Generate a new refresh token for the user
  generateRefreshToken(user) {
    const refreshToken = jwt.sign(
      { id: user._id }, // only user's id is included in refresh token
      process.env.JWT_REFRESH_SECRET, // secret key for signing refresh token
      { expiresIn: '7d' } // refresh token expires in 7 days
    );

    // Save the refresh token to the user's document in the database
    User.findByIdAndUpdate(
      user._id, // find user by id
      { $addToSet: { refreshTokens: refreshToken } }, // add refresh token to array if not present
      { new: true } // return the updated document
    ).exec(); // execute the query

    return refreshToken; // return the generated refresh token
  }

  // Generate a new access token using a valid refresh token
  async refreshAccessToken(refreshToken) {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET); // verify and decode refresh token

    const user = await User.findOne({
      _id: decoded.id, // find user by decoded id
      refreshTokens: refreshToken, // ensure refresh token exists in user's refreshTokens array
    });

    if (!user) throw new Error('Invalid refresh token'); // throw error if user not found

    return this.generateAccessToken(user); // generate and return new access token
  }

  // Remove a refresh token from the user's document
  async revokeRefreshToken(refreshToken) {
    await User.updateOne(
      { refreshTokens: refreshToken }, // find user with the refresh token
      { $pull: { refreshTokens: refreshToken } } // remove the refresh token from array
    );
  }
}

export default new AuthService();
