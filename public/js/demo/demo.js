// Seth Champagne - CMPS 411 - 12.02.15
// UI controller of the blackjack game
//  | blackjack.js  - handles game logic
//  | deck.js       - manages the deck of cards 
//  | gameTable.js  - controls all the canvas animations

// NOW FEATURING VOICE CONTROLS!!

$(function() {
    console.log('[ ui ] we made it');
    var canvas = document.getElementById('blackjack');
    
    table.init(canvas.getContext('2d'));

    cards.forEach(function(card) {
        var image = $('<img>').attr({src : card.loc, id : card.id});
        $('#images').append(image);
    })

    $('#start-btn').on('click', function() {
        // Begins game (blackjack.js)
        console.log('[ ui ] start button clicked');
        startRound();
    });

    $('#hit-btn').on('click', function() {
        // Call funciton to draw card for player
        console.log('[ ui ] hit button clicked');
        hit(player);
        if (player.score >= 21) $('#hold-btn').trigger('click');
    }).prop('disabled', true);

    $('#hold-btn').on('click', function() {
        // Player is done drawing cards
        console.log('[ ui ] hold button clicked');
        $('#hit-btn, #hold-btn').prop('disabled', false);
        startDealerTurn(); 
    }).prop('disabled', true);
});

function startPlayerTurn() {
    console.log('[ ui ] beginning player turn');
    if (player.score == 21) $('#hold-btn').trigger('click');
    $('#hit-btn, #hold-btn').prop('disabled', false);
}

