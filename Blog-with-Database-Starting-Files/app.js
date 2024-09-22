//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');


// db connection
const db = require('./db.js');
// Call the mongo function to connect to the database
db();
const addContentSchema = new mongoose.Schema({
  content: String
});

// Create a model
const addContent = mongoose.model('addContent', addContentSchema);

const homeStartingContent = " This is a home page";
const aboutContent = " This is a bout page";
const contactContent = " This is a contat page";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let posts = [];

app.get("/", function (req, res) {
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts,
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody,
  };

  posts.push(post);

  res.redirect("/");
});

app.get("/posts/:postName", function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function (post) {
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content,
      });
    }
  });
});

//addContent
app.get("/addContent", function (req, res) {
  res.render("addContent");
});

app.post("/addContent", function(req, res){
  const data = req.body.title;
  console.log(data);
  // monggose insertion
  async function createPost() {
    const newPost = new addContent({
     content: data
    });
  
    try {
      await newPost.save();
      console.log('Post saved!');
    } catch (err) {
      console.error('Error saving post:', err);
    }
  }
  
  createPost();
  res.redirect('/addContent');
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
