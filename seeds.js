var mongoose = require("mongoose");
var Blogpost = require("./models/blogpost");
var Comment = require("./models/comment");

var data = [
    {
        name: "Clouds Rest", 
        image: "http://www.photosforclass.com/download/3694766056",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Desert", 
        image: "http://www.photosforclass.com/download/769733695",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."    
    },
    {
        name: "Moutain", 
        image: "http://www.photosforclass.com/download/3694766056",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
];

function seedDB(){
    Blogpost.remove({}, function(err){
        if(err){
            console.log(err);
        }
            console.log("removed blogposts!"); 
            data.forEach(function(seed){
            Blogpost.create(seed, function(err,blogpost){
                if(err){
                    console.log(err);
                }else{
                    console.log("Added a blogpost");
                    Comment.create(
                        {
                            text: "This is great, but i want internet",
                            author: "Homer"
                        }, function(err,comment){
                            if(err){
                                console.log(err);
                            }else{
                                blogpost.comments.push(comment);
                                blogpost.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    

}

module.exports = seedDB;