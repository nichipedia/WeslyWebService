//server.js homie
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var mainController = require('./node_modules/voice/MC.js');
//var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');
var http = require('http');
var mongoose = require('mongoose');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var uuid = require('uuid');


var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "w0526297",
        pass: "Indian41"
    }
});
var mailOptions,host,link;



mongoose.connection.on("open", function (ref) {
    console.log("Connected to mongo server.");
});

mongoose.connection.on("error", function (err) {
    console.log("Could not connect to mongo server!");
    console.log(err);
});

var userSchema = new mongoose.Schema({
    firstName: String
   ,lastName: String
   ,email: String
   ,password: String
   ,apiKey: String
   ,salt: String 
   ,verified: Boolean
});

var commandSchema = new mongoose.Schema({
   commands: Object
  ,apiKey: String
});

var Command = mongoose.model('Command', commandSchema);
var User = mongoose.model('User', userSchema);
mongoose.connect('mongodb://pawn:password1234@ds045664.mongolab.com:45664/sonusjsdb');

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








    app.post('/api/signup', function (req, res) {

        console.log('POST SUCCESS Status 200');
        User.findOne({ email : req.body.email }, function(err, user) {

           if(err) {
               throw err;
              console.log('error connecting to db');
               res.status(401).json({success : false, message : 'Error connecting to database'});
           } 

           if(user){
               console.log('user already exsists');
               res.status(422).json({ success : false, message : 'User already exsists'});
           }

           else {
  
           var salt = generateSalt();
           var apiKey = generateAPIKey();   
           var hash = generateHash(req.body.password, salt);
         
            var newUser = new User({
                firstName: req.body.firstName
               ,lastName: req.body.lastName
               ,email: req.body.email
               ,password: hash
               ,apiKey: apiKey    
               ,salt: salt 
               ,verified: false    
            });
            newUser.save(function(err) {
                if (err) throw err;
                    console.log('User created!');
                });
                delete user;
               
                    console.log('User created');
                    res.status(201).json({ success : true, apiKey : apiKey, accountName : req.body.email}); 
                 
            }
        });

    });









//NOTE: This is the endpoint for passing data for the WAV/audio files
router.post('/api/audio', function (req, res) {
        console.log('POST Success!! Status code 200');
        console.log("RECIEVED AUDIO: ", req.body);
        res.send('Audio recieved');
    });



router.get('/api/translate', function(req, res) {
   
    
    
    
});



router.post('/api/command', function(req, res) {
   
    User.findOne({apiKey : req.body.apiKey}, function(err, user) {
       if(err)
       {
            throw err;        
       }
       else if(!user)
       {
           res.status(309).json({success : false, message : 'Your api key did not match any records in our database', apiKey : req.body.apiKey});   
       } 
       else 
       {
            Command.findOne({apiKey : req.body.apiKey}, function(err, apiUser) {
                if(err)
                {
                    res.status(309).json({ success: false, message: 'Error connecting to db'});
                    throw err;            
                }
                else if(!apiUser)
                {
                    delete apiUser;
                    var apiUser = new Command({
                        apiKey: req.body.apiKey
                       ,commands: req.body.object
                    });
                    apiUser.save(function(err) {
                        if (err) throw err;
                        console.log('Command created!');
                    });
                    res.status(201).json({success: true, message: 'New commands were added for user'});
                }
                else 
                {
                    Command.update({apiKey: req.body.apiKey}, {commands: req.body.object}, callback);
                    function callback(err, affected)
                    {
                        if(err)
                        {
                            res.status(401).json({ success: false, message: 'Was not able to update commands'});
                            throw err;
                        }
                        else
                        {
                            res.status(201).json({ success: true, rowsAffected: affected, message: 'Commands were updated!'});            
                        }
                    }
                }
            });  
       }
    });   
});

router.get('/api/command', function(req, res) {
    
    var apiKey = req.get('apiKey');
    Command.findOne({apiKey: apiKey}, function(err, apiUser) {
       if(err)
       {
           throw err;
       }
       else if(!apiUser)
       {
           res.status(309).json({ success: false, message: 'User does not have any commands registered'});               
       }
       else
       {
           res.status(200).json({ success: true, message: 'Commands have been returned', Commands: apiUser.commands });
       }
    });
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

function generateHash(password, salt)
{
    var hash = crypto
    .createHash('sha256')
    .update(salt + password)
    .digest('base64');

    return hash;
}

function generateAPIKey() 
{
    return uuid.v4();
}

function generateSalt() 
{
    return crypto.randomBytes(16).toString('base64');
}

server.listen(port);

// START THE SERVER
// =============================================================================

console.log('Magic happens on port ' + port);