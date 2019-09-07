//---------MIDDLEWARE----------
var Blogpost = require("../models/blogpost");
var Comment = require("../models/comment");
var config = require("../config.js");
var middlewareObj = {};

//BLOGPOST OWNERSHIP
middlewareObj.checkBlogpostOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "You do not have permission to do that.");
    res.redirect("/blogposts");
  }
};

//COMMENT OWNERSHIP
middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("back");
  }
};

//LOGIN CHECKER
middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that.");
  res.redirect("/login");
};

module.exports = middlewareObj;
