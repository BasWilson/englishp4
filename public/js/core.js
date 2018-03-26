/*
* Globale variablen
*/
var currentView;
var data;
var oldReadyUp = 0;
var myPlayer;
var opponentPlayer;
var localPlayer;

function loadProfile() {

  data = {
    name: user.displayName,
    photoUrl: user.photoUrl,
    uid: user.uid,
    gameMode: -1
  };
}

function joinGame(gameMode) {

  data.gameMode = gameMode;
  resetVariables();
  socketJoinGame(data);
  loadingView(true);
}

function resetVariables() {

  oldReadyUp = 0;
}
function leaveGame() {

  socketLeaveGame(user.id);

}

function readyUp(roomID2, data) {

  socketReadyUp(roomID2, data);

}

function newReadyUp(newReadyUps) {

  $('#readyUps').html(newReadyUps+"/2");
  if (newReadyUps > oldReadyUp ) {
    oldReadyUp = newReadyUps;
    fadeColor("readyUps", "color", "rgb(66, 244, 125)");
  }

}

function handleTurn(roomOptions) {
  if (roomOptions.turnForPlayer == socket.id) {
    hideInteractionMenu(false);
  } else if (roomOptions.turnForPlayer != socket.id) {
    hideInteractionMenu(true);
  }
}

function initializeGame(roomOptions) {
  console.log(roomOptions);
  if (roomOptions.playerOneSocket == socket.id) {
    myPlayer = 1;
  } else if (roomOptions.playerTwoSocket == socket.id) {
    myPlayer = 2;
  }

  if (myPlayer == 1) {
    //Lobby
    $('#playerNameLobby').html(roomOptions.playerOneName);
    $('#opponentNameLobby').html(roomOptions.playerTwoName);

    //In-Game
    $('#localName').html(roomOptions.playerOneName);
    $('#opponentName').html(roomOptions.playerTwoName);
    setDialoge('WHAT WILL ', roomOptions.playerOneName, ' DO?');
  } else if (myPlayer == 2) {
    //Lobby
    $('#playerNameLobby').html(roomOptions.playerTwoName);
    $('#opponentNameLobby').html(roomOptions.playerOneName);

    //In-Game
    $('#localName').html(roomOptions.playerTwoName);
    $('#opponentName').html(roomOptions.playerOneName);
    setDialoge('WHAT WILL ', roomOptions.playerTwoName, ' DO?');
  }

}
