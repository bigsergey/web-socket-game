import './style.scss';
import {toNumber} from 'lodash';
import GameLogic from './gameLogic';

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


const addEventListenersOnGameBoard = () => {
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
};


// ---------- Create Game Board ----------

const $app = document.querySelector('#app');
const $waitingOverlay = document.querySelector('#waiting-overlay');
const $container = document.querySelector('#container');
const $fields = document.getElementsByClassName('field');

GameLogic.drawBoardGame($container);
addEventListenersOnGameBoard();

// ---------- Game ----------

let gameInfo = null;

connection.onmessage = (message) => {
  try {
    gameInfo = JSON.parse(message.data);
    if (!gameInfo.opponentMoves.length && !gameInfo.playerMoves.length) {
      GameLogic.resetBoard($container);
      addEventListenersOnGameBoard();
    }
    GameLogic.checkGameStatus(gameInfo, $app, $container);
    GameLogic.toggleWaitingOverlay(gameInfo.waitingForOtherPlayer, $waitingOverlay);
  } catch (e) {
    console.log(message.data);
    return null;
  }
};


