import './style.scss';
import {toNumber} from 'lodash';
import GameLogic from './gameLogic';

const GAME_INFO = 'GAME_INFO';
const TOGGLE_WAITING_OVERLAY = 'TOGGLE_WAITING_OVERLAY';
const WEB_SOCKET_ADDRESS = `ws://${window.location.hostname}:1337`;


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

const $app = document.querySelector('#app');
const $waitingOverlay = document.querySelector('#waiting-overlay');
const $container = document.querySelector('#container');

GameLogic.drawBoardGame($container);


// ---------- Game ----------

let gameInfo = null;
const $fields = document.getElementsByClassName('field');


connection.onmessage = (message) => {
  try {
    if (JSON.parse(message.data).type === GAME_INFO) {
      gameInfo = JSON.parse(message.data);
      GameLogic.checkGameStatus(gameInfo, $app, $container)
    }
    if (JSON.parse(message.data).type === TOGGLE_WAITING_OVERLAY) {
      GameLogic.hideWaitingOverlay($waitingOverlay)
    }
  } catch (e) {
    console.log(message.data);
    return null;
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
