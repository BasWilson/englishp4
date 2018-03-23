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
