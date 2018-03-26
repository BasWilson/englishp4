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
        hpLocal: 100,
        hpOpponent: 100,
        moveDamage: 20,
        playerOneName: fb.roomOptions[roomID].nameOne,
        playerTwoName: fb.roomOptions[roomID].nameTwo,
        playerOneSocket: fb.roomOptions[roomID].playerOneSocket,
        playerTwoSocket: fb.roomOptions[roomID].playerTwoSocket,
        changeTurn: function () {
          if (this.turn == 0) {
            this.turn = 1;
            this.turnForPlayer = fb.roomOptions[roomID].playerOneSocket;
          } else {
            this.turn = 0;
            this.turnForPlayer = fb.roomOptions[roomID].playerTwoSocket;
          }
          io.to(roomID).emit('updateTurn', rooms[roomID]);
        },
        damageToLocal: function () {
          this.hpLocal - this.moveDamage;
        },
        damageToOpponent: function () {
          this.hpOpponent - this.moveDamage;
        },
    };

    io.to(roomID).emit('initializeGame', rooms[roomID]);

    rooms[roomID].changeTurn();

  },


    setTurn: function (roomID, data, socket, io) {

      if (rooms[roomID].turn == 0) {
      }

      //io.to(roomID).emit('startGame');
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
