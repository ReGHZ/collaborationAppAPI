import express from 'express';
import passport from 'passport';
import {
  loginSuccess,
  refreshToken,
  logout,
} from '../controllers/Auth.controller.js';
import { authenticateJWT } from '../middlewares/Auth.middleware.js';

const router = express.Router();

// OAuth Initiation
router.get('/google', passport.authenticate('google'));
router.get('/github', passport.authenticate('github'));

// OAuth Callbacks
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  loginSuccess
);

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login',
    session: false,
  }),
  loginSuccess
);

// Token Management
router.post('/refresh', refreshToken);
router.post('/logout', authenticateJWT, logout);

export default router;
