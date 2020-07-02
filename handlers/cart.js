const User = require("../models/User")

/**
 * @body {productId, userId}
 * @res {Flash}
  */

exports.addProduct = (req, res)=>{
    if(req.isAuthenticated()){
        User.findById(req.body.userId).select("cart").exec()
            .then(user=>{
                if(!user && user.length===0)res.status(404).json({Error: "No user Exists!"})
                user.cart.map(product=>{
                    //if user product already exist in the cart then we just increase the quantity
                    //!--------------------------------------------
                    if(product.productId===req.body.productId){
                        User.findByIdAndUpdate(req.body.userId, {$push: { //! Wrong, fully wrong
                            cart: [{productId: product.productId, count: product.count+1}]
                        }}).exec()                
                         .then(result=>{
                             if(!result && result.length===0)res.status(404).json({Error: "Unknown error occurred"})
                         })
                         .catch(err=>res.status(500).json({Error: "Unknown server error"}))
                    }//!---------------------------------------------
                    else if(product.productId!==req.body.productId){
                    }
                })
            })

        
        User.findByIdAndUpdate(req.body.userId, {$push: {
            //Pushes new sub document in an array
            cart: [{ productId: req.body.productId, quantity:  }],
          }})
    }

    else {
        return res.status(401).json({Error: "Unauthorized, forbidden"})
    }
}