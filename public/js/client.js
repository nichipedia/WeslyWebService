var recording = false;

function postAudioToWesly(blob) {
    // Recorder.setupDownload( blob, "myRecording.wav" );
    var reader = new FileReader();

    reader.onloadend = function () {
        var contents = reader.result;

        $.ajax({
            url         : 'api/seth'
        ,   method      : 'POST'
        ,   dataType    : 'json'
        ,   contentType : 'application/json'
        ,   data        : JSON.stringify({
                apiKey      : 'we made it'
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
