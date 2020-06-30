const Product = require("../models/Image");
const User = require("../models/User");

/**
 * @body productId: MongoObjectId, providerId: MongoObjectId   
 * @res {Flash} no data
 * @warning `Here I'm using a old way of CRUD architecture where I first download all the available 
   data from MongoDB Atlas then check if the user already affectionate or not. This could be 
   heavily prevent if there is alternative way! But as I don't know how to use previously saved data in MongoDB I'm using this technic for a server check. In future, this issue will get fixed. Be aware, this is cautious!`
 */
exports.addAffection = (req, res) => {
  //Security Check
  if (req.isAuthenticated()) {
    Product.findById(req.body.productId)
      .exec()
      .then((product) => {
        let count;
        //Checking if product Review is available or not?
        if (
          product.review &&
          product.review.provider &&
          product.review.provider.length > 0
        ) {
          return product.review.provider.map((p) => {
            //If provider already exists then we just by-pass the whole
            if (p !== req.body.providerId) {
              count =
                product.review.count !== 0 && product.review.count
                  ? product.review.count + 1
                  : 1;
              return {
                provider: [...product.review.provider, req.body.providerId],
                count,
              };
            } else if (p === req.body.providerId) {
              return res
                .status(305)
                .json({
                  Message: "User is already affectionate to the seller",
                });
            }
          });
        }
        return { provider: [req.body.providerId], count: 1 };
      })
      .then((value) => {
        //If provider is already not affectionate to the seller then I set affectionate for providers
        if (value.provider && value.count) {
          Product.findOneAndUpdate(
            { _id: req.body.productId },
            { review: { count: value.count, provider: value.provider } }
          )
            .exec()
            .then((result) => {
              if (!result || result.length === 0)
                res.status(500).json({ Error: "Failed to save" });

              //Updating & saving product data to user lifecycle history
              User.findByIdAndUpdate(req.body.providerId, {
                $push: {
                  //Pushes new sub document in an array
                  reviewed: [{ productId: req.body.productId }],
                },
              })
                .exec()
                .then((user) => {
                  if (!user && !user.length)
                    res
                      .status(500)
                      .json({ Error: "Failed to save review to provider" });
                  return res.status(200).json({ Success: "Saved new review" });
                })
                .catch((err) => {
                  console.error("Review Error: " + err);
                  return res
                    .status(500)
                    .json({ Error: "Failed to save new review" });
                }); //End of User Update
            })
            .catch((err) => {
              console.error("Review Error: " + err);
              return res
                .status(500)
                .json({ Error: "Failed to save new review" });
            });
        }
      })
      .catch((err) => {
        console.log("Review Error: " + err.message);
        return res
          .status(500)
          .json({
            Error: "Unknown error occurred, failed to save the review ",
          });
      });
  }
  //For unauthorized
  else {
    return res.status(401).json({ Error: "Unauthorized, forbidden" });
  }
};

/**
   * @body {productId, providerId (actually removerId)}
   * @res {Flash}
   * @warning `Here I'm using a old way of CRUD architecture where I first download all the available 
   data from MongoDB Atlas then check if the user already affectionate or not. This could be 
   heavily prevented if there is a alternative way! But as I don't know how to use previously saved data in MongoDB I'm using this technic for a server check. In future, this issue will get fixed. Be aware, this is cautious!`
   */

exports.removeAffection = (req, res) => {
  //Req.body
  const { productId, providerId } = req.body;

  if (req.isAuthenticated()) {
    //Checking if product available or not
    Product.findById(productId)
      .exec()
      .then((product) => {
        if (!product || product.length === 0) {
          return res
            .status(500)
            .json({ Error: "No product available with the provided id" });
        }

        Product.findOne({$text: {
          $search: ""
        }})
      })
      .catch((err) => {
        return res
          .status(500)
          .json({
            Error: "Unknown error occurred, failed to save the review ",
          });
      });
  } else {
    return res.status(401).json({ Error: "Unauthorized, forbidden" });
  }
};

