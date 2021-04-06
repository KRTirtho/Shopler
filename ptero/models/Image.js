const mongoose = require("mongoose")


let imgSchema = new mongoose.Schema({
    userId: String,
    username: String,
    title: String,
    imgSrc: String,
    imgId: String,
    description: String,
    details: String,
    review: [
        {provider: mongoose.SchemaTypes.ObjectId, _id: false}
    ],
    date: {type: Date, default: Date.now()}
})

let Image = mongoose.model("ImageStorage", imgSchema)

module.exports = Image;