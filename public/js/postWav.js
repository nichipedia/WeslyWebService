
var recording   = false
,   client      = new BinaryClient('ws://localhost:3000');

// Deal with DOM quirks
function doNothing (e){
    e.preventDefault();
    e.stopPropagation();
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

// Wait for connection to BinaryJS server
client.on('open', function(){
    var box = $('#box');
    box.on('dragenter', doNothing);
    box.on('dragover', doNothing);
    box.text('Drag files here');
    box.on('drop', function(e){
        e.originalEvent.preventDefault();
        var file = e.originalEvent.dataTransfer.files[0];
        
        // Add to list of uploaded files
        $('<div align="center"></div>').append($('<a></a>').text(file.name).prop('href', '/'+file.name)).appendTo('body');
        
        // `client.send` is a helper function that creates a stream with the 
        // given metadata, and then chunks up and streams the data.
        var stream = client.send(file, {name: file.name, size: file.size});

        stream.on('data', function(data) {
            $.ajax({url: '/api/audio'})
            .then(function(data) {
                console.log('woo');
                console.log(data);
                $('#result').html('<h2>Result: ' + data + '</h2>');
            });
        });

    }); 
});