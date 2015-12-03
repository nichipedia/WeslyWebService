// Seth Champagne - CMPS 401 - 10.27.15
// This file handles the game logic of blackjack

var drawCard    = getDeckOfCards(2) // defined in deck.js
,   player
,   dealer
;

// Begins a new round fo the game
function startRound() {
    console.log('[ jack ] beginning game ');

    player = initPlayer();
    dealer = initDealer();

    hit(player);
    hit(player);

    hit(dealer, true);
    hit(dealer);

    // Pass control to the UI controller
    startPlayerTurn();
}

// Builds the player object
function initPlayer() {
    return {
        score   : 0
    ,   cards   : []
    ,   draw    : table.playerDraw
    }
}

// Builds the dealer object
function initDealer() {
    return {
        score   : 0
    ,   cards   : []
    ,   draw    : table.dealerDraw
    }
}

// Draws a card for the player object
function hit(person, showBackOfCard) {
    var card = drawCard();
    if (showBackOfCard) card.back = showBackOfCard;
    person.cards.push(card);
    person.score = updateScore(person.cards);
    person.draw(card);
}

// Takes an array of cards and calculates the best balckjack score
function updateScore(cardArr) {
    var aces = 0,
        sum  = 0;
   
    sum = cardArr.reduce(function(score, card) {
        if (!card.back) score += card.value;
        if (card.value == 11) aces += 1;
        return score;
    }, 0);

    for (var i = 0; i < aces; i += 1) {
        if (sum > 21) sum -= 10;
    }

    console.log('[ jack ] updated score: ' + sum );
    return sum;
}

// Finish the round by having the dealer hit cards
function startDealerTurn() {
    console.log('[ jack ] dealer beginning turn');
    dealer.cards[0].back = false;
    dealer.score = updateScore(dealer.cards);

    if (player.score > 21 || dealer.score > player.score) {
        table.gameOver('Dealer Wins');
        return;
    }

    while (dealer.score < 17 || dealer.score < player.score) {
        hit(dealer);
    }

    // Call and animation based on the game outcome
    if (dealer.score > 21) {
        table.gameOver('Player Wins');
    } else if (dealer.score > player.score || player.score > 21) {
        table.gameOver('Dealer Wins');
    } else if (dealer.score == player.score) {
        table.gameOver('Tie Game');
    } else {
        table.gmaeOver('Player Wins');
    } 
}

