const User = require("../models/User");
const Product = require("../models/Image")
const { Types } = require("mongoose");
const {
  NOT_FOUND,
  FAILED_DEPENDENCY,
  OK,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  CONFLICT,
  NOT_ACCEPTABLE,
  NO_CONTENT,
} = require("http-status-codes");

/**
 * @body null
 * @user {_id}
 * @res {productId, quantity}
 */
exports.getCartProduct = (req, res) => {
  if (req.isAuthenticated()) {
    //getting all the cart product Id
    return User.findById(req.user._id)
      .select("cart")
      .exec()
      .then((user) => {
        if (!user)res.status(NOT_FOUND).json({ Error: "Failed to get products" });
      // Now, have to send the products with those id
        const products = user.cart.map(d=>d.productId)
        // Getting those products
        // If product length is greater than 0
        if(user.cart.length>0){
        return Product.find({_id: {$in: products}}).select("-review -comment").exec()
          .then(product=>{
            if(!product)res.status(NOT_FOUND).json({Error: "Failed to query the products"})
            // now injecting quantity cart[x].quantity in product
            let storedProduct = [];
              for(const d of product){
              for(const x of user.cart){
                if(String(x.productId)===String(d._id)){
                  storedProduct.push({...d._doc, quantity: x.quantity})
                }
              }
            }
            return res.status(OK).json(storedProduct);
          })
          .catch(err=>{
            console.log("CART GET ERROR: ",err)
            return res.status(INTERNAL_SERVER_ERROR).json({ Error: "Unknown error occurred" });
          })
        }
        // If there is no product in the Database then just a no product response
        else if(user.cart.length===0){
          return res.status(NO_CONTENT).json({Message: "No product currently available in cart"})
        }

      })
      .catch((err) => {
        console.log("Cart GET Error: ", err);
        return res.status(INTERNAL_SERVER_ERROR).json({ Error: "Unknown error occurred" });
      });
  } else {
    return res.status(UNAUTHORIZED).json({ Error: "Unauthorized, forbidden" });
  }
};
/**
 * @body {productId}
 * @user _id
 * @res <User.cart>
 */

const addProduct = (req, res) => {
  //Request > Body destructuring
  const { productId } = req.body;
  const userId = req.user._id;
    // First Checking if the product already available with findOne with cart.productId
    User.findOne({ "cart.productId": productId })
      .select("cart -_id")
      .exec()
      .then((user) => {
        if (!user) {
          // If no user found with that cart.productId that means i have to add a new product
          return User.findByIdAndUpdate(
            userId,
            {
              $addToSet: {
                cart: { productId: Types.ObjectId(productId), quantity: 1 },
              },
            },
            { new: true }
          )
            .select("cart -_id")
            .exec()
            .then((user) => {
              if (!user)
                res
                  .status(NOT_FOUND)
                  .json({ Error: "Unable to add product into cart" });

                // now have to query the Products and pass them
                
              return res.status(OK).json(user.cart);
            })
            .catch((err) => {
              console.log("USER CART ERROR: ", err);
              return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ Error: "Unknown error occurred" });
            });
        }
        // If user does exists then increase the quantity
        return User.findOneAndUpdate(
          { "cart.productId": productId, _id: userId },
          { $inc: { "cart.$.quantity": 1 } }
        )
          .select("cart -_id")
          .exec()
          .then((updatedUser) => {
            if (!updatedUser)
              res
                .status(FAILED_DEPENDENCY)
                .json({ Error: "Failed to add product to cart" });
            return res
              .status(OK)
              .json(updatedUser.cart);
          })
          .catch((err) => {
            console.log("PRODUCT CART ERROR: ", err);
            return res
              .status(INTERNAL_SERVER_ERROR)
              .json({ Error: "Unknown Error occurred" });
          });
      })
      .catch((err) => {
        console.log("USER CART ERROR: ", err);
        return res
          .status(INTERNAL_SERVER_ERROR)
          .json({ Error: "Unknown error occurred" });
      });
};

/**
 * @body {productId}
 * @user {_id}
 * @res <User.cart>
 */
const removeProduct = (req, res) => {
  //Request > Body destructuring
  const { productId } = req.body;
  const userId = req.user._id;
    User.findOneAndUpdate(
      { "cart.productId": productId, _id: userId },
      { $pull: { cart: { productId: Types.ObjectId(productId) } } },
      { new: true }
    )
      .select("cart -_id")
      .exec()
      .then((deletedProduct) => {
        if (!deletedProduct)
          res
            .status(NOT_FOUND)
            .json({ Error: "Failed to delete product" });
        return res
          .status(OK)
          .json(deletedProduct.cart);
      })
      .catch((err) => {
        console.log("REMOVE FROM CART ERROR: ", err);
        return res
          .status(INTERNAL_SERVER_ERROR)
          .json({ Error: "Unknown error occurred" });
      });
};

const productQuantity = (req, res)=>{
  console.log(req.body.quantity)
  if(req.body.quantity>1){
    User.findOneAndUpdate({"cart.productId": req.body.productId ,_id: req.user._id},
     {$set: {"cart.$.quantity": req.body.quantity}}, {new: true}).exec()
     .then(product=>{
       if(!product)res.status(NOT_FOUND).json({Error: "Failed to find product"})
       res.status(OK).json(product.cart)
     })
     .catch(err=>{
       console.error("Product Quantity Error: ", err)
       return res.status(INTERNAL_SERVER_ERROR).json({Error: "Unknown error occurred"})
     })
  }
  else if(req.body.quantity<1){
    return res.status(NOT_ACCEPTABLE).json({Error: "Negative numbers for product quantity are not allowed"})
  }
  
}

const clearAll = (req, res)=>{
  const {_id} = req.user;
  User.findByIdAndUpdate(_id, {cart: []}, {new: true}).exec()
  .then(user=>{
    if(!user)res.status(NOT_FOUND).json({Error: "Failed to find user"})
    return res.status(OK).json(user.cart)
  })
  .catch(err=>{
    console.error("Cart Clear Error: ", err)
    return res.status(500).json({Error: "Unknown error occurred"})
  })
}

exports.cartOperation = (req, res)=>{
  // query params
  const {add, remove, quantity, clear} = req.query
  if(req.isAuthenticated()){
    if(Object.keys(req.query).length>1){
      return res.status(CONFLICT).json({Error: `Can't perform ${Object.keys(req.query).length} operation of a same request at a same time`})
    }
    else if(add==="true"){
      return addProduct(req, res);
    }
    else if(remove==="true"){
      return removeProduct(req, res)
    }
    else if(quantity==="true" ){
      return productQuantity(req, res);
    }
    else if(clear==="true"){
      return clearAll(req, res)
    }
    else {
      return res.status(NOT_ACCEPTABLE).json({Error: "Unknown query params or params not found "})
    }
  }

  else {
    return res.status(UNAUTHORIZED).json({Error: "Unauthorized, forbidden"})
  }
}