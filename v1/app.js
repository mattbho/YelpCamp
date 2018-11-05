const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const port = process.env.PORT || 3000

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")

//SCHEMA SETUP
let campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
})

let Campground = mongoose.model("Campground", campgroundSchema)
/*
Campground.create(
  {name: "Mountain Goat's Rest",
   image: "https://www.yosemite.com/wp-content/uploads/2016/04/westlake-campground.png",
   description:"This is Mountain Goat's Rest. Boo Yah"
  },
  function(err, campground){
    if(err){
      console.log(err);
    } else{
      console.log("Newly created campground: ")
      console.log(campground)
    }
  }
);
*/

app.get("/", function(req, res){
  res.render("landing")
})

app.get("/campgrounds", function(req, res){
  //res.render("campgrounds", {campgrounds: campgrounds});
  //get all campgrounds
  Campground.find({}, function(err, allcampgrounds){
    if(err){
      console.log(err);
    }else{
      res.render("index", {campgrounds: allcampgrounds})
    }
  })
})


app.post("/campgrounds", function(req, res){
  let name = req.body.name
  let image = req.body.image
  let description = req.body.description
  let newCampground = {name: name, image: image, description: description}
  //Create new Campground and save to mongo
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else{
      res.redirect("/campgrounds")
    }
  })
})


app.get("/campgrounds/new", function(req,res){
  res.render("new")
})

app.get("/campgrounds/:id", function(req,res){
  Campground.findById(req.params.id,function(err,foundCampground){
    if(err){
      console.log(err);
    }else{
      res.render("show", {campground:foundCampground})
    }
  })
})

app.listen(port, process.env.IP, function(){
  console.log("App is listening")
})