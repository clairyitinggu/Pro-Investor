const express = require('express')
var path = require("path");
var bodyParser = require('body-parser');
var mysql = require('mysql');
const alpha = require('alphavantage')({ key: 'M9XXXH6V2NGIA32C' }); //Z3B2FO26F96IVKYH  //M9XXXH6V2NGIA32C
const fetch = require("node-fetch"); //npm i node-fetch --save

module.exports = {
    getApiData: async function(list,symbols) {
        const otherPram = {
            headers: {
                "content-type": "application/json; charset=UTF-8"
            },
            method: "GET"
        };
        for (itr of symbols) {
            url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey=" + alpha.key + "&symbol=" + itr;
            response = await fetch(url, otherPram);
            data = await response.json();
            await list.push(data);
        }
        return list;
    }
}