const aws = require("ibm-cos-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const {getBucketContents} = require("../IBMFunctions")

//!! Very Sensitive Information & needs to be stored in .env
const config = {
    endpoint: process.env.CLOUD_ENDPOINT,
    apiKeyId: process.env.CLOUD_API_KEY,
    ibmAuthEndpoint: process.env.CLOUD_AUTH_END_POINT,
    serviceInstanceId: process.env.CLOUD_SERVICE_INSTANCE_ID,
    credentials: new aws.Credentials(process.env.CLOUD_SESSION_ID, process.env.CLOUD_SESSION_ID_SECRET, sessionToken = null),
    signatureVersion: 'v4',
    region: "eu-gb"
};
const s3 = new aws.S3(config);
const ProductImageBucket = "product-image";

exports.upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: ProductImageBucket,
    key: (req, file, cb) => {
      cb(null, file.originalname);
      console.log(file);
    },
  }),
});

exports.getProductImage =  (req, res) => {
  var imageUrlList = [];
  s3.listObjectsV2({ Bucket: ProductImageBucket }).promise().then(data=>{
      console.log("bucketContents: "+data)
    if (data) {
      var bucketContents = data.Contents;
      
      for (var i = 0; i < bucketContents.length; i++) {
        if (bucketContents[i].Key.search(/.jpeg/i) > -1) {
          var urlParams = {
            Bucket: ProductImageBucket,
            Key: bucketContents[i].Key,
          };

          s3.getSignedUrl("getObject", urlParams, function (err, url) {
            if(err)console.log("ERROR: "+ err.code+ "  "+ err.message+"\n",+"ERR_Body: "+err)
            imageUrlList[i] = url;
          });
        }
      }
    }
    res.json({
      imageUrls: imageUrlList,
    });
    console.log(imageUrlList)
  }
  )
  .catch(err=>console.log("ERROR: "+ err.code+ "  "+ err.message))
};