const Image = require("../models/Image");
const cloudinary = require("cloudinary").v2

//*Product Handling---------------------------------------------------
/**
 * @query page
 * @res <product>
  */
exports.getProducts = (req, res) => {
  const getAll = (page = 1) => {
    const PAGE_SIZE = 20;
    const skip = (page - 1) * PAGE_SIZE;
    Image.find()
      .skip(skip)
      .limit(PAGE_SIZE)
      .sort({ date: "desc" })
      .exec((err, data) => {
        if (err) throw err;
        res.status(200).json(data);
      });
  };
  return getAll(req.query.page);
};

/**
 * @params productId
 * @res <product> 
  */
exports.getProductById = (req, res) => {
  if (req.params.productId)
    Image.findById(req.params.productId).exec((err, data) => {
      if (err) throw err;
      res.status(300).json(data);
    });
  else {
    return res
      .status(400)
      .json({ Error: "Please provide the needed information first!" });
  }
};

/**
 * @query sort, userId
 * @res <product>
  */
exports.getProductByUserId = async (req, res) => {
  try {
    if (req.query.userId && req.isAuthenticated()) {
      const sort = req.query.sort;
      const availableProduct = await Image.find({
        userId: req.query.userId,
      }).select("-imgId")
        .sort(
          sort && sort === "a-z"
            ? { title: "asc" }
            : sort === "z-a"
            ? { title: "desc" }
            : sort === 1
            ? { date: 1 }
            : sort === -1
            ? { date: -1 }
            : { date: "desc" }
        )
        .exec((err, products) => {
          if (err) res.status(500).json({ Error: "Failed to find products" });
          else if (products.length === 0 || !products)
            res.status(404).json({
              Message:
                "Currently you didn't uploaded any product! Why not upload now.",
            });
          else if (products.length > 0) res.status(200).json(products);
        });
      return availableProduct;
    } else {
      res.status(401).json({ Error: "Please Login or SignUp first!" });
    }
  } catch {
    res.status(502).json({ Error: "Server is currently not wake!" });
  }
};

/**
 * @query product (title)
 * @res <product>
  */
//!Experimental Search Products---------------------------------------------------------
exports.searchProducts = async (req, res) => {
  if (req.query.product) {
    const availableProduct = await Image.find(
      { title: new RegExp(`^${req.query.product}?`, "gi") },
      (err, result) => {
        if (err)
          res.status(500).json({ Error: "Server failed to query products" });
        else if (result.length === 0 || !result) {
          return Image.find(
            { title: new RegExp(`${req.query.product}$`, "gi") },
            (err1, result1) => {
              if (err1)
                res
                  .status(500)
                  .json({ Error: "Server failed to query products" });
              else if (result1.length === 0 || !result1) {
                return Image.find(
                  { title: new RegExp(`${req.query.product}`, "gi") },
                  (err2, result2) => {
                    if (err2)
                      res
                        .status(500)
                        .json({ Error: "Server failed to query products" });
                    else if (result2.length === 0 || !result2)
                      res.status(404).json({ Message: "No product found!" });
                    else if (result2.length > 0)
                      res.status(200).json({ result: result2 });
                  }
                );
              } else if (result1.length > 0)
                res.status(200).json({ result: result1 });
            }
          );
        } else if (result.length > 0) res.status(200).json({ result: result });
      }
    );
  } else {
    res.status(400).json({ Error: "Please provide the product name!" });
  }
};
//!-------------------------------------------------------------------------------------

/**
 * @body multipart/form-data as imgSrc , { title, details, description}
 * @user {_id, username}
 * @res Flash
  */

exports.postProduct = (req, res) => {
  if (req.isAuthenticated()){
    let newProduct = new Image({
    userId: req.user._id, //?
    username: req.user.username, //?
    title: req.body.title,
    details: req.body.details,
    description: req.body.description,
    imgId: req.file.filename,
    imgSrc: req.file.path,
  });
   return newProduct.save((err, data) => {
      if (err) res.status(500).json("Failed to save product");
      res.status(200).json("Uploading " + req.body.title + "is Successful!!");
    });
  }
  else {
    return res.status(401).json({ Error: "Unauthorized. Access denied!" });
  }
};

