const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const UserModel = require("../models/userModel");

//  Local Strategy (already working) 
passport.use(UserModel.createStrategy());

//  Google Strategy 
passport.use(
  new GoogleStrategy(
    {
      clientID: "YOUR_GOOGLE_CLIENT_ID",
      clientSecret: "YOUR_GOOGLE_CLIENT_SECRET",
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = await UserModel.create({
            fullName: profile.displayName,
            email: profile.emails[0].value,
            role: "Attendants", // default role
            provider: "google",
          });
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

//  GitHub Strategy 
passport.use(
  new GitHubStrategy(
    {
      clientID: "YOUR_GITHUB_CLIENT_ID",
      clientSecret: "YOUR_GITHUB_CLIENT_SECRET",
      callbackURL: "/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({
          email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
        });
        if (!user) {
          user = await UserModel.create({
            fullName: profile.displayName || profile.username,
            email:
              profile.emails?.[0]?.value || `${profile.username}@github.com`,
            role: "Attendants",
            provider: "github",
          });
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

//  Facebook Strategy 
passport.use(
  new FacebookStrategy(
    {
      clientID: "YOUR_FACEBOOK_APP_ID",
      clientSecret: "YOUR_FACEBOOK_APP_SECRET",
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;
        let user = await UserModel.findOne({ email });
        if (!user) {
          user = await UserModel.create({
            fullName: profile.displayName,
            email,
            role: "Attendants",
            provider: "facebook",
          });
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

module.exports = passport;
