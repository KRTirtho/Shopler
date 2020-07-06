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
  if (req.isAuthenticated()) {
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
  } else {
    return res.status(401).json({ Error: "Unauthorized, forbidden" });
  }
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

  if (req.isAuthenticated()) {
    // First Checking if the product already available with findOne with cart productId
    return User.findOne({ "cart.productId": productId, _id: userId })
      .select("cart -_id")
      .exec()
      .then((user) => {
        if (!user)
          res
            .status(NOT_FOUND)
            .json({
              Error:
                "No product found available in the cart with the provided productId",
            });
        /* A for...of loops iterates through every value of a array like map filter reduce etc.. */
        for (const product of user.cart) {
          /* Mongoose ObjectId is stored as a object in the user.cart[x].productId, it needs to be 
        converted into a String first with the String constructor & then compare */
          if (String(product.productId) === productId) {
            // if quantity is 1 then delete it
            if (product.quantity === 1) {
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
            }

            // if the quantity is greater than one then just decrease the quantity
            else if (product.quantity > 1) {
              User.findOneAndUpdate(
                { "cart.productId": productId, _id: userId },
                { $inc: { "cart.$.quantity": -1 } },
                { new: true }
              )
                .select("cart -_id")
                .exec()
                .then((decreasedProduct) => {
                  if (!decreasedProduct)
                    res
                      .status(NOT_FOUND)
                      .json({
                        Error: "Failed to decrease product quantity from cart",
                      });
                  return res
                    .status(OK)
                    .json(decreasedProduct.cart);
                });
            }
            // Breaking the operation immediately if the certain condition matches
            break;
          }
        }
      });
  } else {
    return res.status(UNAUTHORIZED).json({ Error: "Unauthorized, forbidden" });
  }
};

exports.cartOperation = (req, res)=>{
  // query params
  const {add, remove} = req.query
  if(add==="true" && remove!=="true"){
    return addProduct(req, res);
  }
  else if(remove==="true" && add!=="true"){
    return removeProduct(req, res)
  }
  else if(add==="true" && remove==="true"){
    return res.status(CONFLICT).json({Error: "Can't perform two operation of a same thread at once"})
  }
  else {
    return res.status(NOT_ACCEPTABLE).json({Error: "Unknown query params or params not found "})
  }
}