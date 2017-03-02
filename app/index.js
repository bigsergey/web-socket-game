import './style.scss';
import {toNumber} from 'lodash';
import GameLogic from './gameLogic';

const WEB_SOCKET_ADDRESS = 'ws://127.0.0.1:1337';

// if user is running mozilla then use it's built-in WebSocket
window.WebSocket = window.WebSocket || window.MozWebSocket;

const connection = new WebSocket(WEB_SOCKET_ADDRESS);
const simpleMessage = JSON.stringify({a: 'Patryk'});

connection.onopen = function () {
  connection.send(JSON.stringify(simpleMessage));
  // connection is opened and ready to use
};

connection.onerror = function (error) {
  // an error occurred when sending/receiving data
};

connection.onmessage = function (message) {
  // try to decode json (I assume that each message from server is json)
  try {
    const json = JSON.parse(message.data);
    console.log(json);
  } catch (e) {
    console.log('This doesn\'t look like a valid JSON: ', message.data);
    return;
  }
  // handle incoming message
};



// ---------- Create Game Board ----------

const fieldsArray = Array.from(Array(9).keys());
const $container = document.querySelector('#container');
const $app = document.querySelector('#app');

fieldsArray.forEach(item => {
  $container.insertAdjacentHTML('beforeend', `<div id="${item}" class="field"></div>`)
});


// ---------- Game ----------

const $fields = document.getElementsByClassName('field');
const firstPlayerMoves = [], secondPlayerMoves = [];
let isFirstPlayerMove = true;

for(let i = 0; i < $fields.length; i++) {
  $fields[i].addEventListener('click', (e) => {
    if (!e.target.innerHTML) {
      if (isFirstPlayerMove) {
        firstPlayerMoves.push(toNumber(e.target.id));
        e.target.innerHTML = 'X';
        isFirstPlayerMove = false;
      } else {
        secondPlayerMoves.push(toNumber(e.target.id));
        e.target.innerHTML = 'O';
        isFirstPlayerMove = true;
      }
    }

    console.log(firstPlayerMoves, secondPlayerMoves);
    if (GameLogic.checkPlayerMoves(firstPlayerMoves)) {
      $app.insertAdjacentHTML('afterbegin', `<div class="overlay">First player won!</div>`);
    }
    if (GameLogic.checkPlayerMoves(secondPlayerMoves)) {
      $app.insertAdjacentHTML('afterbegin', `<div class="overlay">Second player won!</div>`);
    }

    if (firstPlayerMoves.length + secondPlayerMoves.length === 9 && !GameLogic.checkPlayerMoves(firstPlayerMoves) && !GameLogic.checkPlayerMoves(secondPlayerMoves)) {
      $app.insertAdjacentHTML('afterbegin', `<div class="overlay">Draw!</div>`);
    }
  })
}
