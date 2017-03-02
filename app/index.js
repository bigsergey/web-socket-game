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

fieldsArray.forEach(item => {
  $container.insertAdjacentHTML('beforeend', `<div id="${item}" class="field"></div>`)
});


// ---------- Game ----------

const $fields = document.getElementsByClassName('field');
const firstPlayerMoves = [], secondPlayerMoves = [];
let isFirstPlayerMove = true, isSecondPlayerMove = false;

for(let i = 0; i < $fields.length; i++) {
  $fields[i].addEventListener('click', (e) => {
    if (isFirstPlayerMove) {
      firstPlayerMoves.push(toNumber(e.target.id));
      e.target.innerHTML = 'X';
      isFirstPlayerMove = false;
      isSecondPlayerMove = true;
    } else {
      secondPlayerMoves.push(toNumber(e.target.id));
      e.target.innerHTML = 'O';
      isFirstPlayerMove = true;
      isSecondPlayerMove = false;
    }

    console.log(firstPlayerMoves, secondPlayerMoves);

    if (GameLogic.checkPlayerMoves(firstPlayerMoves)) {
      console.log('first player win');
    } else if (GameLogic.checkPlayerMoves(secondPlayerMoves)) {
      console.log('second player win');
    } else {
      console.log('draw');
    }
  })
}





const {x, y, ...z} = {x: 1, y: 2, a: 3, b: 4};
const n = {x, y, ...z};
if (Object.keys(n).map((key) => n[key]).reduce((p,v) => p + v) === 10) {
  document.querySelector('#app').insertAdjacentHTML('afterbegin', '<h1>works.</h1>');
}
