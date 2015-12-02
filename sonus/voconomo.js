var spawn = require('child_process').spawn;

module.exports = function (wavFile, callBack) {
    var downSampled = __dirname + '/sonus.wav';

    ps = spawn('sox', [
        wavFile
    ,   '-r', '16k'
    ,   downSampled
    ]);

    ps.on('close', function (code) {
        console.log('\nFinished sox down sample with process ' + code);
        recognize();
    });

    function recognize() {
        var child = spawn(__dirname + '/sonus.o', [downSampled]);

        console.log('Recognizing file : ' + wavFile);
        child.stdout.on('data', function (data) {
            var result = /\|([\w\s]+)\|/g.exec(data.toString());

            console.log(result[0]);
            callBack(result[1]);
        });

        child.on('close', function (code) { 
            console.log('\nFinished sonus.o with process ' + code);
        });
    }
}
