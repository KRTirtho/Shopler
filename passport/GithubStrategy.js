const User = require("../models/User");
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = require("../config")

const GithubStrategy = require("passport-github").Strategy;

//! Only for development don't push origin to Github
const strategy = new GithubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/api/auth/github/callback"
}, function(accessToken, refreshToken, profile, cb) {
    const newUser = new User({
      username: profile._json.login,
      email: profile._json.email || "Unavailable",
      imgSrc: profile._json.avatar_url,
      type: profile.provider,
      githubId: profile.id,
      age: "Unavailable",
      companyName: "Unavailable",
      businessEmail: "Unavailable",
      address: "Unavailable",
      country: "Unavailable",
      zipCode: "Unavailable",
      region: "Unavailable",
    })
  
  
    User.findOne({ githubId: profile.id }, function (err, user) {
      if(err)cb(err)
      //If there is no user then we save credentials 
      if(!user || user.length===0){
        newUser.save((err, result)=>{
          if(err)cb(err)
          return cb(null, result);
        })
      }
      //Else we just return the profile and don't save it
      console.log(profile._json.login, profile._json)
      return cb(null, profile)
    });

  })
  
  module.exports=strategy;
  
  var x = {
    id: '61944859',
    displayName: 'KR Tirtho',
    username: 'KRTirtho',
    profileUrl: 'https://github.com/KRTirtho',
    photos: [
      { value: 'https://avatars1.githubusercontent.com/u/61944859?v=4' }
     ],
     provider: 'github',
     _raw: '{"login":"KRTirtho","id":61944859,"node_id":"MDQ6VXNlcjYxOTQ0ODU5","avatar_url":"https://avatars1.githubusercontent.com/u/61944859?v=4","gravatar_id":"","url":"https://api.github.com/users/KRTirtho","html_url":"https://github.com/KRTirtho","followers_url":"https://api.github.com/users/KRTirtho/followers","following_url":"https://api.github.com/users/KRTirtho/following{/other_user}","gists_url":"https://api.github.com/users/KRTirtho/gists{/gist_id}","starred_url":"https://api.github.com/users/KRTirtho/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/KRTirtho/subscriptions","organizations_url":"https://api.github.com/users/KRTirtho/orgs","repos_url":"https://api.github.com/users/KRTirtho/repos","events_url":"https://api.github.com/users/KRTirtho/events{/privacy}","received_events_url":"https://api.github.com/users/KRTirtho/received_events","type":"User","site_admin":false,"name":"KR Tirtho","company":"Self-Employed","blog":"N/A","location":"Dhaka, Bangladesh","email":null,"hireable":null,"bio":"Wanna be a Dreamer about making software but not a programmer!!","twitter_username":null,"public_repos":14,"public_gists":0,"followers":0,"following":2,"created_at":"2020-03-08T17:07:09Z","updated_at":"2020-06-28T12:36:32Z"}',
     _json: {
       login: 'KRTirtho',
       id: 61944859,
       node_id: 'MDQ6VXNlcjYxOTQ0ODU5',
       avatar_url: 'https://avatars1.githubusercontent.com/u/61944859?v=4',
       gravatar_id: '',
       url: 'https://api.github.com/users/KRTirtho',
       html_url: 'https://github.com/KRTirtho',
       followers_url: 'https://api.github.com/users/KRTirtho/followers',
       following_url: 'https://api.github.com/users/KRTirtho/following{/other_user}',
       gists_url: 'https://api.github.com/users/KRTirtho/gists{/gist_id}',
       starred_url: 'https://api.github.com/users/KRTirtho/starred{/owner}{/repo}',
       subscriptions_url: 'https://api.github.com/users/KRTirtho/subscriptions',
       organizations_url: 'https://api.github.com/users/KRTirtho/orgs',
       repos_url: 'https://api.github.com/users/KRTirtho/repos',
       events_url: 'https://api.github.com/users/KRTirtho/events{/privacy}',
       received_events_url: 'https://api.github.com/users/KRTirtho/received_events',
       type: 'User',
       site_admin: false,
       name: 'KR Tirtho',
       company: 'Self-Employed',
       blog: 'N/A',
       location: 'Dhaka, Bangladesh',
       email: null,
       hireable: null,
       bio: 'Wanna be a Dreamer about making software but not a programmer!!',
       twitter_username: null,
       public_repos: 14,
       public_gists: 0,
       followers: 0,
       following: 2,
       created_at: '2020-03-08T17:07:09Z',
       updated_at: '2020-06-28T12:36:32Z'
      }
   }

      // console.log(x._json.login, x._json.url)