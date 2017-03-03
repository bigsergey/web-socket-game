import './style.scss';
import {toNumber, last} from 'lodash';
import GameLogic from './gameLogic';

const WEB_SOCKET_ADDRESS = 'ws://127.0.0.1:1337';
const NUMBER_OF_FIELDS = 9;

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

const fieldsArray = Array.from(Array(NUMBER_OF_FIELDS).keys());
const $container = document.querySelector('#container');
const $app = document.querySelector('#app');

fieldsArray.forEach(item => {
  $container.insertAdjacentHTML('beforeend', `<div id="${item}" class="field"></div>`)
});


// ---------- Game ----------
let gameInfo = null;
const $fields = document.getElementsByClassName('field');

const drawOpponentMoves = (opponentMoves) => {
  const opponentLastMove = last(opponentMoves);
  $container.children[opponentLastMove].innerHTML = gameInfo.opponentSymbol;
};


connection.onmessage = (message) => {
  try {
    gameInfo = JSON.parse(message.data);
    drawOpponentMoves(gameInfo.opponentMoves);
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

    // console.log(firstPlayerMoves, secondPlayerMoves);
    // if (GameLogic.checkPlayerMoves(firstPlayerMoves)) {
    //   $app.insertAdjacentHTML('afterbegin', `<div class="overlay">First player won!</div>`);
    // }
    // if (GameLogic.checkPlayerMoves(secondPlayerMoves)) {
    //   $app.insertAdjacentHTML('afterbegin', `<div class="overlay">Second player won!</div>`);
    // }
    //
    // if (firstPlayerMoves.length + secondPlayerMoves.length === 9 && !GameLogic.checkPlayerMoves(firstPlayerMoves) && !GameLogic.checkPlayerMoves(secondPlayerMoves)) {
    //   $app.insertAdjacentHTML('afterbegin', `<div class="overlay">Draw!</div>`);
    // }
  })
}
