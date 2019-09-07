var mongoose = require("mongoose");

//COMMENT SCHEMA
var commentSchema = mongoose.Schema({
    text: String,
    created: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});


//CREATE COMMENT MODEL AND EXPORT
module.exports = mongoose.model("Comment", commentSchema);