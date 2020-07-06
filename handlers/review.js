const Product = require("../models/Image");
const User = require("../models/User");
const { Types } = require("mongoose");
const { deleteProduct } = require("./products");
const { remove } = require("../models/Image");
const {OK, NOT_FOUND, METHOD_FAILURE, INTERNAL_SERVER_ERROR, UNAUTHORIZED, NOT_ACCEPTABLE, CONFLICT, FAILED_DEPENDENCY} = require("http-status-codes")

/**
 * @body productId: MongoObjectId, providerId: MongoObjectId   
 * @res {Flash} no data
 */
const addAffection = (req, res) => {
  //Security Check
  const {productId, providerId} = req.body
  if (req.isAuthenticated()) {
    /*
    % $addToSet only inserts the document value if it already doesn't exist. if exist then it cancel the operation without errors
    % $pull deletes value<any> of a array sub-document with the provided unique selector or _id  
    */
    Product.findByIdAndUpdate(productId, {$addToSet: {review: {provider: Types.ObjectId(providerId)}}}, {new: true}).select("review -_id").exec()
      .then(product=>{
        if(!product)res.status(NOT_FOUND).json({Error: "Failed to review the product as product doesn't exist", affection: false})
        else if(product){
          // Now saving the productId to User for Relational Later on
         return  User.findByIdAndUpdate(providerId, {$addToSet: {review: {productId: Types.ObjectId(productId)}}}, {new: true}).select("review -_id").exec()
            .then(user=>{
              //% If the record doesn't get saved to user block then we have to remove it from product also...(It's a undo/fallback) 
              if(!user){
                return Product.findByIdAndUpdate(productId, {$pull: {review: {provider: providerId}}}, {new: true}).exec()
                    .then(deletedProduct=>{
                      if(!deleteProduct)res.status(500).json({Error: "Failed to undo saving in Product.review.$.provider"})
                      return res.status(METHOD_FAILURE).json({Error: "Failed to give affection to the product", affection: false}) 
                    })
                    .catch(err=>{
                      console.log("ADD AFFECTIONATE ERROR: ", err)
                      return res.status(INTERNAL_SERVER_ERROR).json({Error: "Unknown error occurred", affection:false})
                    })//Undo product affection ends
              }
              //If user is available then its ok
              return res.status(OK).json({Success: "You are now affectionate to the product Seller", affection: true})
            })
            .catch(err=>{
              console.log("ADD AFFECTION ERROR: ", err)
              return res.status(INTERNAL_SERVER_ERROR).json({Error: "Unknown error occurred", affection: false})
            })//End of adding affectionate product in User
        }
      })
      .catch(err=>{
        console.log("Add Affection Error: ", err)
        return res.status(INTERNAL_SERVER_ERROR).json({Error: "Unknown error occurred"})
      })//End of adding provider to Product
    }
  //For unauthorized
  else {
    return res.status(UNAUTHORIZED).json({ Error: "Unauthorized, forbidden" });
  }
};

/**
   * @body {productId, providerId (actually removerId)}
   * @res {Flash}
   */

const removeAffection = (req, res) => {
  //Req.body
  const { productId, providerId } = req.body;

  if (req.isAuthenticated()) {
    //Checking if product available or not
    Product.findByIdAndUpdate(productId, {$pull: {review: {provider: providerId}}})
      .exec()
      .then((product) => {
        if (!product)res.status(NOT_ACCEPTABLE).json({ Error: "No product available with the provided id", affection: true });
        // now deleting the product from user
         User.findByIdAndUpdate(providerId, {$pull: {review: {productId: productId}}}).exec()
          .then(user=>{
            // If for some reason user has a error then we undo the delete (Fallback)
            if(!user){
              // Undoing previous delete
              Product.findByIdAndUpdate(productId, {$addToSet: {review: {provider: providerId}}})
              .exec()
              .then(product=>{
                if(!product)res.status(METHOD_FAILURE),json({Error: "Failed to undo product un-affectionate"})
                return res.status(FAILED_DEPENDENCY).json({Error: "Un-affection, unsuccessful", affection: true})
              })
              .catch(err=>{
                console.log("REMOVE AFFECTION ERROR: ", err)
                return res.status(INTERNAL_SERVER_ERROR).json({Error: "Unknown error occurred", affection: true})
              })//Ends Product undoing (Fallback)
            }

            //now we response if problem
            return res.status(OK).json({Success: "You're are now not affectionate to the seller", affection: false})
          })
          .catch(err=>{
            console.log("REMOVE AFFECTION ERROR: ", err)
            return res.status(INTERNAL_SERVER_ERROR).json({Error: "Unknown error occurred", affection: true})
          })//Ends Removing Affection History
        })
        .catch((err) => {
          return res
          .status(INTERNAL_SERVER_ERROR)
          .json({
            Error: "Unknown error occurred, failed to save the review ",
            affection: true
          });//Ends Removing Affection from Product
        });
      }
        else {
        return res.status(UNAUTHORIZED).json({ Error: "Unauthorized, forbidden" });
      }
    } 
// Main index function for add & remove affection
exports.affection = (req, res)=>{
  const { add, remove } = req.query
  if(add==="true" && remove==="true"){
    return res.status(CONFLICT).json({Error: "Conflictual Error: Can't do two task of a same thread at one time"})
  }
  else if(add==="true" && remove!=="true"){
    return addAffection(req, res)
  }
  else if(remove==="true" && add!=="true"){
    return removeAffection(req, res)
  }
}
