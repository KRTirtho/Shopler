const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/Todo",  { useNewUrlParser: true, useUnifiedTopology: true })

let todoSchema = new mongoose.Schema({
    todo: String,
    date: Number,
    completed: Boolean,
})

let Todo = mongoose.model("Todo", todoSchema)

module.exports = Todo