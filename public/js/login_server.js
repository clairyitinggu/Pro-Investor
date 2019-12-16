//start server and render html page
const express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mysql = require("mysql");
const alpha = require("alphavantage")({ key: "M9XXXH6V2NGIA32C" });
var io = require("socket.io");
const fetch = require("node-fetch"); //npm i node-fetch --save
const app = express();

const myAPI = require("./api");
const myDB = require("./db_functions");
const nodemailer = require("nodemailer");
var vernum = "";
var stime = 0;

app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "ejs");

//display login page
app.get("/", function(request, response) {
  response.render("main_page", { response: "", account_created: "" });
});

server = app.listen(3000, function() {
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
  var listener = io.listen(server);
  //query check username and password match database record
  connection.query(
    'SELECT userEmail, userPassword FROM user_login WHERE userEmail = "' +
      username +
      '" AND userPassword = SHA1("' +
      password +
      '")',
    function(error, results) {
      if (results.length > 0) {
        // matched
        connection.query(
          'select InvestmentName from userInvestment where userEmail = "' +
            username +
            '"',
          function(error, result) {
            if (error) throw error;
            if (result.length > 0) {
              var resultArray = Object.values(
                JSON.parse(JSON.stringify(result))
              );
              list = [];
              stocks = [];
              resultArray.forEach(function(v) {
                console.log(v);
              });
              for (itr in resultArray) {
                stocks.push(resultArray[itr].InvestmentName);
              }
              console.log("user has investment, " + stocks);
              myAPI.getApiData(list, stocks).then(data => {
                console.log(data);
                response.render("home", { response: username });
                listener.on("connection", function(socket) {
                  socket.emit("initialize", list); // Emit on the opened socket.
                });
              });
            } else {
              response.render("home", { response: username });
              listener.on("connection", function(socket) {
                socket.emit("initialize", []); // Emit on the opened socket.
              });
            }
            listener.on("connection", function(socket) {
              socket.on("message", function(msg) {
                console.log("server got meesage:" + msg);
                if (msg.startsWith("delete")) {
                  //got delete query
                  connection.query(msg, function(error, result) {
                    console.log("data deleted from db");
                  });
                }
                if (msg.startsWith("select")) {
                  //got select message
                  connection.query(msg, function(error, result) {
                    if (result != null && result.length == 0) {
                      var foo = "InvestmentName = ";
                      var stockToBeAdded = msg.slice(
                        msg.indexOf(foo) + foo.length
                      );
                      var insertQuery =
                        'insert into userInvestment (userEmail,InvestmentName,InvestmentHolding,InvestmentTime) values ("' +
                        username +
                        '",UPPER(' +
                        stockToBeAdded +
                        "),0,now());";
                      console.log(insertQuery);
                      connection.query(insertQuery, function(error, result) {
                        if (error == null) {
                          console.log("stock added to db");
                          socket.send("added");
                        }
                      });
                    } else {
                      console.log("stock already exist in db");
                    }
                  });
                }
                if (msg.startsWith("insert")) {
                  //got select message
                  connection.query(msg, function(error, result) {
                    if (error != null) console.log("stock added to db");
                  });
                }
              });
            });
          }
        );
      } else {
        response.render("login_page", {
          response: "Invalid Username/Password",
          account_created: ""
        });
      }
    }
  );
});

//display login page
app.get("/display_login", (request, response) => {
  response.render("login_page");
});

//display sign up page
app.get("/display_main_page", (request, response) => {
  response.render("main_page", { response: "", account_created: "" });
});

app.post("/signup", function(request, response) {
  var email = request.body.email;
  var vcode = request.body.code;
  var password = request.body.password;
  var confirm_password = request.body.confirm_password;
  if (password != confirm_password) {
    response.render("main_page", {
      response: "password and confirm password does not match up!"
    });
  } else if (vcode != vernum || Date.now() - stime > 600000) {
    response.render("main_page", {
      response: "There is something wrong with your vcode!"
    });
  } else {
    //sql queries
    var unique_email = "SELECT userEmail FROM user_login WHERE userEmail = ?";

    connection.query(unique_email, [email], function(error, results) {
      if (results.length > 0)
        response.render("main_page", { response: "Account already existed!" });
      else
        connection.query(
          'INSERT INTO user_login (userEmail, userPassword, created_at) VALUES ("' +
            email +
            '", SHA1("' +
            password +
            '"), NOW())'
        );
      response.render("login_page", { response: "" });
    });
  }
});

const config = {
  host: "smtp.163.com",
  port: 465,
  auth: {
    user: "xan1ku@163.com",
    pass: "zzz123"
  }
};

const transporter = nodemailer.createTransport(config);

app.post("/svcode", function(request, response) {
  var email = request.body.email;
  var user_name = request.body.user_name;
  var code = number();

  var unique_email = "SELECT userEmail FROM user_login WHERE userEmail = ?";

  var maillist = ["xan1ku@163.com", email];

  var mail = {
    from: "<xan1ku@163.com>",
    subject: "Your Vcode",
    to: maillist,
    text: "Please use this " + code + " as your vcode"
  };

  vernum = code;
  stime = Date.now();

  transporter.sendMail(mail, function(error, info) {
    if (error) {
      response.render("main_page", { response: error });
    } else {
      response.render("main_page", { response: "Mail sent" });
    }
  });
});

function number() {
  var number = "540";
  // for (var i = 0; i < 3; ++i) {
  //   number += Math.floor(Math.random() * 10);
  // }
  return number;
}