/**
 * @body {_id (product), imgName}
 * @res Flash
  */
exports.deleteProduct = (req, res) => {
  if (req.body && req.isAuthenticated()) {
    return Image.findOneAndDelete({ _id: req.body._id }).exec((err, data) => {
      if (err) res.status(501).json("Product can't be deleted");
      if (req.body.imgName && req.body.imgName.length > 0 && req.body.imgName!==undefined||null) {
        // Deleting product image after deleting product
        cloudinary.uploader.destroy(data.imgId)
          .then(deletedImage=>{
            if(deletedImage.result==="not found")res.status(500).json({Error: "Failed to delete product Image"})
            return res.status(200).json({Success: "Product "+ data._id +" is delete"})
          })
          .catch(err=>{
            console.log("Product Delete Error: ", err)
            return res.status(500).json({Error: "Unknown error occurred"})
          })
      }
      else if(!req.body.imgName)res.status(400).json({Error: "No image id but product deleted"})
    });
  } else if (!req.body._id) {
    res.status(403).json("Please give the id");
  } else {
    res.status(401).json({ Error: "Unauthorized. Access denied!" });
  }
};
//*----------------------------------------------------------------------

/**
 * @params  {userId, productId}
 * @res product{"-_id, -imgId"}
  */
exports.getProductEdit = (req, res)=>{
  if(req.params.userId && req.params.productId && req.isAuthenticated()){
    return Image.findOne({ userId: req.params.userId, _id:req.params.productId}).select("-_id -imgId").exec((err, product)=>{
      if(err) res.status(500).json({Error: "Failed to find the product"});
      else if(!product || product.length===0)res.status(404).json({Error: "Failed to find any product with that id"});
      else{
        return res.status(200).json(product);
      }
    })
  }
  else {
    res.status(400).json({Error: "Unauthorized or conditions not fulfilled"});
  }
} 

/**
 * @body {_id (product), userId, title, details, description}
 * @res Flash
  */
exports.updateProductEdited = (req, res)=>{
  if(req.body && req.isAuthenticated()){
    
    return Image.findOneAndUpdate({_id: req.body._id, userId: req.body.userId}, 
      {
      title: req.body.title,
      details: req.body.details,
      description: req.body.description,
    },
     (err, success)=>{
      if(err)res.status(500).json({Error: "Failed to update product details!"})
      else if(!success || success.length===0)res.status(404).json({Error: "Product not found!"})
      else{
          return res.status(200).json({Success: "Updated product!"})
      }
    })
  }

  else {
    res.status(400).json({Error: "Unauthorized or condition not fulfilled"})
  }

}

/**
  * @body multipart/form-data as imgSrc
  * @res Flash
  * @file {path, filename (public_id)}
  * @user _id
  */

exports.updateProductEditedImage = (req, res)=>{
if(req.isAuthenticated()){
  //Getting the image name/public_id
Image.findOne({_id: req.body._id, userId: req.user._id}).exec()
    .then(product=>{
      if(!product || product.length===0)res.status(404).json({Error: "No product found"})
      //Deleting the product Image from 
      cloudinary.uploader.destroy(product.imgId)
      .then(({result})=>{
        console.log(result)
        if(result==="not found")res.status(404).json({Error: "Failed to delete product"})
        //now doing all the database stuff
        return Image.findOneAndUpdate({_id: product._id, userId: product.userId},
           {imgSrc: req.file.path, imgId: req.file.filename})
           .exec((err, success)=>{
          if(err){
            console.log("Product Image Update Error: ", err)
            return res.status(500).json({Error: "Failed to update product details!"})
          }
          else if(!success || success.length===0)res.status(404).json({Error: "Product not found!"})
          return res.status(200).json({Success: "Product Updated"})
        })
      })
    })
.catch(err=>{
  console.log("Product Image Update Error: ", err)
  return res.status(500).json({Error: "Unknown error occurred"})
})
}
  else {
    res.status(400).json({Error: "Unauthorized or condition not fulfilled"})
  }
}