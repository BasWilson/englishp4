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
  } else if (myPlayer == 2) {
    //Lobby
    $('#playerNameLobby').html(roomOptions.playerTwoName);
    $('#opponentNameLobby').html(roomOptions.playerOneName);

    //In-Game
    $('#localName').html(roomOptions.playerTwoName);
    $('#opponentName').html(roomOptions.playerOneName);
  }
}

function updateUI(roomOptions) {
  if (myPlayer == 1) {
    $('#playerHP').html("HP "+roomOptions.playerOneHP+"/100");
    $('#opponentHP').html("HP "+roomOptions.playerTwoHP+"/100");
  } else if (myPlayer == 2) {
    $('#playerHP').html("HP "+roomOptions.playerTwoHP+"/100");
    $('#opponentHP').html("HP "+roomOptions.playerOneHP+"/100");
  }

  handleTurn(roomOptions);
}

function attack(attack) {
  var roomID = roomID2;
  attack = 20;
  socketAttack(roomID, attack);
}

function handleAttack(roomOptions, attack) {

  if (roomOptions.playerOneHP <= 0 || roomOptions.playerTwoHP <= 0) {
    setMultilineDialoge(lines = ['The monster has fainted...','Player '+getAttacker(roomOptions)+' has won the battle!', ])
  } else {
    socket.emit('attackDone', roomID2);
  }
  updateUI(roomOptions);
  console.log(roomOptions);
}

function getAttacker(roomOptions, attacker) {

  if (roomOptions.turnForPlayer == roomOptions.playerOneSocket) {
    attacker = roomOptions.playerOneName;
  } else if (roomOptions.turnForPlayer == roomOptions.playerOneSocket) {
    attacker = roomOptions.playerTwoName;
  }
  return attacker;
}

var effectiveDialoge = ["What an attack!", "That was super powerfull!"];
var faintedDialoge = ["has fainted...", "got knocked out"];
var wonDialoge = ["has won!", "won that battle!"];
var trainerDialoge = ["Hey! I'm going to beat your ass today!", "Goodluck, have fun!", "May the best trainer win!", "Do I know you?"];
