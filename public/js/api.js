const express = require('express')
var path = require("path");
var bodyParser = require('body-parser');
var mysql = require('mysql');
const alpha = require('alphavantage')({ key: 'M9XXXH6V2NGIA32C' }); 
const fetch = require("node-fetch"); //npm i node-fetch --save
var keyCounter = 0;
var keyArray = ['M9XXXH6V2NGIA32C', 'Z3B2FO26F96IVKYH', 'KR9H9KUW7FR4EWAQ','ICB7Q3R5EMA32GYY']
module.exports = {
    getApiData: async function(list,symbols) {
        const otherPram = {
            headers: {
                "content-type": "application/json; charset=UTF-8"
            },
            method: "GET"
        };
        for (itr of symbols) {
            var temp;
            var data;
            do {
                keyCounter = (keyCounter + 1) % keyArray.length;
                url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey=" + keyArray[keyCounter] + "&symbol=" + itr;
                response = await fetch(url, otherPram);
                data = await response.json();
            } while (JSON.stringify(data).includes('5 calls per minute'));
            await list.push(data);
        }
        return list;
    }
}