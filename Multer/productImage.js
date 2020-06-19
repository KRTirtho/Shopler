const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, "FileStorage/productImage")
  },
  filename: (req, file, cb)=>{
    const name = `$d${Date.now()}$mr${Math.floor(Math.random())}${file.originalname.split(" ").join("-")}`
    cb(null, name)
  }
})

const fileFilter = (req, file, cb)=>{
    if(file.mimetype==="image/jpeg" || file.mimetype === "image/png"){cb(null, true)}
    cb(new Error("Only Images allowed"), false)
}

const upload = multer({storage, limits: {fileSize: 2097152}, })

module.exports = upload