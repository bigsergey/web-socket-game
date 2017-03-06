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

  checkGameResult(playerOneMoves, playerTwoMoves, $overlay) {
    $overlay.innerHTML = '';

    if (this.checkPlayerMoves(playerOneMoves) && playerTwoMoves.length) {
      $overlay.style = 'display: flex';
      $overlay.innerHTML = 'You won!';
    }

    if (this.checkPlayerMoves(playerTwoMoves) && playerOneMoves.length) {
      $overlay.style = 'display: flex';
      $overlay.innerHTML = 'You lost..';
    }

    if (playerOneMoves.length + playerTwoMoves.length === 9 && !this.checkPlayerMoves(playerOneMoves) && !this.checkPlayerMoves(playerTwoMoves)) {
      $overlay.style = 'display: flex';
      $overlay.innerHTML = 'Draw';
    }
  }

  checkGameStatus(gameInfo, $overlay, $container) {
    this.drawOpponentMoves(gameInfo.opponentMoves, gameInfo.opponentSymbol, $container);
    this.checkGameResult(gameInfo.playerMoves, gameInfo.opponentMoves, $overlay);
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

  resetBoard($container) {
    while($container.firstChild){
      $container.removeChild($container.firstChild);
    }

    this.drawBoardGame($container);
  }

  toggleWaitingOverlay(displayOverlay, $waitingOverlay) {
    displayOverlay ? $waitingOverlay.style = "display: flex" : $waitingOverlay.style = "display: none";
  }
}

export default new gameLogic();