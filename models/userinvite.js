var mongoose = require("mongoose");

//USER InviteSCHEMA
var UserInviteSchema = new mongoose.Schema({
  name: String,
  username: String,
  guid: String,
  created: { type: Date, default: Date.now },
  used: { type: Boolean, default: false }
});

//CREATE USER MODEL AND EXPORT
module.exports = mongoose.model("UserInvite", UserInviteSchema);
