const Cart = require("../models/Cart");

/**
 * @body null
 * @user _id
 * @res {productId, quantity}
  */
exports.getCartProduct = (req, res)=>{
    if(req.isAuthenticated()){
        //getting all the cart product Id
        return Cart.find({userId: req.user._id}).select("productId quantity -_id").exec()
        .then(product=>{
            if(!product || product.length===0)res.status(500).json({"Error": "Failed to get products"})
            return res.status(200).json(product)
        })
        .catch(err=>{
            console.log("Cart Error: ", err)
            return res.status(500).json({Error: "Unknown error occurred"})
        })
    }
    else {
        return res.status(401).json({Error: "Unauthorized, forbidden"})
    }
}
/**
 * @body {productId, userId}
 * @user _id
 * @res {Flash}
  */
 
 exports.addProduct = (req, res)=>{
     //Request > Body destructuring
     const {productId} = req.body;
     const userId = req.user._id
     
     if(req.isAuthenticated()){
        //First Checking whether the product is already in or not available
        return Cart.findOne({productId: productId, userId: userId}).exec()
            .then(product=>{
                //if product already available then I update the quantity only
                if(product){
                    //updating 
                    return Cart.findByIdAndUpdate(product._id, {quantity: product.quantity+1}).exec()
                    .then(updatedProduct=>{
                        if(!updatedProduct && updatedProduct.length===0)res.status(500).json({"Error": "Failed to add product"})
                        return res.status(200).json({Success: "Product added to cart"})
                        })
                        .catch(err=>{
                            console.log("Cart error: ", err)
                            return res.status(500).json({Error: "Unknown error occurred"})
                        })
                    }
                //if no product exist with that id then we just add the new item to cart, simple 😏
                else if(!product || product.length===0){
                    const newProduct = new Cart({
                        productId: productId,
                        userId: userId,
                        quantity: 1
                    })
                    //Adding to the cart
                    return newProduct.save()
                    .then(savedProduct=>{
                        if(!savedProduct || savedProduct.length===0)res.status(500).json({Error: "failed to add item to cart"})
                        return res.status(200).json({Success: "Added product to Cart"})
                    })
                    .catch(err=>{
                        console.log("Cart error: ", err)
                        return res.status(500).json({Error: "Unknown error occurred"})
                    })
                }
                })
                
                
            }
            else {
                return res.status(401).json({Error: "Unauthorized, forbidden"})
            }
        }
        
/**
 * @body {productId}
 * @user _id
 * @res {Flash}
     */
exports.removeProduct = (req, res)=>{
    //Request > Body destructuring
    const {productId} = req.body;
    const userId = req.user._id
    
    if(req.isAuthenticated()){
        //First Checking whether the product is already in or not available
        return Cart.findOne({productId: productId, userId: userId}).exec()
            .then(product=>{
                //if product already available then I decrease the quantity only
                if(product && product.quantity>1){
                    //updating 
                    return Cart.findByIdAndUpdate(product._id, {quantity: product.quantity-1}).exec()
                        .then(decreasedProduct=>{
                            if(!decreasedProduct && decreasedProduct.length===0)res.status(500).json({"Error": "Failed to decrease quantity product"})
                            return res.status(200).json({Success: "Product quantity lessened in cart"})
                        })
                        .catch(err=>{
                            console.log("Cart error: ", err)
                            return res.status(500).json({Error: "Unknown error occurred"})
                        })
                    }
                //if no product exist with that id then we just add the new item to cart, simple 😏
                else if(product && product.length===1){
                    //Adding to the cart
                return Cart.findByIdAndDelete(product._id).exec()
                    .then(deletedProduct=>{
                        if(!deletedProduct || deletedProduct.length===0)res.status(500).json({Error: "failed to delete item to cart"})
                        return res.status(200).json({Success: "Deleted product to Cart"})
                    })
                    .catch(err=>{
                        console.log("Cart error: ", err)
                        return res.status(500).json({Error: "Unknown error occurred"})
                    })
                }
                })
                
        
    }
    else {
        return res.status(401).json({Error: "Unauthorized, forbidden"})
    }
}