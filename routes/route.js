const express = require('express')
const productHandlers = require("../handlers/products")
const authHandlers = require("../handlers/auth")
const router = express.Router()
const User = require("../models/User")
const passport = require("../passport/index")
const upload = require("../Multer/productImage")
const uploadUserImage = require("../Multer/userImage")


//!For testing EndPoint----------------------------------
router.get("/users", authHandlers.getUsers)

//% For User Info in profile page
router.get("/users/:userId", authHandlers.getUserInfo)
router.post("/users/", authHandlers.updateUserInfo)
router.post("/users/image", uploadUserImage.single("imgSrc"), authHandlers.updateUserImage)
//*Authentication Handling-----------------------------------------------------

router.post("/user/signup", authHandlers.isAvailableUsername, authHandlers.signupUser)

router.post("/user/login",
 passport.authenticate('local', {failureRedirect: "/", failureMessage: "Error username or password incorrect"}), authHandlers.getLoggedIn);

router.get("/user/logout", authHandlers.logOut)

router.get("/user/is-authorized", authHandlers.isAuthorized)
//*------------------------------------------------------------------

router.get("/product/all/", productHandlers.getProducts)

router.get("/products/:productId", productHandlers.getProductById)

router.get("/product-query?", productHandlers.searchProducts)

router.get("/user-products?", productHandlers.getProductByUserId)

router.post("/product", upload.single("productImg"), productHandlers.postProduct)

router.delete("/product-delete", productHandlers.deleteProduct)

//??? Uploading & Getting files to AWS + IBM CLOUD STORAGE
// router.get("/aws/product/image", AWS.getProductImage);
// router.post("/aws/product/image", AWS.upload.array('img-file', 1), (req, res, next)=>{
//     res.json(req.files[0]);
// })

//%Update Product

router.get("/product/:userId/:productId", productHandlers.getProductEdit)

router.patch("/product/update",  productHandlers.updateProductEdited)

router.patch("/product/update/image", upload.single("imgSrc"), productHandlers.updateProductEditedImage)



module.exports = router;