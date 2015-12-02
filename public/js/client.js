var recording = false

function postAudioToWesly(blob) {
    // Recorder.setupDownload( blob, "myRecording.wav" );
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
