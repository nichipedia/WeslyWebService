var fs      = require('fs')
,   voco    = require('./voconomo.js')
;

module.exports = {
    JSONin      : JSONparse
,   match       : matchCommand
,   getCommand  : recognize
}

//parse the JSON object
function JSONparse(data) {
    var keys        = Object.keys(data.devices);
    var response    = [];

    for (var i = 0; i < data.devices.length; i++) {
        var device      = data.devices[i].deviceName;
        var phrases     = Object.keys(data.devices[i].commands);
        var commands    = data.devices[i].commands;
        var results     = []

        phrases.forEach(function (phrase) {
            results.push(commands[phrase]);
        })

        response[i] = {
            device      : device
        ,   phrases     : phrases
        ,   results     : results 
        }
    }

    return response;
}

//check the module's response against the availiable commands for the user
function matchCommand(moduleResponse, JSONresponse) {
    for (var i = 0; i < JSONresponse.length; i++) {   
        //response[0]['commands'][0]['other command'] <-- this is what you're looking for
        if (m < JSONresponse[i]['commands'][moduleResponse]) {
            var returnObject = JSONresponse[i]['commands'][moduleResponse];
        }
    }

    if (!returnObject) {
        var returnObject = "No Command Found"
    }

    return returnObject;
}

// Run VoCoNoMo to recognize and return command
function recognize(fileName, device) {
    console.log(device);
    voco(fileName, function (result) {
        console.log('woo : ' + result);
    });
} 
