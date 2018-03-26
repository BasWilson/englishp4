var socket = io();
var roomID2;
/*
 * HANDLE Game interactions here
*/
socket.on('roomJoined', function (roomID, roomOptions) {

  loadLobby(roomID, roomOptions);
  roomID2 = roomID;
  inLobby = true;

});
socket.on('startGame', function (roomOptions) {

  loadingView(true);
  updateRoom(roomOptions);
  //preload all assets here
});

socket.on('initializeGame', function (roomOptions) {

  initializeGame(roomOptions);

});
socket.on('gameStarted', function () {
  //game has been started in  the database, players can now start to play

  loadingView(false);
  lobbyView(false);
  gameView(true);

});

socket.on('updateTurn', function (roomOptions) {
  handleTurn(roomOptions);
})

socket.on('attacked', function (roomOptions, attack) {
  handleAttack(roomOptions, attack);
})

function socketJoinGame(data) {

  socket.emit('joinGame', data);

}

function socketReadyUp(roomID) {
  console.log(data);
  socket.emit('readyUp', roomID, data);

}

function socketAttack (roomID, attack) {
  socket.emit('attack', roomID, attack);
}
