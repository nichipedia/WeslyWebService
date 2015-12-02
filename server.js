var express     = require('express')
,   app         = express()
,   bodyParser  = require('body-parser')
,   fs          = require('fs')
,   http        = require('http')
,   mongoose    = require('mongoose')
,   crypto      = require('crypto')
,   nodemailer  = require('nodemailer')
,   uuid        = require('uuid')
,   softCtrl    = require('./sonus/softCtrl.js')
,   mailOptions
,   host
,   link
;

var smtpTransport = nodemailer.createTransport('SMTP', {
    service : 'Gmail'
,   auth    : {
        user : 'w0526297'
    ,   pass : 'Indian41'
    }
});

mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
});

mongoose.connection.on('error', function (err) {
    console.log('Could not connect to mongo server!');
    console.log(err);
});

var userSchema = new mongoose.Schema({
    firstName   : String
,   lastName    : String
,   email       : String
,   password    : String
,   apiKey      : String
,   salt        : String 
,   verified    : Boolean
});

var commandSchema = new mongoose.Schema({
    commands    : Object
,   apiKey      : String
});

var Command = mongoose.model('Command', commandSchema);
var User = mongoose.model('User', userSchema);
mongoose.connect('mongodb://pawn:password1234@ds045664.mongolab.com:45664/sonusjsdb');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json({
    limit       : '50mb'
,   urlencoded  : true
}));

app.use(bodyParser.raw({
    type    : 'audio/wav'
,   limit   : '50mb'
}));

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 9000;


// REGISTER OUR ROUTES
// =============================================================================
var router = express.Router();

router.get('/', function (req, res) {
    console.log('GET Success! status code 200');
    res.sendstatus(200).sendfile('public/index.html');
});

router.post('/api/signup', function (req, res) {
    console.log('POST SUCCESS Status 200');
    User.findOne({ email : req.body.email }, function (err, user) {
        if (err) {
            throw err;
            console.log('error connecting to db');
            res.status(401).json({
                success : false
            ,   message : 'Error connecting to database'
            });
        } 

        if (user) {
            console.log('user already exsists');
            res.status(422).json({
                success : false
            ,   message : 'User already exsists'
            });
        } else {
            var salt    = crypto.randomBytes(16).toString('base64')
            ,   hash    = crypto.createHash('sha256').update(salt + req.body.password).digest('base64')
            ,   apiKey  = uuid.v4()
            ;

            var newUser = new User({
                firstName   : req.body.firstName
            ,   lastName    : req.body.lastName
            ,   email       : req.body.email
            ,   password    : hash
            ,   apiKey      : apiKey    
            ,   salt        : salt 
            ,   verified    : false    
            });
        
            newUser.save(function(err) {
                if (err) throw err;
                console.log('User created!');
            });

            delete user;
            console.log('User created');
            res.status(201).json({
                success     : true
            ,   apiKey      : apiKey
            ,   accountName : req.body.email
            }); 
        }
    });
});

//NOTE: This is the endpoint for passing data for the WAV/audio files
router.post('/api/audio', function (req, res) {
    Command.findOne({apiKey: req.body.apiKey}, function (err, apiUser) {
        if (err) {
            throw err;
        } else if (!apiUser) {
            res.status(309).json({
                success : false
            ,   message : 'User does not have any commands registered'
            });               
        } else {
            var userCommands    = apiUser.commands
            ,   fileName        = req.body.fileName
            ,   contents        = req.body.file
            ;

            userCommands = softCtrl.JSONin(JSON.parse(userCommands));

            fs.writeFile(fileName, contents, 'binary', function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Audio received');
                    softCtrl.getCommand(fileName, userCommands);
                }
            });

            res.status(201).send('Audio recieved');
        }
    });
});

router.post('/api/command', function (req, res) {
    User.findOne({apiKey : req.body.apiKey}, function (err, user) {
        if (err) {
            throw err;        
        } else if (!user) {
            res.status(309).json({
                success : false
            ,   message : 'Your api key did not match any records in our database'
            ,   apiKey  : req.body.apiKey
            });   
        } else {
            Command.findOne({apiKey : req.body.apiKey}, function (err, apiUser) {
                if(err) {
                    res.status(309).json({
                        success : false
                    ,   message : 'Error connecting to db'
                    });
                    throw err;            
                } else if  (!apiUser) {
                    delete apiUser;
                    var apiUser = new Command({
                        apiKey: req.body.apiKey
                    ,   commands: req.body.object
                    });
                    apiUser.save(function(err) {
                        if (err) throw err;
                        console.log('Command created!');
                    });
                    res.status(201).json({success: true, message: 'New commands were added for user'});
                } else {
                    Command.update({apiKey: req.body.apiKey}, {commands: req.body.object}, function (err, affected) {
                        if (err) {
                            res.status(401).json({
                                success : false
                            ,   message : 'Was not able to update commands'
                            });
                            throw err;
                        } else {
                            res.status(201).json({
                                success         : true
                            ,   message         : 'Commands were updated!'
                            ,   rowsAffected    : affected
                            });            
                        }
                    });
                }
            });  
        }
    });   
});

router.get('/api/command', function (req, res) {
    var apiKey = req.get('apiKey');
    Command.findOne({apiKey: apiKey}, function (err, apiUser) {
        if (err) {
            throw err;
        } else if (!apiUser) {
            res.status(309).json({
                success : false
            ,   message : 'User does not have any commands registered'
            });               
        } else {
            res.status(200).json({
                success     : true
            ,   message     : 'Commands have been returned'
            ,   Commands    : apiUser.commands
            });
        }
    });
});

router.get('/api/accountinfo', function (req, res) {
    var apiKey = req.get('apiKey');
    User.findOne({apiKey: apiKey}, function (err, userInfo) {
        if (err) {
            throw err;
        } else if (!userInfo) {
            res.status(400).json({
                success : false
            ,   message : 'Your api key is not recognized'
            });         
        } else {
            Command.findOne({apiKey: apiKey}, function (err, commandList) {
                if (err) {
                    throw err;
                } else if (!commandList) {
                    res.status(200).json({
                        success     : true
                    ,   message     : 'Did not find any commands saved'
                    ,   firstName   : userInfo.firstName
                    ,   lastName    : userInfo.lastName
                    ,   email       : userInfo.email
                    ,   apiKey      : apiKey
                    });            
                } else {
                    res.status(200).json({
                        success     : true
                    ,   message     : 'Commands recieved'
                    ,   firstName   : userInfo.firstName
                    ,   lastName    : userInfo.lastName
                    ,   email       : userInfo.email
                    ,   apiKey      : apiKey
                    ,   Commands    : commandList.commands
                    }); 
                }
            });
        }   
    });
});


app.use('/', router);
var server = http.createServer(app);

server.listen(port);

// START THE SERVER
// =============================================================================

console.log('Magic happens on port ' + port);
