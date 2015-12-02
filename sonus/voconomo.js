var spawn = require('child_process').spawn;

module.exports = function (wavFile, callBack) {
    var child = spawn(__dirname+ '\\sonus.o', [wavFile]);

    child.stdout.on('data', function (data) {
        var result = /|(\w+)|/g.exec(data.toString());

        process.stdout.write(result); 

        callBack(results.split(' '));
    });

    child.on('close', function (code) { 
        console.log('\nFinished with process ' + code);
    });
}
