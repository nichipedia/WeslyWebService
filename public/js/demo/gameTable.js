// Seth Champagne - CMPS 401 - 10.27.15
// Abstracts all the canvas animations for the game

var table = (function() {
    var ctx         = null
    ,   animator    = null
    ,   delay       = 800
    ,   queue       = []
    ,   over        = {x: 250, y: 325} 
    ,   deck        = {x: 625, y: 250}
    ,   play        = {x: 250, y: 390}
    ,   deal        = {x: 250, y: 110}
    ,   backOfCard  = document.getElementById('back')
    ;

    function init(context) {
        console.log('[ table ] initializing canvas ');
        ctx = context;

        ctx.font = '30px Lucida Console';
        ctx.setLineDash([5, 10]);
        clear();

        animator = setInterval(function() {
            if (queue.length) {
                var move = queue.shift();
                move();
            }
        }, delay + 10);
    }

    function clear() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.strokeRect(225, 100, 350, 175);
        ctx.strokeRect(225, 375, 350, 175);
        ctx.drawImage(backOfCard, deck.x, deck.y);
    }

    function drawGame() {
        clear();

        ctx.strokeRect(225, 100, 350, 175);
        ctx.strokeRect(225, 375, 350, 175);

        function drawCards(cardArr, orig) {
            cardArr.forEach(function(card, i) {
                var image   = document.getElementById(card.id)
                ,   pos     = calcCardPos(orig, i)
                ;
                if (card.back) image = backOfCard;
                if (!card.moving) ctx.drawImage(image, pos.x, pos.y);
            });
        }

        drawCards(player.cards, play);
        drawCards(dealer.cards, deal);

        ctx.fillText('Player: ' + player.score, 50, 50);
        ctx.fillText('Dealer: ' + dealer.score, 550, 50);
    }

    function calcCardPos(orig, i) {
        var x = orig.x
        ,   y = orig.y
        ;
        if (i >= 4) {
             x += 75;
             y -= 60; 
        }
        return {x: (x + i*20), y: (y + i*15)};
    }

    function animateCard(card, pos) {
        var image = document.getElementById(card.id)
        ,   xstep = Math.floor( (deck.x - pos.x) / 20 )
        ,   ystep = Math.floor( (deck.y - pos.y) / 20 )
        ,   count = 0
        
        if (card.back) image = backOfCard;

        var timer = setInterval(function() {
            var xmove = deck.x - (xstep * count)
            ,   ymove = deck.y - (ystep * count)
            ;
            drawGame();
            ctx.drawImage(image, xmove, ymove);
            count += 1;
        }, Math.floor(delay / 20));

        setTimeout(function() {
            clearInterval(timer);
            card.moving = false;
            drawGame();
        }, delay);
    }

    function playerDraw(card) {
        console.log('[ table ] player drawing card ');
        var pos = calcCardPos(play, player.cards.length-1);
        card.moving = true;
        queue.push(function() { 
            animateCard(card, pos); 
        });
    }

    function dealerDraw(card) {
        console.log('[ table ] dealer drawing card ');
        var pos = calcCardPos(deal, dealer.cards.length-1);
        card.moving = true;
        queue.push(function() { 
            animateCard(card, pos); 
        });
    }

    function gameOver(message) { 
        console.log('[ table ] game over: ' + message);
        queue.push(function() { 
            drawGame();
            ctx.fillText(message, over.x, over.y); 
        });
    }

    return {
        init        : init
    ,   playerDraw  : playerDraw
    ,   dealerDraw  : dealerDraw
    ,   gameOver    : gameOver
    }

}());

