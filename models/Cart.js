const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    userId: {type: mongoose.SchemaTypes.ObjectId, required: true},
    productId: {type: mongoose.SchemaTypes.ObjectId, required:true},
    quantity: {type: Number, required: true}
})

const Cart = mongoose.model("Cart", cartSchema)

module.exports = Cart;