const passport = require("passport")
const LocalStrategy = require("./LocalStrategy")
const User = require("../models/User")
const GithubStrategy = require("./GithubStrategy")

//Serializing user

passport.serializeUser((user, done)=>{
    // console.log("Serilaizing user:", user )
    done(null, user)
})


passport.deserializeUser((id, done)=>{
    // console.log("Deserialize User:", id)
    User.findOne({_id: id}, 'username',(err, user)=>{
        if(err)done(err)
        // console.log("Deserialized__ user: ", user)
        done(null, user)
    })
})

passport.use("local", LocalStrategy)
passport.use("github", GithubStrategy)


module.exports = passport