const mongoose = require("mongoose")



let imgSchema = new mongoose.Schema({
    userId: String,
    username: String,
    title: String,
    imgSrc: String,
    imgId: String,
    description: String,
    details: String,
    review: {
        count: Number,
        provider: Array
    },
    date: {type: Date, default: Date.now()}
})

let Image = mongoose.model("ImageStorage", imgSchema)

module.exports = Image;