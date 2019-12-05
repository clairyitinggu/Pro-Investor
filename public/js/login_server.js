//start server and render html page
const express = require('express')
var path = require("path");
var bodyParser = require('body-parser');
var mysql = require('mysql');
const alpha = require('alphavantage')({ key: 'M9XXXH6V2NGIA32C' });
var io = require('socket.io')
const fetch = require("node-fetch"); //npm i node-fetch --save
const app = express()

app.use(express.static(path.join(__dirname, '../../public')));
app.set('view engine', 'ejs')

//display login page
app.get('/', function (request, response) {
  response.render('main_page', {response: "", account_created: ""})
})

server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


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
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.post('/login', function(request, response) {
  var username = request.body.username;
  var password = request.body.password;
  
  //sql query
  connection.query('SELECT userEmail, userPassword FROM user_login WHERE userEmail = "' + username + '" AND userPassword = SHA1("' + password + '")', function (error, results) {
  if (results.length > 0) {
      list = []
      stocks = ['msft', 'amzn']

      getApiData(list, stocks).then(data => {
          console.log(data);
          var listener = io.listen(server);
          response.render("home");
          listener.on('connection', function (socket) {
              socket.emit('initialize', list); // Emit on the opened socket.
          });
      });
   }
   else 
      response.render('login_page', {response: "Invalid Username/Password", account_created: ""});
  });
});

//display login page
app.get('/display_login', (request, response) => {
  response.render('login_page');
 });

//display sign up page
app.get("/display_main_page", (request, response) => {
  response.render("main_page", { unique_email: "" });
});

app.post("/signup", function(request, response) {
  var email = request.body.email;
  var password = request.body.password;
  var confirm_password = request.body.confirm_password;
    if (password != confirm_password) {
        response.render('main_page', { response: "password and confirm password does not match up!" });
    } else {

        //sql queries
        var unique_email = 'SELECT userEmail FROM user_login WHERE userEmail = ?'

        connection.query(unique_email, [email], function (error, results) {
            if (results.length > 0)
                response.render('main_page', { response: "Account already existed!"});
            else
                connection.query('INSERT INTO user_login (userEmail, userPassword, created_at) VALUES ("' + email + '", SHA1("' + password + '"), NOW())');
            response.render('login_page', { response: ""});
        });
    }
});

async function getApiData(list, symbols) {
    const otherPram = {
        headers: {
            "content-type": "application/json; charset=UTF-8"
        },
        method: "GET"
    };
    for (itr of symbols) {
        url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey=" + alpha.key+"&symbol=" + itr;
        response = await fetch(url, otherPram);
        data = await response.json();
        await list.push(data);
        console.log("inside forloop");
    }
    console.log("list returned");
    return list;
}