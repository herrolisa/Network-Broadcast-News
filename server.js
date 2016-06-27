var net = require('net');

var CONFIG = require('./config');

var onlineUsers = 0;

var server = net.createServer(function (socket) {
  //same as socket.on('connection', callback);
  onlineUsers++;
  console.log('A new user has entered the chat room. Current users online: ' + onlineUsers);

  socket.setEncoding('utf8');

  //handles incoming data to server
  socket.on('data', function (chunk) {
    //writes to server console and remove extra line break
    console.log('SERVER BCAST FROM: ' + socket.remoteAddress + ':' + socket.remotePort + ': ' + chunk);
    //send data that has been received to client
    socket.write(socket.remoteAddress + ':' + socket.remotePort + ': ' + chunk);
  });

  //when client leaves the server
  socket.on('end', function () {
    onlineUsers--;
    console.log('A user has left the chat room. Current users online: ' + onlineUsers);
  });
});

server.listen(CONFIG.PORT, function () {
  var PORT = server.address().port;
  console.log('Server listening on port', PORT);
});

server.on('error', function (error) {
  console.log(error);
});