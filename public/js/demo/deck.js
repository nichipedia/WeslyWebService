// Seth Champagne - CMPS 401 - 10.27.15
// This function manages the deck of cards
// numOfDecks allows for multiple decks to be played
// Returns a funciton that will draw one card at a time

function getDeckOfCards(numOfDecks) {
    var deck        = []
    ,   shuffled    = []
    ;

    // Cool Fisher-Yates Shuffle from StackOverflow
    // http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
    function shuffleDeck() {
        var o = deck.slice();
        console.log('[ deck ] shuffling deck ');
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    // Get one card object from the shuffled deck of cards
    function drawCard() {
        if (!shuffled.length) shuffled = shuffleDeck();
        var i = shuffled.pop();
        while(i >= 52) i -= 52;
        console.log('[ deck ] drawing card ' + i );
        return JSON.parse(JSON.stringify(cards[i]));
    }

    // Build an array of numbers to represent the indexes of the cards
    for (var i = 0; i < 52 * numOfDecks; i += 1) deck.push(i);
    console.log('[ deck ] building ' + numOfDecks + ' decks of cards ');

    return drawCard;
}

