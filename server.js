var net = require('net');

var CONFIG = require('./config');

var server = net.createServer(function (socket) {
  //same as socket.on('connection', callback);
  console.log('Someone connected!');

  socket.on('data', function (chunk) {

  });

  //when socket leaves the server
  socket.on('end', function () {
    console.log('Someone left!');
  });
});

server.listen(CONFIG.PORT, function () {
  var PORT = server.address().port;
  console.log('Server listening on port', PORT);
});

server.on('error', function (error) {
  console.log(error);
});


