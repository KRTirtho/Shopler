const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, "FileStorage/userImage")
  },
  filename: (req, file, cb)=>{
    const name = `$d${Date.now()}$mr${Math.floor(Math.random())}${file.originalname}`
    cb(null, name)
  }
})

const fileFilter = (req, file, cb)=>{
    if(file.mimetype==="image/jpeg" || file.mimetype === "image/png"){cb(null, true)}
    cb(new Error("Only Images allowed"), false)
}

const uploadUserImage = multer({storage, /* limits: {fileSize: 2097152}, */ })

module.exports = uploadUserImage