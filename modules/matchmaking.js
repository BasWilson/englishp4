module.exports = {

  addPlayerToQue: function (data, socket, roomID) {

    fb.findRoom(data, socket, roomID);
},

  createRoom: function (data, socket, roomID) {

    var random = Math.floor((Math.random() * 9999999) + 0);

    roomID = random.toString();

    fb.createRoom(data, socket, roomID);
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
