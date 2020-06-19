const User = require("../models/User");
const LocalStrategy = require("passport-local").Strategy;


const strategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
    session: true
  },
  
    (req, email, password, done)=>{
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: "No user exists with that name!!",
          });
        }
        if (!user.checkPassword(password)) {
          return done(null, false, { message: "Password incorrect!!" });
        }
        return done(null, user);
      });
    }
  
);

module.exports = strategy;
