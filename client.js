var net = require('net');

var CONFIG = require('./config');

var socket = new net.Socket();

socket.setEncoding('utf8');

var client = socket.connect({port: CONFIG.PORT}, function () {
  //writes to client console upon connection
  console.log('You are connected!');
});

//1. when client console receives user input
process.stdin.on('data', function (chunk) {
  //2. sends input to server (and removes extra line break)
  client.write(chunk.toString().trim());
});

//3. handles incoming data from server
client.on('data', function(chunk) {
  //prints incoming data from server
  console.log(chunk);
});
