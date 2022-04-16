const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const date = require("./data");
const mongoose = require("mongoose");
const _ = require("lodash");

mongoose.connect("mongodb+srv://Todolist:Todolist123@todolistapp.7xgc9.mongodb.net/todolistDb", (err) => {
  console.log("Server is connected"+err);
});
// var items =["BUY FOOD","BUY DRINK","EAT FOOD"];
// var WorkItems=[];

const itemSchema = new mongoose.Schema({
  item: {
    type: String,
  },
});





const items = mongoose.model("item", itemSchema);

const item1 = new items({item:"Welcome"})

const item2 = new items({item:"Here is our todoListApp"});

const defaultItem = [item1,item2];


const listSchema = new mongoose.Schema({
  item: String,
  items: [itemSchema]
})
const list = mongoose.model("list", listSchema);

var Today = date.date();
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({
  extended: true
}));

app.get("/", function (req, res) {
  items.find({}, (err, foundItems) => {
    if (err) {
      console.log(err);
    } else {
      res.render("list", {
        TITLE: "Main",
        DateOfToday: Today,
        ListItem: foundItems,
      });
    }
  });


});


app.use(express.static("public"));


app.post("/", (req, res) => {

  const item = new items({
    item: req.body.Activity,
  });
   if(req.body.button === "Main"){
    item.save();
    res.redirect("/");
   }else{
    list.findOne({item: req.body.button},function(err,listItem){
      listItem.items.push(item);
      listItem.save()
      res.redirect("/"+req.body.button);
    });
  }
});


app.get('/:Work', (req, res) => {
  const para = _.capitalize(req.params.Work);
    list.findOne({item:para},(err,result)=>{
        if(!err){
            if(!result){
              const lists = new list({
                item: para,
                items:defaultItem
            })
            lists.save();
            res.redirect("/"+para);
            }
        else{
          console.log(result.items[0].item);
          res.render("list",{
            TITLE: result.item,
            DateOfToday: Today,
            ListItem: result.items,
          })
        }
      }
  })


});

app.post("/delete", (req, res) => {
  const id = req.body.check;
  const ListName = req.body.listName;
  console.log(ListName);
  if(ListName === "Main"){
  items.deleteOne({
    _id: id
  }, () => {
    console.log("Item is get deleted");
  })
  res.redirect('/');
}
  else{
    list.findOneAndUpdate({item: ListName},{
      $pull : {items:{_id:id} }
    },(err,listIt)=>{
      if(!err){
      console.log("Item is get deleted by list");
      res.redirect("/"+ListName);
      }
    })
  }
})


app.listen(3000, () => {
  console.log("Server is started on 3000");
});