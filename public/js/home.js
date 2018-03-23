var welcomeMessage;

var quotes = ["","","","","","",""];

$( document ).ready(function() {
  showQuote();
});

function showQuote() {

}


$('#closePopupBtn').click(function () {
  popup(false);
});

$('#joinSoloGame').click(function () {
  joinGame(0);
});
$('#settingsBtn').click(function () {
  openSettings();
});
$('#setNameBtn').click(function () {
  setNickname();
});
$('#readyBtn').click(function () {
  readyUp(roomID2);
});
