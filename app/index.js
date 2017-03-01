import './style.scss';

// if user is running mozilla then use it's built-in WebSocket
window.WebSocket = window.WebSocket || window.MozWebSocket;

const connection = new WebSocket('ws://127.0.0.1:1337');
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

const {x, y, ...z} = {x: 1, y: 2, a: 3, b: 4};
const n = {x, y, ...z};
if (Object.keys(n).map((key) => n[key]).reduce((p,v) => p + v) === 10) {
  document.querySelector('#app').insertAdjacentHTML('afterbegin', '<h1>works.</h1>');
}
