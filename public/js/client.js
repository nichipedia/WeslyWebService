var recording = false;

// mongolab api key
// var apiKey = '98098dae-674f-4e20-bbf7-7afa288a00b2';

// wesely api ket
var apiKey = '82f1f7a8-3edc-49b6-9adf-748b86b74ba8';

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
        }).done(function (res) {
            console.log('[ client ] ' + res.message);
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
        ,   object      : JSON.stringify({ devices : [{
                deviceName  : 'blackjack'
            ,   commands    : {
                    'hit me'    : 'hit'
                ,   'hit'       : 'hit'
                ,   'blackjack' : 'hit'
                ,   'check'     : 'stay'
                ,   'stay'      : 'stay'
                ,   'stand'     : 'stay'
                ,   'fold'      : 'stay'
                ,   'restart'   : 'start'
                ,   'start'     : 'start'
                }
            }]})
        })
    }).done(function (res) {
        console.log('[ client ] ' + res.message);
    });
});
