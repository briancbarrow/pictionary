var http = require('http');
var express = require('express');
var socket_io = require('socket.io');
var app = express();
app.use(express.static('public'));
var server = http.Server(app);
var io = socket_io(server);

io.on('connection', function(socket) {
    socket.on('draw', function(position) {
        socket.broadcast.emit('draw', position);
    });
    
    socket.on('guess', function(guess) {
        io.emit('guess', guess);
    });
    
    socket.on('drawer', function() {
        socket.broadcast.emit('drawer');
    });
    
    socket.on('end-drawing', function() {
        socket.broadcast.emit('show-buttons');
    });
    
    socket.on('disconnect', function() {
        console.log('A user has disconnected');
        console.log(socket.drawer)
        socket.broadcast.emit('disconnection');
    });
});

server.listen(process.envPORT || 8080);