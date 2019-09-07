var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//USER SCHEMA
var UserSchema = new mongoose.Schema({
  username: String,
  name: String,
  password: String
});

UserSchema.plugin(passportLocalMongoose);

//CREATE USER MODEL AND EXPORT
module.exports = mongoose.model("User", UserSchema);
