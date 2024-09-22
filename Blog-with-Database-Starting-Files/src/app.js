// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
const serverless = require('serverless-http');
const router = express.Router();

// Database connection
const db = require('../db.js');
db();

// Mongoose schema and model
const addContentSchema = new mongoose.Schema({
  content: String
});
const addContent = mongoose.model('addContent', addContentSchema);

// Content constants
const homeStartingContent = "This is a home page";
const aboutContent = "This is an about page";
const contactContent = "This is a contact page..";

const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/.netlify/functions/app', router);

// Routes
router.get("/", function (req, res) {
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts,
  });
});

router.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

router.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

router.get("/compose", function (req, res) {
  res.render("compose");
});

router.post("/compose", function (req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody,
  };
  posts.push(post);
  res.redirect("/");
});

router.get("/posts/:postName", function (req, res) {
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

// Add content route
router.get("/addContent", function (req, res) {
  res.render("addContent");
});

router.post("/addContent", async function (req, res) {
  const data = req.body.title;
  console.log(data);

  const newPost = new addContent({
    content: data
  });

  try {
    await newPost.save();
    console.log('Post saved!');
  } catch (err) {
    console.error('Error saving post:', err);
  }

  res.redirect('/addContent');
});

// Serverless function handler
module.exports.handler = serverless(app);
