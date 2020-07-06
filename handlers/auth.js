const User = require("../models/User");
const mongoose = require("mongoose");
const fs = require("fs");
const { success } = require("../passport/LocalStrategy");
const cloudinary = require("cloudinary").v2
const userImageUpload = require("../Multer/userImage")

//! Api End point test-----
exports.getUsers = (req, res) => {
  User.find().exec((err, data) => {
    if (err) res.status(404).json({ Error: "No user available!" });
    res.status(404).json(data);
  });
};

//*User SignUp Handling-----------------------------------------------------
exports.signupUser = async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.newUserEmail,
    password: req.body.newUserPassword,
    age: req.body.age,
    companyName: req.body.companyName,
    businessEmail: req.body.businessEmail,
    address: req.body.address,
    country: req.body.country,
    zipCode: req.body.zipCode,
    region: req.body.region,
    imgSrc: null,
    imgId: null
  });
  if (req.body.newUserEmail && req.body.username) {
    const availableUser = User.find(
      { email: req.body.newUserEmail, username: req.body.username },
      (err, result) => {
        if (err) res.status(500).json({ Error: "Failed to scan user!" });
        else if (result.length === 0) {
          newUser.save((err, user) => {
            if (err) res.status(500).json({ Error: "Failed to save!" });
            res.status(200).json({Success: "Signed Up"});
          });
        } else if (result.length > 0) {
          res.status(403).json({ Error: "Email already taken" });
        }
      }
    );
    return availableUser;
  } else {
    return res
      .status(402)
      .json({ Error: "Please provide the information first!!" });
  }
};

//*Middleware for signUp user-------
exports.isAvailableUsername = async (req, res, next) => {
  const isAvailable = await User.find(
    { username: req.body.username },
    (err, user) => {
      if (err) res.status(500).json({ Error: "Failed to scan user!" });
      else if (user.length === 0) next(null, user);
      else if (user.length > 0)
        res.status(400).json({ Error: "User Name already taken!" });
    }
  );
  return isAvailable;
};

//*Authorization Checking Route handler
exports.isAuthorized = (req, res) => {
  if (req.isAuthenticated()) {
    const userInfo = User.findById(req.user._id).select("username email imgSrc review comment").exec((err, user) => {
      if (err) res.status(500).json({ Error: "Failed to authorize" });
      else if (!user || user.length === 0)
        res
          .status(404)
          .json({ Error: "User authorized but no found in the database" });
      else {
        return res.status(200).json({
          Login: true,
          email: user.email,
          username: user.username,
          _id: user._id,
          imgSrc: user.imgSrc,
          review: user.review,
          comment: user.comment
        });
      }
    });
    return userInfo
  } else {
    return res.status(400).json({ Login: false, message: "User unauthorized" });
  }
};
//*------------------------------------------------------------------

exports.getLoggedIn = (req, res) => {
  const userInfo = {
    _id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    age: req.user.age,
    imgSrc: req.user.imgSrc,
    reviewed: req.user.reviewed,
    commented: req.user.commented,
    imgSrc: req.user.imgSrc,
    review: req.user.review,
    comment: req.user.comment
    };
  res.json(userInfo);
};
/**
 * @body null
 * @user {user: Object}
  */
exports.logOut = (req, res) => {
  if (req.user || !req.user) {
    req.logOut();
    res.status(200).json({ Success: "Logging out" });
  } else {
    res.status(400).json({ Error: "No user to log out!" });
  }
};
/**
 * @params {userId}
 * @res <User> Model
  */
exports.getUserInfo = async (req, res) => {
  if (req.isAuthenticated && req.params.userId) {
    try {
      const findUser = await User.findById(req.params.userId)
        .select(
          "username email age companyName businessEmail address country region zipCode imgSrc"
        )
        .exec((err, user) => {
          if (err) res.status(500).json({ Error: "Failed to find user" });
          else if (!user || user.length === 0)
            res.status(404).json({ Message: "No user Found" });
          res.status(200).json(user);
        });
      return findUser;
    } catch (err) {
      res.status(500).json({ Error: "Failed to query user in the server" });
    }
  } else {
    res.status(401).json({ Error: "Unauthorized!" });
  }
};

exports.updateUserInfo = async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const findUserAndUpdate = await User.findByIdAndUpdate(
        req.body.userId,
        {
          username: req.body.username,
          age: req.body.age,
          companyName: req.body.companyName,
          address: req.body.address,
          country: req.body.country,
          zipCode: req.body.zipCode,
          region: req.body.region,
        },
        (err, updatedUser) => {
          if (err)
            res.status(500).json({ Error: "Failed update the credentials" });
          else if (!updatedUser || updatedUser.length === 0)
            res
              .status(404)
              .json({ Error: "No user exists with the provided id!" });
          res.status(200).json({ Success: "Updated user" });
        }
      );
      return findUserAndUpdate
    } catch (err) {
      res.status(403).json({ Error: "Failed to find the user!" });
    }
  } else {
    res.status(401).json({ Error: "Unauthorized!" });
  }
};
/**
 * @body {userId, prevImgSrc}
 * @res {Flash}
  */
exports.updateUserImage = async (req, res) => {
  console.log(req.file)
    try {
      // If user image already not available then we're saving or updating it
      const findUserAndUpdateImage = await User.findByIdAndUpdate(
        req.user._id,
        // If not in production then we save the folder url else Cloudinary
        { imgSrc: req.file.path, imgId: req.file.filename },
        (err, success) => {
          if (err)
            return res.status(500).json({ Error: "Failed update profile picture" });
          else if (!success || success.length === 0)res.status(404).json({ Error: "No user exists with the provided id!" });
            return res.status(200).json({ Success: "Updated user" });
        }
        );
        return findUserAndUpdateImage
      }
      catch (err) {
        console.log("USER Image Upload Error: ", err)
        res.status(403).json({ Error: "Unknown error occurred!" });
      } 
    };

    /**
     * @type Middleware
     * @returns next()
     * @body : @type : multipart/form-data as imgSrc
     * @user _id
     */
    //Flow: notAvailable? -> next(null, user) -> uploadUserImage.single("imgSrc") -> save To DB
    //Flow!: available? -> cloudinary.uploader.destroy(...).then(...) -> next(null, deletedImage) -> update to DB 
exports.checkImageAvailable = (req, res, next)=>{
  if(req.isAuthenticated()){
     User.findById(req.user._id).exec()
    .then(user=>{
      //Image of the user already exists then we delete the image
      // console.log(user)
      if(user && user.imgSrc && user.imgId){
        // If available already then just delete it 
        cloudinary.uploader.destroy(user.imgId, {invalidate: true})
        .then(deletedImage=>{
              // Deleted img is not available then error
              console.log(deletedImage)
        if(deletedImage.result==='not found')res.status(500).json({Error: "Failed to upload"})
              //if available then return next with deletedImage 
              return next(null, deletedImage)
            })
            .catch(err=>{
              console.error("Image Upload Error: ", err)
              return res.status(500).json({Error: "Unknown error occurred"})        
            })
          }
        // if not available then just calling the next middleware function 
        //And the work will be done afterwards by the callback function
        else if(user && !user.imgId && !user.imgSrc)next(null, user)
    })
    .catch(err=>{
      console.error("Image Upload Error: ", err)
      return res.status(500).json({Error: "Unknown error occurred"})
    })
  }

  else {
    res.status(401).json({Error: "Unauthorized, forbidden"})
  }
}

exports.testImageUpload = (req, res)=>{
  res.json(req.file)
}