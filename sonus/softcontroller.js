var fs      = require('fs')
,   voco    = require('./voconomo.js')
;

module.exports = {
    JSONin  : function (data) {
        var response = JSONparse(data);

        //return final response back to server
        return response;
    }
,   match   : function (moduleResponse, JSONresponse) {
        var response = matchCommand(moduleResponse, JSONresponse);

        //object to be returned to the user
        return response;
    }

}

//parse the JSON object
function JSONparse(data) {
    var keys = Object.keys(data.device);
    var response = [];
    for(var i=0; i<data.device.length;i++) {
        var device = data.device[i].DeviceName;
        var commandkeys = Object.keys(data.device[i].Commands);
        var command = data.device[i].Commands;
        var commands = [];
        var cKeys = Object.keys(command);
        for(var n=0; n<cKeys.length;n++){
            var nm = cKeys[n];
            commands[cKeys[n]] = command[cKeys[n]];
        }
        var res = [];
        res['device'] = device;
        res['commands'] = [commands];
        response[i] = res;
    }

    return response;
}

//check the module's response against the availiable commands for the user
function matchCommand(moduleResponse, JSONresponse) {

    for(var i=0; i<JSONresponse.length; i++){   
        //response[0]['commands'][0]['other command'] <-- this is what you're looking for
        if(m<JSONresponse[i]['commands'][moduleResponse]){
            var returnObject = JSONresponse[i]['commands'][moduleResponse];
        }
    }

    if(!returnObject){
        var returnObject = "No Command Found"
    }

    return returnObject;
}
