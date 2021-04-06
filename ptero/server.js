const express = require("express"); 
const bodyParser = require("body-parser");
const router = require("./routes/route");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const passport = require("./passport")
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const path = require("path");
const {PORT, MONGO_URI, NODE_ENV, SESSION_SECRET} = require("./config")

const dbConnection = mongoose.connection

//! Only for Development
const URI = MONGO_URI;

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then((db)=>console.log("Connection Established to: ", URI))
.catch(err=>console.log("Failed to connect:", err))

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('etag', false)

mongoose.set( 'useCreateIndex', true)
mongoose.set("useFindAndModify", false)

app.use(session({
  secret: SESSION_SECRET,
  store: new MongoStore({mongooseConnection: dbConnection}),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60*60*60*60*60
  }
}))
app.use(passport.initialize())
app.use(passport.session())

app.use("/api", router);

//For all routes in production
if(NODE_ENV==="production"){
  app.use(express.static("..tyranno/build"))
  // important because if not set then React Router won't work
  app.get("/*", (req, res)=>{
    res.sendFile(path.join(__dirname, "..", "tyranno", "build", "index.html"))
    console.log("MATCH")
  })
}


app.listen(PORT, (err)=>{
  if(err)throw new Error("Failed starting the server on: "+PORT)
  console.log("Connected to "+PORT);
});
mongoose.Promise = global.Promise
module.exports = URI