const User = require("../models/User");
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK } = require("../config")

const GithubStrategy = require("passport-github2").Strategy;

//! Only for development don't push origin to Github
const strategy = new GithubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: GITHUB_CALLBACK
}, function(accessToken, refreshToken, profile, done) {
  
  
  User.findOneAndUpdate({ githubId: profile.id }, {
        username: profile._json.login,
        email: profile._json.email || "Unavailable",
        imgSrc: profile._json.avatar_url,
        type: "Github",
        githubId: profile._json.id,
  }, {upsert: true},function (err, availableUser) {
      if(err)done(err)
      return done(null, availableUser)
    });

  })
  
  module.exports=strategy;

  // User.find().then(user=>console.log(user))