//client test unit
//used to demonstrate api 

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var http = require('http');


fs.readFile((__dirname + '/tester.wav'), function (err, data) {
var optionsget = {
    host : 'localhost', 
    port : 9000,
    path : '/api/audio', 
    method : 'POST',
    headers : { 'Content-Type' : 'audio/wav' }	

};

var reqGet = http.request(optionsget, function(res) {
    console.log("statusCode: ", res.statusCode);



});

reqGet.on('data', function(d) {


//handle response from api


console.log('\n\nCall completed');
});
reqGet.write(data);
reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
});
});
