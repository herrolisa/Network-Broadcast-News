var net = require('net');

var CONFIG = require('./config');

var onlineUsers = 0;

var allSockets = [];

var server = net.createServer(function (socket) {
  //same as socket.on('connection', callback);
  onlineUsers++;
  socket.setEncoding('utf8');

  //add conencted clients to array of all sockets
  allSockets.push(socket);

  //display on server
  console.log(socket.remoteAddress.slice(7) + ':' + socket.remotePort + ' has entered the chat room. Current users online: ' + onlineUsers);

  //send to connected clients
  for (var i = 0; i < allSockets.length; i++) {
    if (allSockets[i] === socket){ //send to client who has connected
      socket.write('[ADMIN]: Welcome to the chatroom: ' +  socket.remoteAddress.slice(7) + ':' + socket.remotePort + '. Current users online: ' + onlineUsers);
    }else{ //send to other connected clients
      allSockets[i].write('[ADMIN]: ' + socket.remoteAddress.slice(7) + ':' + socket.remotePort + ' has entered the chat room. Current users online: ' + onlineUsers);
    }
  }

  //handles incoming data from client
  socket.on('data', function (chunk) {
    //writes to server console
    console.log('SERVER BCAST FROM: ' + socket.remoteAddress.slice(7) + ':' + socket.remotePort + ': ' + chunk);
    //send data that has been received back to client
    for (var i = 0; i < allSockets.length; i++) {
      if (allSockets[i] === socket){ //for client that sent the message
        socket.write('YOU: ' + chunk);
      }else{ //send to other connected clients
        allSockets[i].write(socket.remoteAddress.slice(7) + ':' + socket.remotePort + ': ' + chunk);
      }
    }
  });

  //when client leaves the server
  socket.on('end', function () {
    onlineUsers--;
    //display on server
    console.log(socket.remoteAddress.slice(7) + ':' + socket.remotePort + ' has left the chat room. Current users online: ' + onlineUsers);

    //remove client from array
    var remove = allSockets.indexOf(socket);
    allSockets.splice(remove, 1);

    //send to remaining connected clients else
    for (var i = 0; i < allSockets.length; i++) {
      allSockets[i].write('[ADMIN]: ' + socket.remoteAddress.slice(7) + ':' + socket.remotePort + ' has left the chat room. Current users online: ' + onlineUsers);
    }
  });
});

server.listen(CONFIG.PORT, function () {
  var PORT = server.address().port;
  console.log('Server listening on port', PORT);
});

server.on('error', function (error) {
  console.log(error);
});

//add admin broadcast: when server console receieves input, broadcast to all connected sockets
process.stdin.on('data', function (chunk) {
  for (var i = 0; i < allSockets.length; i++) {
    allSockets[i].write('[ADMIN]: ' + chunk.toString().trim());
  }
});