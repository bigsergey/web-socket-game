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

  const tickFilepath = 'http://www.wavlist.com/soundfx/020/clock-tick1.wav';
  const missTickFilepath = 'http://www.wavlist.com/soundfx/025/brass1.wav';
  const audio = new Audio();

  for(let i = 0; i < $fields.length; i++) {
    $fields[i].addEventListener('click', (e) => {
      if (!e.target.innerHTML) {
        if (gameInfo.isPlayerMove) {
          audio.src = tickFilepath;
          gameInfo.playerMoves.push(toNumber(e.target.id));
          e.target.innerHTML = gameInfo.playerSymbol;
          gameInfo.isPlayerMove = false;
        }
        else {
          audio.src = missTickFilepath;
        }
        audio.controls = true;
        audio.autoplay = true;
      }
      connection.send(JSON.stringify(gameInfo));
    })
  }
};


// ---------- Create Game Board ----------

const $overlay = document.querySelector('#overlay');
const $overlayText = document.querySelector('#overlayText');
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
      $overlay.style = 'display: none';
      GameLogic.resetBoard($container);
      addEventListenersOnGameBoard();
    }
    GameLogic.checkGameStatus(gameInfo, $overlay, $container, $overlayText);
    GameLogic.toggleWaitingOverlay(gameInfo.waitingForOtherPlayer, $waitingOverlay);
  } catch (e) {
    console.log(message.data);
    return null;
  }
};


