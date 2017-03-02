const webSocketsServerPort = 1337;
const WebSocketServer = require('ws').Server;
const http = require('http');
const {intersection} = require('lodash');
const chalk = require('chalk');
const log = console.log;


server = new WebSocketServer({port: webSocketsServerPort}, () => {
  log(chalk.green(`Server is listening on port: ${webSocketsServerPort}`));
});

let connectionsCounter = 0;
let playerOne = {
  'id': 1,
  'isPlayerMove': true,
  'playerMoves': [],
  'opponentMoves': [],
  'playerSymbol': 'X',
};
let playerTwo = {
  'id': 2,
  'isPlayerMove': false,
  'playerMoves': [],
  'opponentMoves': [],
  'playerSymbol': 'O',
};

server.on('connection', (ws) => {
  connectionsCounter++;
  log(chalk.yellow(`connections: ${connectionsCounter}`));

  server.clients.forEach(client => {
    if (client._ultron.id === 1) {
      client.send(JSON.stringify(playerOne));
    }
    if (client._ultron.id === 2) {
      client.send(JSON.stringify(playerTwo));
    }
  });

  ws.on('message', (msg) => {
    log(chalk.blue(msg));
    if (msg['id'] === 1) {
      server.clients.forEach(client => {
        if (client._ultron.id === 1) {
          playerOne.isPlayerMove = msg['isPlayerMove'];
          playerOne.playerMoves = msg['playerMoves'];
          client.send(JSON.stringify(playerOne));
        }
        if (client._ultron.id === 2) {
          playerTwo.isPlayerMove = !msg['isPlayerMove'];
          playerTwo.playerMoves = msg['opponentMoves'];
          client.send(JSON.stringify(playerTwo));
        }
      });
    }
    if (msg['id'] === 2) {
      server.clients.forEach(client => {
        if (client._ultron.id === 1) {
          playerOne.isPlayerMove = !msg['isPlayerMove'];
          playerOne.playerMoves = msg['opponentMoves'];
          client.send(JSON.stringify(playerOne));
        }
        if (client._ultron.id === 2) {
          playerTwo.isPlayerMove = msg['isPlayerMove'];
          playerTwo.playerMoves = msg['playerMoves'];
          client.send(JSON.stringify(playerTwo));
        }
      });
    }
  });

  ws.on('close', () => {
    connectionsCounter--;
    log(chalk.yellow(`connections: ${connectionsCounter}`));
  });
});