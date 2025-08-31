const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');


const adminEmails = ['2023cs_ajeetkumar_a@nie.ac.in', 'ajeetkumarssm9987@gmail.com']; 

module.exports = function (passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    const isAdmin = adminEmails.includes(email);

    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) return done(null, user);

      user = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        email: email,
        photo: profile.photos[0].value,
        role: isAdmin ? 'admin' : 'user'
      });

      await user.save();
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
};
