const passport = require("passport")
const LocalStrategy = require("./LocalStrategy")
const User = require("../models/User")
const GithubStrategy = require("./GithubStrategy")
const FacebookStrategy = require("./FacebookStrategy")

//Serializing user

passport.serializeUser((user, done)=>{
    // console.log("Serilaizing user:", user )
    done(null, user.id)
})


passport.deserializeUser((id, done)=>{
    User.findById(id, 'username',(err, user)=>{
        if(err)done(err)
        // console.log("Deserialized__ user: ", user)
        done(null, user)
    })
})

passport.use(LocalStrategy)
passport.use("github", GithubStrategy)
passport.use("facebook", FacebookStrategy)

module.exports = passport