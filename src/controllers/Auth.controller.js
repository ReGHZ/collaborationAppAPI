import authService from '../services/Auth.service.js';

export const loginSuccess = (req, res) => {
  const accessToken = authService.generateAccessToken(req.user); // generate access token for the user
  const refreshToken = authService.generateRefreshToken(req.user); // generate refresh token for the user

  res.json({
    user: req.user, // return user data
    tokens: {
      access: accessToken, // return access token
      refresh: refreshToken, // return refresh token
    },
  });
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body; // get refresh token from request body
    const accessToken = await authService.refreshAccessToken(refreshToken); // generate new access token using refresh token
    res.json({ accessToken }); // return new access token
  } catch (error) {
    res.status(401).json({ message: error.message }); // return error if refresh fails
  }
};

export const logout = async (req, res) => {
  if (req.user) {
    // check if user exists in request
    await authService.revokeRefreshToken(req.body.refreshToken); // revoke the refresh token
  }
  res.status(204).end(); // send no content response
};
