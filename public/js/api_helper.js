const express = require('express')
var path = require("path");
var bodyParser = require('body-parser');
var mysql = require('mysql');
const alpha = require('alphavantage')({ key: 'Z3B2FO26F96IVKYH' });
var io = require('socket.io')

const app = express()

app.use(express.static(path.join(__dirname, '../../public')));
app.set('view engine', 'ejs')


//display home page
app.get('/', function (request, response) {
  response.render('home', {result: list})
})

server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


var listener = io.listen(server);

list = []
stocks = ['msft', 'amzn']

for(symbol of stocks){
  alpha.data.quote(symbol).then(data => {
    list.push(data)
  });
}

listener.on('connection', function (socket) { 
  socket.emit('initialize', list); // Emit on the opened socket.
});

alpha.data.search('microsoft').then(data => {
  console.log(data)
});

