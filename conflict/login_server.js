//start server and render html page
const express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mysql = require("mysql");

const app = express();

app.use(express.static(path.join(__dirname, "../../public")));
app.set("view engine", "ejs");

//display login page
app.get("/", function(request, response) {
  response.render("main_page", { response: "", account_created: "" });
});

app.listen(3005, function() {
  console.log("Example app listening on port 3000!");
});

//connect to MySQL database
var connection = mysql.createConnection({
  host: "remotemysql.com",
  port: 3306,
  user: "YCE0z3FJKI",
  password: "jRjm6gxi0B",
  database: "YCE0z3FJKI"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//handle login details sent through form (when user clicks submit)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/login", function(request, response) {
  var username = request.body.username;
  var password = request.body.password;

  //sql query
  connection.query(
    "SELECT userEmail, userPassword FROM user_login WHERE userEmail = ? AND userPassword = ?",
    [username, password],
    function(error, results) {
      if (results.length > 0) response.send("Logged In!");
      else
        response.render("login_page", {
          response: "Invalid Username/Password",
          account_created: ""
        });
    }
  );
});

//display login page
app.get("/display_login", (request, response) => {
  response.render("login_page");
});

//display sign up page
app.get("/display_main_page", (request, response) => {
  response.render("main_page", { unique_email: "" });
});

app.post("/main_page", function(request, response) {
  var email = request.body.email;
  var password = request.body.password;
  var confirm_password = request.body.confirm_password;

  //sql queries
  var unique_email = "SELECT userEmail FROM user_login WHERE userEmail = ?";

  connection.query(unique_email, [email], function(error, results) {
    if (results.length > 0)
      response.render("signup", {
        unique_email: "Account already exists with this email"
      });
    else
      connection.query(
        'INSERT INTO user_login (userEmail, userPassword) VALUES ("' +
          email +
          '", "' +
          password +
          '")'
      );
    response.render("login_page", {
      response: "",
      account_created: "New Account Created! You May Now Sign In"
    });
  });
});