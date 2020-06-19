const mongoose = require("mongoose")



let imgSchema = new mongoose.Schema({
    userId: String,
    username: String,
    title: String,
    imgSrc: String,
    description: String,
    details: String,
    date: {type: Date, default: Date.now()}
})

let Image = mongoose.model("ImageStorage", imgSchema)

module.exports = Image;