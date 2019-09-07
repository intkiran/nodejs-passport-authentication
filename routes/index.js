var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var UserInvite = require("../models/userinvite");
const uuidGenerate = require("nodejs-simple-uuid");
var middleware = require("../middleware");

//Contact form
var nodemailer = require("nodemailer");
//API key storage
var config = require("../config.js");

//".router" is used isntead of "app." as our routes are now in a seperate file that links back to the "app.js" file

//ROOT ROUTE
router.get("/", function(req, res) {
  res.render("landing");
});

//ABOUT ROUTE
router.get("/about", function(req, res) {
  res.render("about");
});

//invitefriends ROUTE
router.get("/invitefriends", function(req, res) {
  res.render("invitefriends");
});

//--------------------REGISTER----------------------------------------
//REGISTER ROUTE (form)
router.get("/register", function(req, res) {
  res.render("register");
});
router.get("/register", function(req, res) {
  res.render("register");
});
router.get("/invite/:id", function(req, res) {
  console.log("Invite registration", req.params.id);
  UserInvite.findOne({ guid: req.params.id }, function(err, foundInvite) {
    if (err) {
      req.flash("error", "Invalid Invitation with URL");
      console.log("Not Found invite ", foundInvite);

      res.render("invalidinvite");
    } else {
      console.log("Found invite ", foundInvite);
      if (foundInvite) {
        res.render("invitereg", { userinvite: foundInvite });
      } else {
        req.flash("error", "Wrong code invitation ");
        console.log("Not Found invite ", foundInvite);
        res.render("invalidinvite");
      }
    }
  });
});

//REGISTER ROUTE (logic)
router.post("/register", function(req, res) {
  console.log("register ", req.body);
  var newUser = new User({ username: req.body.username, name: req.body.name });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("register");
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Welcome, " + user.username + ".");
      res.redirect("/blogposts");
    });
  });
});
//UPDATE BLOGPOST
router.put("/inviteregister", function(req, res) {
  console.log("register ", req.body);
  var newUser = new User({ username: req.body.username, name: req.body.name });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("register");
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Welcome, " + user.username + ".");
      res.redirect("/blogposts");
    });
  });
});
router.post("/inviteregister", function(req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("register");
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Welcome, " + user.username + ".");
      res.redirect("/blogposts");
    });
  });
});
//--------------------LOGIN----------------------------------------
//LOGIN ROUTE (form)
router.get("/login", function(req, res) {
  res.render("login");
});

//LOGIN ROUTE (form)
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/blogposts",
    successFlash: "Welcome, you have successfully logged in.",
    failureRedirect: "/login",
    failureFlash: "Invalid username or password."
  }),
  function(req, res) {
    //No action required for callback
  }
);

//LOGOUT ROUTE
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logout successful.");
  res.redirect("back");
});

//--------------------CONTACT PAGE----------------------------------------
//CONTACT ROUTE
router.get("/contact", function(req, res) {
  res.render("contact");
});

//CONTACT FORM
router.post("/send", function(req, res) {
  console.log("request body", req.body);
  /* req.flash("success", "Invitation Email is sent.");
  res.redirect("contact"); */
  var contactname = req.body.name,
    email = req.body.username,
    company = " COmpany",
    title = "Subject",
    message = "Hi " + contactname;
  var guid = uuidGenerate();

  // Content that is delivered to my email
  var output = `
            <p>${message}</p>
            <h4><u>Email Invite from App signup</u></h4>
            <p><b>Please click below link for signup<br>
            <b><a href="localhost:8080/invite/${guid}"> Signup</a>
            <b>Thanks By </b> App team
            </p>
        `;

  // Account connection and authorization
  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "a6f5abdcdc0a16",
      pass: "9906bf19138227"
    }
  });

  // Listens for new access tokens, if an access token expires it uses refreshToken to generate a new access token
  transporter.on("token", token => {
    console.log("A new access token was generated");
    console.log("User: %s", token.user);
    console.log("Access Token: %s", token.accessToken);
    console.log("Expires: %s", new Date(token.expires));
  });

  // Sending information
  let mailOptions = {
    from: `${contactname} <tokiranmobile@gmail.com>`, // sender address
    to: `${email}`, //list of receivers
    subject: "Invitation Email", //Subject line
    text: "No message entered.", //  text if nothing is filled out
    html: output // html body
  };
  console.log("request body", mailOptions);
  // Send mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      req.flash("error", "Message failed to send.");
      res.redirect("contact");
    } else {
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      var newUserInvite = {
        name: contactname,
        username: email,
        guid: guid
      };
      UserInvite.create(newUserInvite, function(err, newlyCreated) {
        if (err) {
          console.log(err);
        } else {
          console.log("user invite inserted successfully", newlyCreated);
        }
      });
      req.flash("success", "Invitation Email sent successfully!");
      res.redirect("invitefriends");
    }
  });
});

//--------------------EXPORT----------------------------------------
module.exports = router;
