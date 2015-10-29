var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var sonus           = require('./VoCoNoMo/sonus.js');
var BinaryServer    = require('binaryjs').BinaryServer;
var fs              = require('fs');
var http            = require('http');

// This will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 80;

// Routes for api
var router = express.Router();

router.get('/demo', function (req, res) {
    res.sendfile('public/demo.html');
});

router.get('/', function (req, res) {
    console.log("We made it");
    res.sendfile('public/index.html');
});


router.get('/audio', function (req, res) {
    res.send(result);
});

// REGISTER OUR ROUTES
app.use('/api', router);

var server = http.createServer(app);

// Start Binary.js server
var bs = new BinaryServer({port: 3000});

var result = '';

// Wait for new user connections
sonus.init();
bs.on('connection', function(client){
    // Incoming stream from browsers
    client.on('stream', function(stream, meta){
        // var file = fs.createWriteStream(__dirname + '/wav/wavin.wav');    
        // stream.pipe(file);
        console.log('Recognizing...');
        sonus.recognize(stream, function(hyp) {
            result = hyp;
            stream.resume();
            stream.write('woo');
            stream.end();
        });
    });
});

server.listen(9000);

// START THE SERVER
// =============================================================================
console.log('Magic happens on port 9000');