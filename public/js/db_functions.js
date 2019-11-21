const express = require('express')
var path = require("path");
var bodyParser = require('body-parser');
var mysql = require('mysql');
var connection;
function connectTODB() {
    connection = mysql.createConnection({
        host: "remotemysql.com",
        port: 3306,
        user: "YCE0z3FJKI",
        password: "jRjm6gxi0B",
        database: "YCE0z3FJKI"
    });

    connection.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
    });
}
function getInvestmentTime(userName, investmentName) { // returns the time for user to purchase the investment
    var query = 'select investmentTime from userInvestment where userEmail = "' + userName + '" and InvestmentName = "' + investmentName + '"';
    connection.query(query, function (error, results) {
        if (error != null)
            return results;
        else
            console.log("failed to get user investment time data from the database");
    });
}
function getInvestmentPeriod(userName, investmentName) { // returns the number of days that user holds the investment

}
function getUserHolding(userName, investmentName) { // returns a double 
    var query = 'select userHolding from userInvestment where userEmail = "' + userName + '" and InvestmentName = "' + investmentName + '"';
    connection.query(query, function (error, results) {
        if (error != null)
            return results;
        else
            console.log("failed to get user investment holding data from the database");
    });
}
function getUserInvestment(userName) { // returns list of user Investment
    var query = 'select InvestmentName from userInvestment where userEmail = "' + userName + '"';
    connection.query(query, function (error, results) {
        if (error != null)
            return results;
        else
            console.log("failed to get user investment data from the database");
    });
}
function add(userName, stockName, holding, investmentTime) { //string, string, double, string
    var query = '';
    if (investmentTime == null)
        query = 'insert into userInvestment values("' + userName + '","' + stockName + '","' + holding + '",now())';
    else
        query = 'insert into userInvestment values("' + userName + '","' + stockName + '","' + holding + '","' + investmentTime + '")';
    connection.query(query, function (error, results) {
        if (error != null)
            console.log("failed to insert " + stockName + " to " + userName);
        else
            console.log("successfully insert " + stockName + " to " + userName)
    });
}
function remove(userName, stockName) { //string, string
    var query = 'delete from userInvestment where userEmail = "' + userName + '" and InvestmentName = "' + stockName + '"';
    connection.query(query, function (error, results) {
    });
    query = 'select from userInvestment where userEmail = "' + userName + '" and InvestmentName = "' + stockName + '"';
    connection.query(query, function (error, results) {
        if (results > 0)
            console.log("failed to remove " + stockName + " from " + userName);
        else
            console.log("successfully removed " + stockName + " from " + userName)
    });
}
connectTODB();
add('jiajunatwork@gmail.com', 'LTC', 0, null);
add('jiajunatwork@gmail.com', 'XRP', 0, null);
remove('jiajunatwork@gmail.com', 'XRP');
connection.end();
console.log("end");