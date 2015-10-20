//server.js homie



var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');
//var sonus = require('./node_modules/voice/sonus.js');
//var wordList = require('./node_modules/voice/wordList.js');
//var pocketSphinx = require('./node_modules/voice/pocketsphinx.js');
var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');
var http = require('http');





// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9000;       

// routes for api
var router = express.Router();              


router.get('/', function(req, res) {
    console.log("We made it");
    res.sendfile('public/index.html');
});




// more routes for our API will happen here



router.post('/audio', function(req, res) {
   
    console.log("Your audio is being translated");
    
    
    
    
    
    
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

var server = http.createServer(app).listen(port);

// START THE SERVER
// =============================================================================

console.log('Magic happens on port ' + port);