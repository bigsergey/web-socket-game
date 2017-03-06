const webSocketsServerPort = 1337;
const WebSocketServer = require('ws').Server;
const http = require('http');
const chalk = require('chalk');
const log = console.log;
const {remove} = require('lodash');

const FIRST_PLAYER_SYMBOL = 'X';
const SECOND_PLAYER_SYMBOL = 'O';

const GAME_INFO = 'GAME_INFO';
const TOGGLE_WAITING_OVERLAY = 'TOGGLE_WAITING_OVERLAY';

server = new WebSocketServer({port: webSocketsServerPort}, () => {
  log(chalk.green(`Server is listening on port: ${webSocketsServerPort}`));
});


let clientsArray = [];
const playerOne = {
  'type': GAME_INFO,
  'id': 0,
  'isPlayerMove': true,
  'playerMoves': [],
  'opponentMoves': [],
  'playerSymbol': FIRST_PLAYER_SYMBOL,
  'opponentSymbol': SECOND_PLAYER_SYMBOL,
  'waitingForOtherPlayer': true,
};
const playerTwo = {
  'type': GAME_INFO,
  'id': 0,
  'isPlayerMove': false,
  'playerMoves': [],
  'opponentMoves': [],
  'playerSymbol': SECOND_PLAYER_SYMBOL,
  'opponentSymbol': FIRST_PLAYER_SYMBOL,
  'waitingForOtherPlayer': true,
};

server.on('connection', (ws) => {
  clientsArray.push(ws);
  log(chalk.yellow(`connections: ${clientsArray.length}`));

  if (clientsArray[0]) {
    playerOne.id = clientsArray[0]._ultron.id;
    clientsArray[0].send(JSON.stringify(playerOne));
  }
  if (clientsArray[1]) {
    playerTwo.id = clientsArray[1]._ultron.id;
    clientsArray[1].send(JSON.stringify(playerTwo));
  }

  if (clientsArray.length >= 2) {
    clientsArray.forEach(client => {
      client.send(JSON.stringify({'type' : TOGGLE_WAITING_OVERLAY}))
    })
  }

  ws.on('message', (data) => {
    const gameInfo = JSON.parse(data);
    if (gameInfo.id === playerOne.id) {
      if (clientsArray[0]) {
        playerOne.isPlayerMove = gameInfo.isPlayerMove;
        playerOne.playerMoves = gameInfo.playerMoves;
        clientsArray[0].send(JSON.stringify(playerOne));
      }
      if (clientsArray[1]) {
        playerTwo.isPlayerMove = !gameInfo.isPlayerMove;
        playerTwo.opponentMoves = gameInfo.playerMoves;
        clientsArray[1].send(JSON.stringify(playerTwo));
      }
    }
    if (gameInfo.id === playerTwo.id) {
      if (clientsArray[0]) {
        playerOne.isPlayerMove = !gameInfo.isPlayerMove;
        playerOne.opponentMoves = gameInfo.playerMoves;
        clientsArray[0].send(JSON.stringify(playerOne));
      }
      if (clientsArray[1]) {
        playerTwo.isPlayerMove = gameInfo.isPlayerMove;
        playerTwo.playerMoves = gameInfo.playerMoves;
        clientsArray[1].send(JSON.stringify(playerTwo));
      }
    }
  });

  ws.on('close', () => {
    clientsArray = remove(clientsArray, client => {
      return client._ultron;
    });
    log(chalk.yellow(`connections: ${clientsArray.length}`));
  });
});