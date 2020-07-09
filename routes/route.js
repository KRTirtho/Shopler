const express = require('express')
const productHandlers = require("../handlers/products")
const authHandlers = require("../handlers/auth")
const router = express.Router()
const passport = require("../passport/index")
const upload = require("../Multer/productImage")
const uploadUserImage = require("../Multer/userImage")
const reviewHandler = require("../handlers/review")
const cartHandler = require("../handlers/cart") 
const { NODE_ENV } = require("../config")

//!For testing EndPoint----------------------------------
if(NODE_ENV==="development"){
    router.get("/users", authHandlers.getUsers)
    }

//% For User Info in profile page
router.get("/users/:userId", authHandlers.getUserInfo)
router.post("/users/", authHandlers.updateUserInfo)
router.post("/users/image", authHandlers.checkImageAvailable, uploadUserImage.single("imgSrc"), authHandlers.updateUserImage)
//*Authentication Handling-----------------------------------------------------

router.post("/user/signup", authHandlers.isAvailableUsername, authHandlers.signupUser)

//%Github OAuth Authentication

router.get("/auth/github/", passport.authenticate('github')) 
router.get("/auth/github/callback/", passport.authenticate("github", {failureRedirect: "/login", failureMessage: "Error getting signed with OAuth Github", successRedirect: "/"}))
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

//%Update Edit Product
router.get("/product/:userId/:productId", productHandlers.getProductEdit)

router.patch("/product/update",  productHandlers.updateProductEdited)

router.patch("/product/update/image", upload.single("imgSrc"), productHandlers.updateProductEditedImage)

//% Product Review 
router.get("/product/review", reviewHandler.getReviewedProducts)
router.post("/product/review?", reviewHandler.affection)

//% Cart 
router.get("/user/cart", cartHandler.getCartProduct)
router.patch("/user/cart?", cartHandler.cartOperation)

//% Cloudinary image upload test 
router.post("/cloudinary/test",  uploadUserImage.single("img"),authHandlers.testImageUpload)

module.exports = router;