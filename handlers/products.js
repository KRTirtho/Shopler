const mongoose = require("mongoose");
const Image = require("../models/Image");
const fs = require("fs");

//*Product Handling---------------------------------------------------
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

exports.getProductByUserId = async (req, res) => {
  try {
    if (req.query.userId && req.isAuthenticated()) {
      const sort = req.query.sort;
      const availableProduct = await Image.find({
        userId: req.query.userId,
      })
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

exports.postProduct = (req, res) => {
  let newProduct = new Image({
    userId: req.body.userId,
    username: req.body.username,
    title: req.body.title,
    imgSrc: "/api/image/" + req.file.filename,
    details: req.body.details,
    description: req.body.description,
  });
  if (req.isAuthenticated())
    newProduct.save((err, data) => {
      if (err) res.status(500).json("Failed to save product");
      res.status(200).json("Uploading " + req.body.title + "is Successful!!");
    });
  else {
    return res.status(401).json({ Error: "Unauthorized. Access denied!" });
  }
};

exports.deleteProduct = (req, res) => {
  if (req.body && req.isAuthenticated()) {
    return Image.findOneAndDelete({ _id: req.body._id }).exec((err, data) => {
      if (err) res.status(501).json("Product can't be deleted");
      if (req.body.imgName && req.body.imgName.length > 0 && req.body.imgName!==undefined||null) {
        fs.unlink(
          "./FileStorage/productImage/" + req.body.imgName.split("/")[3],
          (err) => {
            if (err) res.status(500).json({ Error: "Failed to delete image!" });
            res.status(203).json(data + " is deleted!");
          }
        );
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

exports.getProductEdit = (req, res)=>{
  if(req.params.userId && req.params.productId && req.isAuthenticated()){
    return Image.findOne({ userId: req.params.userId, _id:req.params.productId}).exec((err, product)=>{
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

exports.updateProductEditedImage = (req, res)=>{
  if(req.body && req.isAuthenticated() && req.file && req.file.filename){
    
    return Image.findOneAndUpdate({_id: req.body._id, userId: req.body.userId}, {imgSrc: `/api/image/${req.file.filename}`}).exec((err, success)=>{
      
      if(err)res.status(500).json({Error: "Failed to update product details!"})
      
      else if(!success || success.length===0)res.status(404).json({Error: "Product not found!"})
      
      else{
        fs.unlink(
          "./FileStorage/productImage/" + req.body.prevImgSrc.split("/")[3],
          (err) => {
            if (err) res.status(500).json({ Error: "Failed to delete image!" });
            else{
              return res.status(200).json({Success: "Updated product image!"})
            }
          }
        );
      }

    })

  }

  else {
    res.status(400).json({Error: "Unauthorized or condition not fulfilled"})
  }
}
