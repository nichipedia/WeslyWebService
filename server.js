//server.js homie



var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');


// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;       

// routes for api
var router = express.Router();              


router.get('/', function(req, res) {
    console.log("We made it");
    res.sendfile('public/index.html');
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);