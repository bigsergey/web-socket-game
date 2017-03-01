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

server.on('request', (request) => {
  const connection = request.accept(null, request.origin);
  log(chalk.yellow(`connections: ${connection.socket.server.connections}`));

  connection.on('close', () => {
    log(chalk.yellow(`connections: ${connection.socket.server.connections}`));
  });
});