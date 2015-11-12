//server.js homie



var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var mainController = require('./node_modules/voice/MC.js');
//var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');
var http = require('http');
var mongoose = require('mongoose');
//var sonus = require('');




mongoose.connection.on("open", function (ref) {
    console.log("Connected to mongo server.");
  


});

mongoose.connection.on("error", function (err) {
    console.log("Could not connect to mongo server!");
    console.log(err);
});


var userSchema = new mongoose.Schema({
    userName: String,
    passWord: String
});

var User = mongoose.model('User', userSchema);



mongoose.connect('mongodb://pawn:password@ds045664.mongolab.com:45664/sonusjsdb');







app.use(bodyParser.urlencoded());



app.use(bodyParser.json({
    limit: '50mb',
    urlencoded: false
}));


app.use(bodyParser.raw({
    type: 'audio/wav',
    limit: '50mb'
}));





app.use(express.static(__dirname + '/public'));



var port = process.env.PORT || 9000;

//NOTE: routes for api
var router = express.Router();



    router.get('/', function (req, res) {



        console.log("GET Success! status code 200");
        res.sendstatus(200).sendfile('public/index.html');


    });



    app.post('/signup', function (req, res) {


        console.log('POST SUCCESS Status 200');

        User.find({ userName : req.body.username }, function(err, user) {



           if(err) {
               throw err;
              console.log('error connecting to db');
           } 

           if(user.length != 0){

               console.log('user already exsists');
               res.send('user already exsists');

           }

            else{

                var newUser = new User({

                    userName: req.body.username
                    ,passWord: req.body.password



                });

                newUser.save(function(err) {
                    if (err) throw err;

                    console.log('User created!');
                });

                
                delete user;

                User.findOne( {userName : req.body.username}, function(err, user) {
                    
                    console.log('User created ' + ' your usernaame is: ' + user.userName + ' and this is your unique user ID: ' + user._id);

                    res.send('User created ' + ' your usernaame is: ' + user.userName + ' and this is your unique user ID: ' + user._id);
                    
                    
                });
                
                
            }
        
        
    
        
       
    
        



                    });



    });









//NOTE: This is the endpoint for passing data for the WAV/audio files



    


    router.post('/api/audio', function (req, res) {





        console.log('POST Success!! Status code 200');

        console.log("RECIEVED AUDIO: ", req.body);
        
        res.send('Audio recieved');








    });



// REGISTER OUR ROUTES -------------------------------




        app.use('/', router);



        var server = http.createServer(app);

        // Start Binary.js server




/*

var bs = new BinaryServer({
    port: 3000
});

// Wait for new user connections
bs.on('connection', function (client) {
    // Incoming stream from browsers
    client.on('stream', function (stream, meta) {
        //old
        //var file = fs.createWriteStream(__dirname+ '/public/' + meta.name);
        var file = fs.createWriteStream(__dirname + '/node_modules/voice/wav/wavin.wav');
        stream.pipe(file);
        //
        // Send progress back
        stream.on('data', function (data) {
            stream.write({
                rx: data.length / meta.size
            });
        });
        //run file through sonus
        mainController.sonus();
    });
});
*/



server.listen(port);

// START THE SERVER
// =============================================================================

console.log('Magic happens on port ' + port);