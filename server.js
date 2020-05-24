const express = require("express");
const bodyParser = require("body-parser");
const Todo = require("./model.js");
const app = express();
const cors = require("cors")

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Initial page as response

app.get("/", (req, res) => {
  res.json("Todo Storage");
});

//handling Get Req of API 
app.get("/api", (req, res) => {
  let todo = req.query.todo
  let date = req.query.date
  Todo.find().sort(todo||date?req.query:{date: "desc"}).exec((err, data) => {
    if (err) throw err;
    res.json(data);
  })
});

//Handling Post Request for API
app.post("/api", (req, res)=>{
    if(req.body){
    let todoNew = new Todo({
        todo: req.body.todo,
        date: Date.now(),
    })
        todoNew.save()
        res.status(201).json('successful')
    }
    else{
        res.status(500).json('Failed')
    }
})

app.post("/api/completed", (req, res)=>{
  mongoose.useFindAndModify(false)
  if(req.body){
    Todo.findOneAndUpdate({todo: req.body.todo}, {completed: req.body.completed}).exec((err, data)=>{
      if(err) res.status(404).json(err)
      res.status(201).json({Updated: data.todo, Completed: data.completed})
    })
  }
  else{
    res.status(500).json("Failed")
  }
})

//Handling Delete Request for API
app.delete("/api/delete", (req, res)=>{
  Todo.findOneAndDelete({todo: req.body.todo}, (err, result)=>{
    if(err)throw err;
    res.json(`Deleted: ${result.todo}, _id:${result._id}`)
  })
})



  

app.listen(5000);
