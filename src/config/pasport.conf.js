import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';

const configurePassport = () => {
  // Serialization
  passport.serializeUser((user, done) => done(null, user.id)); // serialize user id to session
  passport.deserializeUser(async (id, done) => {
    // deserialize user from session
    try {
      const user = await User.findById(id); // find user by id
      done(null, user); // pass user to next middleware
    } catch (error) {
      done(error); // handle error
    }
  });

  // Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID, // Google client ID from env
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google client secret from env
        callbackURL: '/api/auth/google/callback', // callback URL after Google auth
        scope: ['profile', 'email'], // request profile and email scopes
        state: true, // enable state parameter for security
      },
      async (_accessToken, _refreshToken, profile, done) => {
        // verify callback
        try {
          const email = profile.emails[0].value; // get user's email from profile
          const user = await User.findOneAndUpdate(
            { email }, // find user by email
            {
              $set: {
                googleId: profile.id, // set googleId from profile
                displayName: profile.displayName, // set displayName from profile
                avatar: profile.photos?.[0]?.value, // set avatar from profile photos
                lastActive: new Date(), // update lastActive timestamp
              },
              $setOnInsert: {
                email, // set email if inserting new user
                role: 'user', // set default role
              },
            },
            { upsert: true, new: true } // create user if not exists, return new doc
          );
          done(null, user); // pass user to next middleware
        } catch (error) {
          done(error); // handle error
        }
      }
    )
  );

  // GitHub Strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID, // GitHub client ID from env
        clientSecret: process.env.GITHUB_CLIENT_SECRET, // GitHub client secret from env
        callbackURL: '/api/auth/github/callback', // callback URL after GitHub auth
        scope: ['user:email'], // request user email scope
        state: true, // enable state parameter for security
      },
      async (_accessToken, _refreshToken, profile, done) => {
        // verify callback
        try {
          const email = profile.emails[0].value; // get user's email from profile
          const user = await User.findOneAndUpdate(
            { email }, // find user by email
            {
              $set: {
                githubId: profile.id, // set githubId from profile
                displayName: profile.username, // set displayName from profile username
                avatar: profile.photos?.[0]?.value, // set avatar from profile photos
                lastActive: new Date(), // update lastActive timestamp
              },
              $setOnInsert: {
                email, // set email if inserting new user
                role: 'user', // set default role
              },
            },
            { upsert: true, new: true } // create user if not exists, return new doc
          );
          done(null, user); // pass user to next middleware
        } catch (error) {
          done(error); // handle error
        }
      }
    )
  );
};

export default configurePassport;
