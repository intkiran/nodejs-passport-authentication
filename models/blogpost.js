var mongoose = require("mongoose");

//BLOGPOST SCHEMA
var blogpostSchema = new mongoose.Schema({
   name: String,
   price: String,
   image: String,
   description: String,
   created: {type: Date, default: Date.now},
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"Comment"
      }
   ]
});

module.exports = mongoose.model("Blogpost", blogpostSchema);