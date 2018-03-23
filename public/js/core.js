/*
* Globale variablen
*/
var currentView;
var data;


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
  socketJoinGame(data);
  loadingView(true);

}

function leaveGame() {

  socketLeaveGame(user.id);

}

function readyUp(roomID2, data) {

  socketReadyUp(roomID2, data);

}

function newReadyUp(newReadyUps) {
  $('#readyUps').html(newReadyUps+"/2");
  fadeColor("readyUps", "color", "rgb(66, 244, 125)");
}
