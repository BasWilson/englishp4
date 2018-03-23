var socket = io();
var roomID2;
/*
 * HANDLE Students
*/
socket.on('roomJoined', function (roomID, roomOptions) {

  loadLobby(roomID, roomOptions);
  roomID2 = roomID;
});

socket.on('readyUp', function (newReadyUps) {

  console.log('sup');
  newReadyUp(newReadyUps);

});

function socketJoinGame(data) {

  socket.emit('joinGame', data);

}


function socketReadyUp(roomID, data) {

  socket.emit('readyUp', roomID, data);

}
