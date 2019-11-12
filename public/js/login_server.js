//start server and render html page
const express = require('express')
var path = require("path");
var bodyParser = require('body-parser');
var mysql = require('mysql');

const app = express()

app.use(express.static(path.join(__dirname, '../../public')));
app.set('view engine', 'ejs')

app.get('/', function (request, response) {
  response.render('login_page', {response: ""})
})

app.listen(3000, function () {
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

app.post('/auth', function(request, response) {
	var username = request.body.username;
  var password = request.body.password;
  
  //sql query
  connection.query('SELECT userEmail, userPassword FROM user_login WHERE userEmail = ? AND userPassword = ?', [username, password], function(error, results) {
    if (results.length > 0) 
      response.send('Logged In!');
    else 
      response.render('login_page', {response: "Invalid Username/Password"});
  });
});
