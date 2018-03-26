var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path')
var io = require('socket.io')(http);
var sha256 = require('js-sha256');
var randomFloat = require('random-float');

//Modules
var fb = require('./modules/fb');
var que = require('./modules/matchmaking');
var game = require('./modules/game');


//HANDLE PAGES HERE
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
res.sendFile(__dirname + '/views/game.htm');
});
app.get('/dashboard', function(req, res){
res.sendFile(__dirname + '/views/game.htm');
});

app.get('/login', function(req, res){
res.sendFile(__dirname + '/views/login.htm');
});
app.get('/register', function(req, res){
res.sendFile(__dirname + '/views/register.htm');
});

//SOCKET CONNECTIONS
io.on('connection', function(socket){

//Handle sockets from here
    console.log('Player connected');

  socket.on('disconnect', function(){

    console.log('Player disconnected');

  });

  /*
   * Player starts queing for a game
  */
  socket.on('joinGame', function(data){
    //Player gets added to que
    que.addPlayerToQue(data, socket, io);
  });

  /*
   * Player readies up for a game
  */
  socket.on('readyUp', function(roomID, data){
    //Player gets added to que
    console.log(roomID);
    fb.readyUp(roomID, data, socket, io);
  });

  /*
   * Player attacks other player
  */
  socket.on('attack', function(roomID, attack){
    //Player gets added to que
    console.log('Attacked');
    game.attack(roomID, attack, socket, io);
  });

});
http.listen(7000, function(){
  console.log('Battle Server has started');
})
