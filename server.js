// Arreglo que contendra los jugadores conectados al servidor
var tanks = [];

// Constructor de tanque
function Tank(id, cx, cy, r, f, c){
	this.id 		= id;
	this.centerX 	= cx;
	this.centerY 	= cy;
	this.radius		= r;
	this.facing		= f;
	this.color 		= c;
}

// Importamos modulo ExpressJS
var express = require('express');

// Instanciamos aplicacion Express
var app = express();

// Pnemos a escuchar nuestro servidor
var server = app.listen(3000, 'localhost', listenCallback);
function listenCallback(){
	console.log('Server escuchando en ' + server.address().address + ':' + server.address().port);
}

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/node_modules',  express.static(__dirname + '/node_modules'));

// WebSockets 
var io = require('socket.io')(server);

setInterval(heartBeat, 33);

function heartBeat(){
	io.sockets.emit('heartbeat', tanks);
}

// Callback para un un nuevo jugador se une a la partida
// Esta funcion se ejecta UNA vez por cada conexion nueva
io.sockets.on('connection', function(socket){

	console.log('Nuevo jugador conectado. ID: ' + socket.id);

	socket.on('start', function(data){
		console.log(socket.id + " " + data.cx + " " + data.cy + " " + data.r + " " + data.f + " " + data.col.r);
		var tank = new Tank(socket.id, data.cx, data.cy, data.r, data.f, data.col);
		tanks.push(tank);
	});

	socket.on('update', function(data){
		// console.log(socket.id + " " + data.cx + " " + data.cy + " " + data.r + " " + data.f + " " + data.col);
		var tank;
		for (var i = 0; i < tanks.length; i++) {
			if(socket.id == tanks[i].id){
				tank = tanks[i];
				break;
			}
		}
		tank.centerX	= data.cx;
		tank.centerY	= data.cy;
		tank.radius		= data.r;
		tank.facing		= data.f;
		tank.color 		= data.col;
	});

	socket.on('disconnect', function() {
		console.log("Un jugador se ha desconectado :(");
		for (var i = 0; i < tanks.length; i++) {
			if(socket.id == tanks[i].id){
				tanks.splice(i,1);
				break;
			}
		}
	});
});

