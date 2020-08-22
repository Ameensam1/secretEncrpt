////////// STARTING CODE //////////////////////
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

//NEW MIDDLEWARE BELOW //////////////////////////
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

//Connecting to MongoDB and appending name of db to create "fruitsDB" to the url
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

// Using a full mongo Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// Defining secret key

// Using the secret to encrypt the database: only the password field, not the whole DB as we need access to be able to find other field
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);
//GET ROUTES BELOW

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/secrets", function(req, res){
  res.render("secrets");
});

//POST ROUTES BELOW
/* When a user goes to the register route and enter email and password
create a user by making a post request to the register route*/

app.post("/register", function(req, res){
  //create a user from the info passed as username(email) and password: @ the input element in register.ejs file
  /* Instance (an object/doc) of a class "userSchema" */
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  /* Save the document or log error if any*/
  newUser.save(function(err){
    if(err){
      console.log(err);
      /* If no error render the secrets route only when a user successfully register */
    } else {
      res.render("secrets");
    }
  });
});

// Let user login by entering their email/username & pw once they've registered
app.post("/login", function(req, res){
  /* Storing the values entered by the user in order to check it against the DB */
  const username = req.body.username;
  const password = req.body.password;
  /* Check if the email field in the DB = the username field entered by the user */
  User.findOne({email: username}, function(err, foundUser){
    // if err log it.
    if (err) {
      console.log(err);

    } else {
      // else if foundUser with matching email
      if (foundUser) {
        // Check again if the pw typed in matches the one in the DB
        if (foundUser.password === password) {
          // That means the user is registered. Hence, login to secrets
          console.log(foundUser);
          res.render("secrets")
        }
      }
    }
  });
});














//SERVER CONNECTION BELOW
app.listen(3000, function(){
  console.log("Server started on port 3000");
});
