const webSocketsServerPort = 1337;
const WebSocketServer = require('websocket').server;
const http = require('http');
const chalk = require('chalk');
const log = console.log;

// create the server
server = new WebSocketServer({
  httpServer: http.createServer().listen(webSocketsServerPort, () => {
    log(chalk.green(`Server is listening on port: ${webSocketsServerPort}`));
  })
});

const simpleData = JSON.stringify({
  x: 'x',
  o: 'o'
});

server.on('request', (request) => {
  const connection = request.accept(null, request.origin);
  log(chalk.yellow(`connections: ${connection.socket.server.connections}`));

  connection.sendUTF('asd');
  connection.send(simpleData);

  connection.on('message', (data) => {
    log(chalk.blue(JSON.parse(data.utf8Data)));
  });

  connection.on('close', () => {
    log(chalk.yellow(`connections: ${connection.socket.server.connections}`));
  });
});