module.exports = {

  createRoom: function (data, socket, roomID, io) {

    roomOptions[roomID] = {
        id: roomID,
        gameMode: data.gameMode,
        status: 0,
        currentPlayers: 1,
        maxPlayers: 2,
        playerOne: data.uid,
        playerTwo: "OPPONENT",
        playerOneSocket: socket.id,
        playerTwoSocket: "OPPONENT SOCKET",
        nameOne: data.name,
        nameTwo: 0,
        ready: 0
      };

      db.collection("rooms").doc(roomID).set(roomOptions[roomID]).then(function() {
          console.log('Room '+roomID+' Created');
          openRooms.push(roomID);

          //Let the user know he/she joined the room
          socket.emit('roomJoined', roomID, roomOptions[roomID]);
          socket.join(roomID);
      });

  },

    joinRoom: function (data, socket, roomID) {

      //Delete the room from the array because its now full
      tools.removeFromArray(openRooms, roomID);
      console.log('Joined room: '+roomID);

      //Add playerTwo to the room in the DB and Local variable
      roomOptions[roomID].playerTwo = data.uid;
      roomOptions[roomID].playerTwoSocket = socket.id;
      roomOptions[roomID].nameTwo = data.name;


      var roomRef = db.collection('rooms').doc(roomID);
      var room = roomRef.set({
        playerTwo: data.uid,
        playerTwoSocket: socket.id,
        nameTwo: data.name
      }, { merge: true });

      //Let the user know he/she joined the room
      socket.emit('roomJoined', roomID, roomOptions[roomID]);
      socket.join(roomID);

    },

    findRoom: function (data, socket, roomID) {

      console.log('Player is searching for a match');
      //If there are no rooms we create one
      if (openRooms == "") {
        que.createRoom(data, socket, roomID);
        console.log('No rooms found, creating a new one.');
      } else if (openRooms.length > 0) {
        //If there are rooms, we join the first one in the array
        roomID = openRooms[0];
        console.log('Room found, joining room: ' + roomID);
        this.joinRoom(data, socket, roomID);
      }

    },

    readyUp: function (roomID, data, socket, io) {

      var roomRef = db.collection('rooms').doc(roomID);
      var getDoc = roomRef.get()
          .then(doc => {
              if (!doc.exists) {
                console.log('this no exist ;0');
              } else {

                  roomData = doc.data();
                  var readyUps = roomData.ready;

                  if (readyUps >= 2) {
                    //
                  } else {
                    readyUps++;
                  }
                  if (readyUps == 2) {
                    this.exportVariables();

                    var room = roomRef.set({
                      ready: readyUps
                    }, { merge: true });
                    game.startGame(roomID, data, socket, io);
                    tools.removeFromArray(openRooms, roomID);
                  } else {
                    //Ready up
                    var room = roomRef.set({
                      ready: readyUps
                    }, { merge: true });

                  }
              }
    })



    },

    setGameStatus: function (roomID, data, socket, io) {

      var roomRef = db.collection('rooms').doc(roomID);

      var getDoc = roomRef.get()
          .then(doc => {
              if (!doc.exists) {
                console.log('this no exist ;0');
              } else {

                  roomData = doc.data();

                  var status = 1;

                  var room = roomRef.set({
                    status: status
                  }, { merge: true });
                  io.to(roomID).emit('gameStarted');
                  activeGames.push(roomID); // add to the active games to handle the game.
              }
    })



    },

    exportVariables : function () {
      module.exports.roomOptions = roomOptions;
    },


};

var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path')
var io = require('socket.io')(http);

var openRooms = [];

var activeGames = [];
var roomOptions = {};

//Modules
var fb = require('./fb');
var que = require('./matchmaking');
var tools = require('./tools');
var game = require('./game');

