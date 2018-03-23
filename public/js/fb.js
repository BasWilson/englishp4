var user;

firebase.initializeApp({
  apiKey: 'AIzaSyAKyV2xGVUznMORbq6jJBn_lCkspPAwidk',
  authDomain: 'english-battlegame.firebaseapp.com',
  projectId: 'english-battlegame'
});


$( document ).ready(function() {

  $(document).keypress(function(e) {
    if(e.which == 13) {
        login();
    }
  });

  setTimeout(function() {
    user = firebase.auth().currentUser;
    checkIfSignedIn();
  },600)

  //switchPage('mainmenu');

});

function checkIfSignedIn() {
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // Leraar is ingelogd
    loadProfile(user);

    setTimeout(function () {
      $('.splashscreenDiv').fadeOut(200);
      $('.wrapper').fadeIn(800);
    },1000)


  } else {
    // Er is niemand ingelogd
    //window.location.href = "/login";
  }
});
}


var db = firebase.firestore();

$( document ).ready(function() {



  $('#loginBtn').click(function() {
    login();
  });

});

function login(user, pass) {
  $('.wrapper').fadeOut(300);

  user = $('#userField').val();
  pass = $('#passwordField').val();
  user = user + "@glr.nl";

  firebase.auth().signInWithEmailAndPassword(user, pass).then(function(user) {
     // user signed in
     window.location.href = "/dashboard";
  }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;

      $('.wrapper').fadeIn(300);
      if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
      } else {
          alert(errorMessage);
      }
      console.log(error);
  });
}


function logout() {
  firebase.auth().signOut();
}

function setNickname() {
  nickname = $('#nicknameField').val();

    user.updateProfile({
    displayName: nickname
  }).then(function() {
    // Update successful.
    fadeColor('nicknameField','backgroundColor', 'rgb(66, 244, 125)');
  }).catch(function(error) {
    // An error happened.
    fadeColor('nicknameField','backgroundColor', 'red');
  });
}


function loadLobby(roomID, roomOptions) {
  console.log(roomID);

  var roomRef = db.collection('rooms').doc(roomID);
  var getDoc = roomRef.get()
      .then(doc => {
          if (!doc.exists) {
            popup(true, pText = 'This room does not exist');
          } else {

              roomData = doc.data();
              console.log("Data: "+roomOptions);
              $('#opponentName').html(roomOptions.nameOne);
              $('#playerName').html(roomOptions.nameTwo);
              loadingView(false);
              lobbyView(true);

          }
})

}
