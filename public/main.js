var socket = io();
var pictionary = function() {
    var canvas, context;
    var drawing = false;
    socket.drawer = false;
    
    var WORDS = [
        "word", "letter", "number", "person", "pen", "class", "people",
        "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
        "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
        "land", "home", "hand", "house", "picture", "animal", "mother", "father",
        "brother", "sister", "world", "head", "page", "country", "question",
        "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
        "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
        "west", "child", "children", "example", "paper", "music", "river", "car",
        "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
        "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
        "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
        "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
        "space"
    ];
    
    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                6, 0, 2 * Math.PI);
        context.fill();
    };
    
    var guessBox;

    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        }
        // socket.emit('made-gues')
        console.log(guessBox.val());
        socket.emit('guess', guessBox.val());
        guessBox.val('');
    };
    
    var makeGuess = function(guess) {
        $('#main').css('background-color', "#9ABC79");
        setTimeout(function() {
          $('#main').css('background-color', "#F8F8F8");  
        }, 500);
        $('#guesses').text(guess);
    }

guessBox = $('#guess input');
guessBox.on('keydown', onKeyDown);

$('#drawer').on('click', function(e) {
    var rand = Math.floor(Math.random() * (WORDS.length + 1));
    var word = WORDS[rand];
    console.log(rand, word);
    socket.drawer = true;
    socket.emit('drawer');
    $('#drawer').hide();
    $('#end-drawing').show();
    $('#guess').hide();
    $('#word').text(word).show();
});

$('#end-drawing').on('click', function(e) {
    socket.drawer = false;
    socket.emit('end-drawing');
    $('#guess').show();
    $('#end-drawing').hide();
    $('#drawer').show();
    context.clearRect(0, 0, canvas[0].width, canvas[0].height);
    $('#word').hide();
});

var hideButtons = function() {
    socket.drawer = false;
    $('#drawer').hide();
    $('#guess').show();
    $('#word').hide();
};

var showButtons = function() {
    $('#drawer').show();
    $('#guess').hide();
    context.clearRect(0, 0, canvas[0].width, canvas[0].height)
};

var userDisconnect = function() {
        alert('A user has disconnected, refresh to start new game');
}
    
    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.on('mousedown', function(e) {
        if(socket.drawer) {
            drawing = true;
        }
    });
    canvas.on('mouseup', function(e) {
        drawing = false;
    });
    canvas.on('mousemove', function(event) {
        if(drawing) {
            var offset = canvas.offset();
            var position = {x: event.pageX - offset.left,
                            y: event.pageY - offset.top};
            draw(position);
            socket.emit('draw', position);
        }
    });
    socket.on('draw', draw);
    socket.on('guess', makeGuess);
    socket.on('drawer', hideButtons);
    socket.on('show-buttons', showButtons);
    socket.on('disconnection', userDisconnect);
};

$(document).ready(function() {
    pictionary();
    
});