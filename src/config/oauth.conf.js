const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Google client ID from environment variables
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google client secret from environment variables
      callbackURL: '/auth/google/callback', // Callback URL for Google OAuth
    },
    async (accessToken, refreshToken, profile, done) => {
      // Find user by Google profile ID and provider
      let user = await User.findOne({
        oauthId: profile.id, // OAuth ID from Google profile
        provider: 'google', // Provider is Google
      });
      if (!user) {
        // If user not found, create new user
        user = await User.create({
          oauthId: profile.id, // Set OAuth ID
          provider: 'google', // Set provider to Google
          name: profile.displayName, // Set user's display name
          email: profile.emails[0].value, // Set user's email
          avatar: profile.photos[0].value, // Set user's avatar URL
        });
      }
      return done(null, user); // Return user to Passport
    }
  )
);

// GitHub OAuth
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID, // GitHub client ID from environment variables
      clientSecret: process.env.GITHUB_CLIENT_SECRET, // GitHub client secret from environment variables
      callbackURL: '/auth/github/callback', // Callback URL for GitHub OAuth
    },
    async (accessToken, refreshToken, profile, done) => {
      // Find user by GitHub profile ID and provider
      let user = await User.findOne({
        oauthId: profile.id, // OAuth ID from GitHub profile
        provider: 'github', // Provider is GitHub
      });
      if (!user) {
        // If user not found, create new user
        user = await User.create({
          oauthId: profile.id, // Set OAuth ID
          provider: 'github', // Set provider to GitHub
          name: profile.displayName, // Set user's display name
          email: profile.emails[0].value, // Set user's email
          avatar: profile.photos[0].value, // Set user's avatar URL
        });
      }
      return done(null, user); // Return user to Passport
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize user ID to session
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id); // Find user by ID from session
  done(null, user); // Return user object
});

module.exports = passport;
