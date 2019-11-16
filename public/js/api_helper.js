const express = require('express')
var path = require("path");
var bodyParser = require('body-parser');
var mysql = require('mysql');

const app = express()

app.use(express.static(path.join(__dirname, '../../public')));
app.set('view engine', 'ejs')


list = ['one', 'two', 'three']

//display login page
app.get('/', function (request, response) {
  response.render('api_helper', {result: list})
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})