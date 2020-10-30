//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require('lodash');
const clipboardy = require('clipboardy');



mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const links = []

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/blogDB")

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const postSchema = {
  title: String,
  body: String,
  likes: Number
};

const Post = mongoose.model("post", postSchema);



app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    if(!err){
      res.render("home", {posts: posts});
    }
  });


});



app.get("/compose", function(req, res){
  res.render("compose");
});

app.get("/posts/:id", function(req, res){
  Post.findById(req.params.id, function(err, post){
        res.render("post", {title: post.title,
          content: post.body,
          likes: post.likes,
          id: post._id
          });
        }
      );
});
app.post("/", function(req, res){
  res.redirect("/");
});


app.post("/compose", function(req, res){
  const post= new Post({
    title: req.body.postTitle,
    body: req.body.postBody,
    likes: 0
  });
  console.log("posts/" + _.kebabCase(post.title))
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});


app.post("/copy/:id/:ps", function(req, res){

    clipboardy.writeSync("https://www." + req.hostname + "/posts/" + req.params.id);
    if(req.params.ps == 0){
      res.redirect("/#" + req.params.id);
    }
    else
    {
      res.redirect("/posts/" + req.params.id);
    }

});

app.post("/like/:id/:ps", function(req, res){


  Post.findById(req.params.id, function(err, res){
      Post.updateOne({_id:req.params.id}, {likes: res.likes + 1}, function(ERR, RES){});
    });
  if(req.params.ps == 0){
    res.redirect("/#" + req.params.id);
  }
  else
  {
    res.redirect("/posts/" + req.params.id);
  }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
