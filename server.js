var net = require('net');

var CONFIG = require('./config');

var onlineUsers = 0;

var allSockets = [];

var allUsernames = [];

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
      socket.write('[ADMIN]: Welcome to the chatroom: ' +  socket.remoteAddress.slice(7) + ':' + socket.remotePort + '. Current users online: ' + onlineUsers  + '\n' +'Please select a username: ');
    }else{ //send to other connected clients
      allSockets[i].write('[ADMIN]: A user has entered the chat room. Current users online: ' + onlineUsers);
    }
  }

  //handles incoming data from client
  socket.on('data', function (chunk) {
    //check that socket does not have username property
    if (!socket.username){
      //if username already exists in allUsernames array or user wants to be ADMIN/admin
      if (allUsernames.indexOf(chunk) !== -1 || chunk.toLowerCase() === 'ADMIN'){
        socket.write('[ADMIN]: That name is taken! Choose another: ');
      }else{
        allUsernames.push(chunk); //add username to allUsernames array
        socket.username = chunk; //assign username as property in socket
        socket.write('[ADMIN]: A fine name! You shall now be known as: ' +  socket.username);
      }
    }else{
      //writes to server console
      console.log('[' + socket.username + ']: ' + chunk);
      //send data that has been received back to client
      for (var i = 0; i < allSockets.length; i++) {
        if (allSockets[i] === socket){ //for client that sent the message
          socket.write('[YOU]: ' + chunk);
        }else{ //send to other connected clients
          allSockets[i].write('[' + socket.username + ']: ' + chunk);
        }
      }
    }
  });

  //when client leaves the server
  socket.on('end', function () {
    onlineUsers--;
    //display on server
    console.log(socket.remoteAddress.slice(7) + ':' + socket.remotePort + ' has left the chat room. Current users online: ' + onlineUsers);

    //remove client from allSockets array
    var goodbye = allUsernames.indexOf(socket.username);
    var remove = allSockets.indexOf(socket);
    allSockets.splice(remove, 1);

    //send to remaining connected clients else
    for (var i = 0; i < allSockets.length; i++) {
      allSockets[i].write('[ADMIN]: ' + allUsernames[goodbye] + ' has left the chat room. Current users online: ' + onlineUsers);
    }

    //remove client from allUsernames array
    allUsernames.splice(goodbye, 1);
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