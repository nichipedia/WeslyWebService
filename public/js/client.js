var recording = false;
var apiKey = '98098dae-674f-4e20-bbf7-7afa288a00b2';

function postAudioToWesly(blob) {
    // Recorder.setupDownload( blob, 'myRecording.wav' );
    var reader = new FileReader();

    reader.onloadend = function () {
        var contents = reader.result;

        // post wav to server
        $.ajax({
            url         : 'api/audio'
        ,   method      : 'POST'
        ,   dataType    : 'json'
        ,   contentType : 'application/json'
        ,   data        : JSON.stringify({
                apiKey      : apiKey
            ,   fileName    : 'seth.wav'
            ,   file        : contents
            })
        }).done(function (msg) {
            console.log(msg);
        });
    }

    reader.readAsBinaryString(blob);
}

$('#record').on('click', function() {
    toggleRecording(this);
    recording = !recording;
    if (recording) {
        $(this).html('Stop');
    } else {
        $(this).html('Record');
    }
});

$(function() {
    // Register commands
    $.ajax({
        url         : 'api/command'
    ,   method      : 'POST'
    ,   dataType    : 'json'
    ,   contentType : 'application/json'
    ,   data        : JSON.stringify({
            apiKey      : apiKey
        ,   devices      : [{
                deviceName  : 'blackjack'
            ,   commands    : {
                    'hit me'    : 'hit'
                ,   'hit'       : 'hit'
                ,   'check'     : 'stay'
                ,   'stay'      : 'stay'
                ,   'stand'     : 'stay'
                ,   'fold'      : 'stay'
                ,   'restart'   : 'start'
                ,   'start'     : 'start'
                }
            }]
        })
    }).done(function (msg) {
        console.log(msg);
    });
});
