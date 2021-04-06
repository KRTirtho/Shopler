const FacebookStrategy = require("passport-facebook").Strategy
const {FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, FACEBOOK_CALLBACK_URL} = require("../config");
const User = require("../models/User");

const strategy = new FacebookStrategy({
    clientID: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET,
    callbackURL: FACEBOOK_CALLBACK_URL,
    authType: "reauthenticate",
    profileFields: ["id", "displayName", "emails", "picture.type(large)"]
}, function(accessToken, refreshToken, profile, done) {
    User.findOneAndUpdate({ facebookId: profile.id }, {
          username: profile.displayName,
          email: profile.emails && profile.emails[0]? profile.emails[0] : "Unavailable",
          imgSrc: profile.photos[0].value,
          type: "Facebook",
          facebookId: profile.id,
    }, {upsert: true},function (err, availableUser) {
        if(err)done(err)
        return done(null, availableUser)
      });
    }
)

module.exports = strategy