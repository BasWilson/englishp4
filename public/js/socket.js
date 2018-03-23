var socket = io();

/*
 * HANDLE Students
*/
socket.on('roomJoined', function (roomID) {

  loadLobby(roomID);

});


function socketJoinGame(data) {

  socket.emit('joinGame', data);

}
