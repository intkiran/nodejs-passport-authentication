var express = require("express");
var router = express.Router();
var Blogpost = require("../models/blogpost");
var middleware = require("../middleware");
var config = require("../config.js");

//--------------------ROUTES--------------------
//INDEX ROUTE
router.get("/blogposts", function(req, res){
    var admin = config.admin;
    Blogpost.find({}, function(err, allBlogposts){
        if(err){
            console.log(err);
        }else{
            res.render("blogposts/index",{blogposts:allBlogposts, admin:admin});
        }
    });
});


//CREATE BLOGPOST ROUTE
router.post("/blogposts", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newBlogpost = {name:name, price:price, image:image, description:desc, author:author};
    Blogpost.create(newBlogpost, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogposts");
        }
    });
});

//NEW BLOGPOST ROUTE (displays form)
router.get("/blogposts/new", middleware.isLoggedIn, function(req, res){
    res.render("blogposts/new");
});

//SHOW BLOGPOST ROUTE
router.get("/blogposts/:id", function(req,res){
   Blogpost.findById(req.params.id).populate("comments").exec(function(err, foundBlogpost){
       if(err || !foundBlogpost){
            req.flash("error", "Blogpost not found.");
            res.redirect("back");
       }else{
           console.log(foundBlogpost);
           res.render("blogposts/show", {blogpost: foundBlogpost}); 
       }
   });
   
})

//EDIT BLOGPOST ROUTE
router.get("/blogposts/:id/edit", middleware.checkBlogpostOwnership, function(req, res){
    Blogpost.findById(req.params.id, function(err, foundBlogpost){
        if(err){
            res.redirect("/blogposts");
            
        }else{
            res.render("blogposts/edit", {blogpost: foundBlogpost});
            
        }
    });
});

//UPDATE BLOGPOST
router.put("/blogposts/:id", middleware.checkBlogpostOwnership, function(req, res){
    Blogpost.findByIdAndUpdate(req.params.id, req.body.blogpost, function(err, updatedBlogpost){
        if(err){
            res.redirect("/blogposts");
        }else{
            res.redirect("/blogposts/" + req.params.id);
        }
    });
});

//DESTROY BLOGPOST
router.delete("/blogposts/:id", middleware.checkBlogpostOwnership,  function(req, res){
    Blogpost.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogposts");
        }else{
            res.redirect("/blogposts");
        }
    }); 
});

module.exports = router;