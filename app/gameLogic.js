import {intersection} from 'lodash';

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
}

export default new gameLogic();