module.exports = {

  startGame: function (roomID, data, socket, io) {

    console.log(data);
    console.log('game starting');
    fb.setGameStatus(roomID, data, socket, io);
    this.setRoomVariables(roomID, data, socket, io);
},

  setRoomVariables: function (roomID, data, socket, io) {

    //Create the room object.
    rooms[roomID] = {
        turn: 0,
        turnForPlayer: 0,
        playerOneHP: 100,
        playerTwoHP: 100,
        playerOneName: fb.roomOptions[roomID].nameOne,
        playerTwoName: fb.roomOptions[roomID].nameTwo,
        playerOneSocket: fb.roomOptions[roomID].playerOneSocket,
        playerTwoSocket: fb.roomOptions[roomID].playerTwoSocket,
        changeTurn: function () {
          if (rooms[roomID].turn == 0) {
            rooms[roomID].turn = 1;
            rooms[roomID].turnForPlayer = fb.roomOptions[roomID].playerOneSocket;
          } else {
            rooms[roomID].turn = 0;
            rooms[roomID].turnForPlayer = fb.roomOptions[roomID].playerTwoSocket;
          }
          io.to(roomID).emit('updateTurn', rooms[roomID]);
        },
        damageToPlayerOne: function (damage) {
          var newHP = rooms[roomID].playerOneHP - damage;
          rooms[roomID].playerOneHP = newHP;
        },
        damageToPlayerTwo: function (damage) {
          var newHP = rooms[roomID].playerTwoHP - damage;
          rooms[roomID].playerTwoHP = newHP;
        },
    };

    io.to(roomID).emit('initializeGame', rooms[roomID]);

    rooms[roomID].changeTurn();

  },


    attack: function (roomID, attack, socket, io) {

      if (rooms[roomID].turnForPlayer == rooms[roomID].playerOneSocket) {

        //Player one attacks player two
        rooms[roomID].damageToPlayerTwo(attack);

      } else if (rooms[roomID].turnForPlayer == rooms[roomID].playerTwoSocket) {

        //Player two attacks player one
        rooms[roomID].damageToPlayerOne(attack);

      } else {
        //Player probably tried to attack without having permission
      }

      rooms[roomID].changeTurn();
      
      //Let lobby know there has been an attack
      io.to(roomID).emit('attacked', rooms[roomID], attack);

  },

};

var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path')
var io = require('socket.io')(http);
var sha256 = require('js-sha256');
var randomFloat = require('random-float');

//Modules
var fb = require('./fb');

var rooms = {};
var currentRoom;
