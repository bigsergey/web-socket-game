import {intersection, last} from 'lodash';

/*
* Tic Tac Toe's array
*
* 0 | 1 | 2
* ---------
* 3 | 4 | 5
* ---------
* 6 | 7 | 8
* */

class gameLogic {
  getWinMoves() {
    return [
      [0, 1, 2],
      [0, 3, 6],
      [0, 4, 8],
      [1, 4, 7],
      [2, 5, 8],
      [2, 4, 6],
      [3, 4, 5],
      [6, 7, 8]
    ];
  }

  checkPlayerMoves(playerArray) {
    let isMatch = false;
    this.getWinMoves().forEach(winMove => {
      if (intersection(winMove, playerArray).toString() === winMove.toString()) {
        isMatch = true;
      }
    });

    return isMatch;
  }

  checkGameResult(playerOneMoves, playerTwoMoves, $app) {
    if (this.checkPlayerMoves(playerOneMoves)) {
      $app.insertAdjacentHTML('afterbegin', `<div class="overlay">You won!</div>`);
    }
    if (this.checkPlayerMoves(playerTwoMoves)) {
      $app.insertAdjacentHTML('afterbegin', `<div class="overlay">You lost</div>`);
    }

    if (playerOneMoves.length + playerTwoMoves.length === 9 && !this.checkPlayerMoves(playerOneMoves) && !this.checkPlayerMoves(playerTwoMoves)) {
      $app.insertAdjacentHTML('afterbegin', `<div class="overlay">Draw!</div>`);
    }
  }

  checkGameStatus(gameInfo, $app, $container) {
    this.drawOpponentMoves(gameInfo.opponentMoves, gameInfo.opponentSymbol, $container);
    this.checkGameResult(gameInfo.playerMoves, gameInfo.opponentMoves, $app);
  }

  drawOpponentMoves(opponentMoves, opponentSymbol, $container) {
    const opponentLastMove = last(opponentMoves);
    if (opponentMoves.length) {
      $container.children[opponentLastMove].innerHTML = opponentSymbol;
    }
  }

  drawBoardGame($container) {
    const numberOfFields = 9;
    const fieldsArray = Array.from(Array(numberOfFields).keys());

    fieldsArray.forEach(item => {
      $container.insertAdjacentHTML('beforeend', `<div id="${item}" class="field"></div>`)
    });
  }

  hideWaitingOverlay($waitingOverlay) {
    $waitingOverlay.style = "display: none";
  }
}

export default new gameLogic();