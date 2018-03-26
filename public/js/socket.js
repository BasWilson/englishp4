var socket = io();
var roomID2;


//The server is now sending all game data to the client
socket.on('onlinePlayers', function (players) {
  onlinePlayers(players);
});


//The server has told the user he/she joined a room
socket.on('roomJoined', function (roomID, roomOptions) {
  loadLobby(roomID, roomOptions);
  roomID2 = roomID;
  inLobby = true;
});

//The server tells the user the game is going to start, we show the loading screen
socket.on('startGame', function (roomOptions) {
  loadingView(true);
  updateRoom(roomOptions);
});

//The game view loads in
socket.on('gameStarted', function () {
  loadingView(false);
  lobbyView(false);
  gameView(true);
});

//The server is now sending all game data to the client
socket.on('initializeGame', function (roomOptions) {
  initializeGame(roomOptions);
});


/*
* PREGAME
*/

//Tell the server the player wants to join a game
function socketJoinGame(data) {
  socket.emit('joinGame', data);
}

//Tell the server the player is ready
function socketReadyUp(roomID) {
  socket.emit('readyUp', roomID, data);
}

/*
* INGAME
*/

//Tell the server an attack is coming
function socketAttack (roomID, attack) {
  socket.emit('attack', roomID, attack);
}

//Show that someone attacked
socket.on('attacked', function (roomOptions, attack) {
  handleAttack(roomOptions, attack);
})

//This lets the client know who's turn it is
socket.on('updateTurn', function (roomOptions) {
  handleTurn(roomOptions);
})