//ADMIN
var admin = require('firebase-admin');
var serviceAccount = require('../keys/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'english-battlegame',
    clientEmail: 'firebase-adminsdk-dbeca@english-battlegame.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD3BS1QZNOFe9FU\ndt8OqTQuY/L09xY/qtz1PRhytirMdVgB3RQsiUoddKPXBZ9NVUg3QNA8BHvJzYZK\nE1IbA+rPHvEVIANtkWXqj4tWU2GUzxf21fvm0LIsxVSG6byXxZpDXKwiaKytbUhk\n7TA5D/ks1cWjqfX7R2z0H4i2Gva4RYajnYcfC9tEv9RVr0w91+RztGvLgnIuTOqr\nb/g/avezIAdlUsp0+MPYp4/fRGH1+U1oeT8UIB3be2VHe+Prw3Lw8ZzIU1HTOsx2\n3fGBrPb6kTyp3zxXKNAEIgvBeTuOI7VUZoy0AB651K/eKUAc/bDs5q6Yrf3bkTQ+\nneehy85nAgMBAAECggEABUN5G39PYPj9toLSc/QstEGSng9RcyKjZmzPVCm5/hZ0\n+nLAtYN0GHPNVvywxPQVFfwlWrpjeAGU6VtuNhAzWT8aXdOcES1SL6GlOk7D7WjT\nET920N/5pbTs0KW+TDQNPTw4VecEUFQp2gHrVOs/Y7Jb/lO0gQkiX4Lh5eCHYkhL\n1ABMU/Rtk4Wzaqy1Rwi3FS/Q8GfYT8hx1xIXg8UIF6l3pTj/mqkYbCnr5bQFbqPv\nFK/t+2VUSr6eeHJCBc4HPbYwT9Ryp6iRGRNP4m63gC7sFgfuHEW82T04vBQqZYKb\n7RbeTThpNyVt9F0x0hUha2ZbrkTH0x/W+9V1mNxVIQKBgQD/VcfyGTZj9NXKxCGv\nbNQ9Gc/qvCSw87ZKsXx08nfCWWa6ZFsmxPoUO2p7XUjBJTDo3827CWU2O9nzJ+ix\n+qOnLm8sZiVzJaWGUW58IbDzD2eHjwYUZrtlIWR1OlG2UCYUbDH/3exas0pgRrhh\n3d3vCgC7Hm62BnkqvkTz3VsfsQKBgQD3qdpV/JXMD+jD7SxqMjbTb+7oAynQ4xg2\nXL+TBw+4QYz8K18F11oPFWBkwBpYVNUVtnMnfHlNXBD3rbx9wJ+JVazYUEgtxbl6\n7YMMjDqwxjDKoih5mzA3AL58SEM52qm/iWE1SBDxrFtjCYh9hfUmw/12/j1Ngj9q\nL5UQvJotlwKBgQCpl0czhQ18PJ1XjQe2pbkeUCuqBIb2RRlZ6SL55iYnHww9VvS3\n/nL/xysFf0MYjmQ6+JOD3EyuRfiQKXzD4e6a1xueSMYtAd88JJAWwKXv+tZP0m4+\nVLG5DQHVXwPw7LEuNWLMSJF4+Ma4xaAn2J5U67bqkd8E5a3K9w+DTg39MQKBgCSg\nPeXRgOW4xJeVD6h03J7QQuiU7y4xJ3eCp+I6fRymtQ7l6xuWCX+JjcPYlQzTHuAj\nJ0yDn/zMzMWUL/f48J8CyJkE5me+gfun/GVyp4tVBAoziQDS7oJz3bfLiAWaTNhC\nnNmgWsEi2DEBS+okUWj2OxnJ54764B34A3eCLNrpAoGAO8198PWAdUSjaB4+uDTB\nCqNeeOXtBQSbWB5rG7Pz5/Im8mP6dzw0z7+ozXzSICHO/r0X6atXyWagLoTINvKF\naRWoTnFnXJIgPGb5VqC+RbwQP5D4C8o64KLHLSw/rGwLV+mCUEHsLuriQ20ZrmFX\nz+mMN8QgVgUS3bvIGy8w8Rc=\n-----END PRIVATE KEY-----\n'
  }),
  databaseURL: 'https://english-battlegame.firebaseio.com'
});


var refreshToken; // Get refresh token from OAuth2 flow

// Get a reference to the database service
var db = admin.firestore();
