const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/route");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const passport = require("./passport")
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const PORT = process.env.PORT || 4000;

const URI = process.env.MONGO_URI ||  "mongodb://127.0.0.1:27017/Todo";

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then((db)=>console.log("Connection Established to: ", URI))
.catch(err=>console.log("Failed to connect:", err))

const dbConnection = mongoose.connection


app.use(cors());
app.use("/api/image", express.static("FileStorage/productImage"))
app.use("/api/user/image", express.static("FileStorage/userImage"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('etag', false)

mongoose.set( 'useCreateIndex', true)
mongoose.set("useFindAndModify", false)

app.use(session({
  secret: process.env.SESSION_SECRET ||  "hehamigo",
  store: new MongoStore({mongooseConnection: dbConnection}),
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

//Initial page as response

app.get("/", (req, res) => {
  res.json("Todo Storage");
});

//For all routes
app.use("/api", router);

if(process.env.NODE_ENV==="production"){
  app.use(express.static(__dirname+"/client/build"))
}

app.listen(PORT, (err)=>{
  if(err)throw new Error("Failed starting the server on: "+PORT)
  console.log("Connected to "+PORT);
});

mongoose.Promise = global.Promise
module.exports = URI
