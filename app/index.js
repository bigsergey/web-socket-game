import './style.scss';
import {toNumber} from 'lodash';
import GameLogic from './gameLogic';

const WEB_SOCKET_ADDRESS = 'ws://127.0.0.1:1337';

// if user is running mozilla then use it's built-in WebSocket
window.WebSocket = window.WebSocket || window.MozWebSocket;

const connection = new WebSocket(WEB_SOCKET_ADDRESS);

connection.onopen = function () {
  // connection is opened and ready to use
};

connection.onerror = function (error) {
  // an error occurred when sending/receiving data
};



// ---------- Create Game Board ----------

const $container = document.querySelector('#container');
const $app = document.querySelector('#app');

GameLogic.drawBoardGame($container);


// ---------- Game ----------

let gameInfo = null;
const $fields = document.getElementsByClassName('field');

connection.onmessage = (message) => {
  try {
    gameInfo = JSON.parse(message.data);
    GameLogic.drawOpponentMoves(gameInfo.opponentMoves, gameInfo.opponentSymbol, $container);
    GameLogic.checkGameResult(gameInfo.playerMoves, gameInfo.opponentMoves, $app);
  } catch (e) {
    console.log('This doesn\'t look like a valid JSON: ', message.data);
    return;
  }
};

for(let i = 0; i < $fields.length; i++) {
  $fields[i].addEventListener('click', (e) => {
    if (!e.target.innerHTML) {
      if (gameInfo.isPlayerMove) {
        gameInfo.playerMoves.push(toNumber(e.target.id));
        e.target.innerHTML = gameInfo.playerSymbol;
        gameInfo.isPlayerMove = false;
      }
    }

    connection.send(JSON.stringify(gameInfo));
  })
}
