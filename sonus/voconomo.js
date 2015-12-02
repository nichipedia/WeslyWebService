var spawn = require('child_process').spawn;

module.exports = function (wavFile, callBack) {
    var child = spawn(__dirname+ '/sonus.o', [wavFile]);

    child.stdout.on('data', function (data) {
        var result = /\|([\w\s]+)\|/g.exec(data.toString());

        console.log(result[0]);
        callBack(result[1]);
    });

    child.on('close', function (code) { 
        console.log('\nFinished with process ' + code);
    });
}
