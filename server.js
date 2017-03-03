const webSocketsServerPort = 1337;
const WebSocketServer = require('ws').Server;
const http = require('http');
const chalk = require('chalk');
const log = console.log;

const FIRST_PLAYER_SYMBOL = 'X';
const SECOND_PLAYER_SYMBOL = 'O';

server = new WebSocketServer({port: webSocketsServerPort}, () => {
  log(chalk.green(`Server is listening on port: ${webSocketsServerPort}`));
});

let connectionsCounter = 0;
const playerOne = {
  'id': 1,
  'isPlayerMove': true,
  'playerMoves': [],
  'opponentMoves': [],
  'playerSymbol': FIRST_PLAYER_SYMBOL,
  'opponentSymbol': SECOND_PLAYER_SYMBOL,
};
const playerTwo = {
  'id': 2,
  'isPlayerMove': false,
  'playerMoves': [],
  'opponentMoves': [],
  'playerSymbol': SECOND_PLAYER_SYMBOL,
  'opponentSymbol': FIRST_PLAYER_SYMBOL,
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

  ws.on('message', (data) => {
    const gameInfo = JSON.parse(data);
    if (gameInfo.id === 1) {
      server.clients.forEach(client => {
        if (client._ultron.id === 1) {
          playerOne.isPlayerMove = gameInfo.isPlayerMove;
          playerOne.playerMoves = gameInfo.playerMoves;
          client.send(JSON.stringify(playerOne));
        }
        if (client._ultron.id === 2) {
          playerTwo.isPlayerMove = !gameInfo.isPlayerMove;
          playerTwo.opponentMoves = gameInfo.playerMoves;
          client.send(JSON.stringify(playerTwo));
        }
      });
    }
    if (gameInfo.id === 2) {
      server.clients.forEach(client => {
        if (client._ultron.id === 1) {
          playerOne.isPlayerMove = !gameInfo.isPlayerMove;
          playerOne.opponentMoves = gameInfo.playerMoves;
          client.send(JSON.stringify(playerOne));
        }
        if (client._ultron.id === 2) {
          playerTwo.isPlayerMove = gameInfo.isPlayerMove;
          playerTwo.playerMoves = gameInfo.playerMoves;
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