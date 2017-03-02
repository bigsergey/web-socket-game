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

let connectionsCounter = 0;

server.on('request', (request) => {
  const connection = request.accept(null, request.origin);
  connectionsCounter++;

  log(chalk.yellow(`connections: ${connectionsCounter}`));

  connection.sendUTF('asd');
  connection.send(simpleData);

  connection.on('message', (data) => {
    log(chalk.blue(JSON.parse(data.utf8Data)));
  });

  connection.on('close', () => {
    connectionsCounter--;
    log(chalk.yellow(`connections: ${connectionsCounter}`));
  });
});