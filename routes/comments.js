var express = require("express");
var router = express.Router();
var Blogpost = require("../models/blogpost");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//NEW COMMENT ROUTE (form)
router.get("/blogposts/:id/comments/new", middleware.isLoggedIn, function(req, res){
   Blogpost.findById(req.params.id, function(err, blogpost){
       if(err){
           console.log(err);
       }else{
            res.render("comments/new", {blogpost: blogpost});
       }
   })
});

//CREATE COMMENT ROUTE
router.post("/blogposts/:id/comments", middleware.isLoggedIn, function(req, res){
   Blogpost.findById(req.params.id, function(err, blogpost){
       if(err){
           console.log(err);
           res.redirect("/blogposts");
       }else{
            Comment.create(req.body.comment, function(err,comment){
                if (err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    blogpost.comments.push(comment);
                    blogpost.save();
                    res.redirect('/blogposts/' + blogpost._id);
                }
            });
       }
   })    
});

//EDIT COMMENT
router.get("/blogposts/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Blogpost.findById(req.params.id, function(err, foundBlogpost){
        if(err || !foundBlogpost){
            req.flash("error", "No blogpost found.");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }else{
               res.render("comments/edit", {blogpost_id: req.params.id, comment: foundComment});
           } 
        });
    });
});

//UPDATE COMMENT
router.put("/blogposts/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/blogposts/" + req.params.id );
        }
    });
});

//DESTROY COMMENT
router.delete("/blogposts/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){
          res.redirect("back");
      }else{
         req.flash("success", "Comment deleted.");
         res.redirect("/blogposts/" + req.params.id);
      } 
   });
});


module.exports = router;