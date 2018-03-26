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
    privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDdTvhqjENqaKTl\nFVuLbTM2dM2+z7at7QUDCjuBIK4VkXNmKrbPd7bnc5Fm26y2cs/yeIS0PyONj32+\ntBKatqXITfXO35+phSjSJBA0iGEdG17E4l0udbHjP9XxiBh6k79QcAEhkCBVHyr1\nfLQIgJmO+lq8BgeAuhKEGpgw5BsyUuPFGph+Q1AOFo+XpLv3tKWcHntDh/O7ltvQ\nSbocO9BM9tLX0L1OAUF7IiLU7i4+ziTto7dolRRo3MHLMRHAhBxmjgPOg/0jqs+Z\nbFSFAinbqa583F4rcF2B3OKlI+rbVMheOeMEs32JGV/WABxQUdQggK0+WNk3DBwX\n/O/wLAOVAgMBAAECggEAB1PoEc8XJFzWqOcuIs241mLDtT+3csbYVaNvGPV2DizE\nv2tGplP2cG95LwizDU975zFqY3V7veI0ba4Ut564motKSlFJPhm0olCjYLnrTUVs\nu+Qq5bDr9PRWJys0dEqUGRu8Tdox19+yUnKQm392li9f9b3VXcPLfShMRcInzGC2\ndjImW/4d2xMtXK9+Z+E0d13fQSgpRyMWWCKxj/AS764JsOAVOsVYEDLEFv/Cp6C6\nl9zLcYW8NRxCSLjuobNi8fNcN1EizbxAf8DNWfIbXeK0msBRwqYLb3ASnj5zWaW+\nrSdqFccj/84vHX+Ls/ca5MGaehQlPoATrdJJwMdsgQKBgQD5nWeIYANXNNhbjFTO\n9ffl3zhyWYuPyLxL3A+i0vVI/S4+qcrfPyIiwlDBFkOHACWTgRMEKY5N0fZHET2l\nlLDipA2Q0NZYOdE/arhXfuuFPpHCwbGLXCrcNbRF0h13oCHiu69SCKX352qpHDNX\nNUCSq/r6LQJgVRoMmP4WUAzRhQKBgQDi+DPSwXesQw9vSFIoER6gDcml7omrhc3h\n6yN51i1qUcrGzNcjUzpVCxCUvI+PfIx27bL+eaM9K32OMarT6YXCczA1VFiwm6Cs\nQl5yMzfBor9iPUy9OXg5KNMxqwZDFkMjlRTrclo69iEJ0NgwhKzgu/RysTwgU8BB\nStsJZXf+0QKBgQDeq/Ly7iusvMCREmOJaFSnZHS3VXgxYPHQflQYfTZA0VJSpicK\n9gfemBdv2AuPP6tFpWwwV13RwA6BoTisIDOXSp+rYxEDDTjD6NDfhKJXb9SZty5J\n0oONg/74FhMhZuEzoRgqBvr/Zhp5F2YZUrDy5qZyTHqFMwWU3Vo0z15P/QKBgQCw\neAB7DfdJFT7L7DQMePsRwIaXH/ckSD2COPt1QERBVOTPWvauvYguFRNIQa9xBYqE\n8V1pJBP6fHT7eLx0VS2tuTezTyhB8E6lgFjEe/QO9sXM0RJ4UVWbQ5WpGWseABIl\neUUxptBm5XVcl2dvmch8V0bBYfH4xIVHfrb9AEqi8QKBgHRTb0bG4ro/ZzvQzxYX\nB6WDyAfCVh5ANKnbvjNBHtMPUZz5YPiFKOW+BP+2mJWEgeMWnGtAK7Hquon2S4JL\ngMFqncXHbjo2hC10/YnnAO2JqMvZURjLSr4L6JTsTiuOo9v2htD8Ijp4JH5kzQdG\nwnbsuJiLvwYsNZw9buzajRVo\n-----END PRIVATE KEY-----\n'
  }),
  databaseURL: 'https://english-battlegame.firebaseio.com'
});


var refreshToken; // Get refresh token from OAuth2 flow

// Get a reference to the database service
var db = admin.firestore();
