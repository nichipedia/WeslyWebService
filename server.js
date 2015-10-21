//server.js homie



var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mainController = require('./node_modules/voice/MC.js');
var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');
var http = require('http');



//TODO: make front end that will transfer audio to server 
//TODO: will transfer audio in an array of bytes

// this will let us get the data from a POST
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
//var bs = new BinaryServer({port: 3000});
//var port = process.env.PORT || 9000;   

var port = process.env.PORT || 80;

// routes for api
var router = express.Router();




    router.get('/', function (req, res) {
        console.log("We made it");
        res.sendfile('public/index.html');
    });




// more routes for our API will happen here



    router.post('/audio', function (req, res) {

        console.log("Your audio is being translated");






    });


    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', router);


var server = http.createServer(app);

// Start Binary.js server
//var BinaryServer = require('../../').BinaryServer;
//var bs = BinaryServer({server: server});
var bs = new BinaryServer({port: 3000});

// Wait for new user connections
bs.on('connection', function(client){
  // Incoming stream from browsers
  client.on('stream', function(stream, meta){
    //old
    //var file = fs.createWriteStream(__dirname+ '/public/' + meta.name);
	var file = fs.createWriteStream(__dirname+ '/node_modules/voice/wav/wavin.wav');    
	stream.pipe(file);
    //
    // Send progress back
    stream.on('data', function(data){
      stream.write({rx: data.length / meta.size});
    });
    //run file through sonus
    mainController.sonus();
  });
});
//
//

server.listen(9000);

// START THE SERVER
// =============================================================================

console.log('Magic happens on port 9000');
