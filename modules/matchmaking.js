module.exports = {

  addPlayerToQue: function (data, socket, roomID, io) {

    fb.findRoom(data, socket, roomID, io);
},

  createRoom: function (data, socket, roomID, io) {

    var random = Math.floor((Math.random() * 9999999) + 0);

    roomID = random.toString();

    fb.createRoom(data, socket, roomID, io);
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
