const gameBoard = (() => {
    let board = ['X', 'X', 'X',
                 'X', 'X', 'X',
                 'X', 'X', 'X'];

    const clearBoard = () => {
        this.board = ['', '', '',
                           '', '', '',
                           '', '', '']
    }

    const changeMarker = (index) => {
        board[index] = 'O';
        domManipulation.wipeHtml();
        domManipulation.renderHtml();
        domManipulation.markerListen();
    };
    
    return {
        board: board,
        clearBoard: clearBoard,
        changeMarker: changeMarker,
    }
})();

const domManipulation = (() => {
    // cache the Dom
    let gameBoardDiv = document.querySelector('#game-board-container');
    let gameSquareDivs = document.getElementsByClassName('game-square');

    const renderHtml = () => {
        for (let i = 0; i < gameBoard.board.length; i++) {
            let gameSquare = document.createElement('div');
            gameSquare.setAttribute('class', 'game-square');
            gameSquare.setAttribute('id', `game-square-${i}`)
            gameSquare.textContent = gameBoard.board[i];
            gameBoardDiv.appendChild(gameSquare);
        }
    };

    const wipeHtml = () => {
        let numberOfSquares = gameSquareDivs.length;
        for (let i = 0; i < numberOfSquares; i++) {
            gameBoardDiv.removeChild(gameBoardDiv.lastElementChild);
        }
    };

    

    const markerListen = () => {
        let index = '';
        [...gameSquareDivs].forEach(item => {
            item.addEventListener('click', () => {
                let string = item.attributes.id.value;
                index = string.charAt(string.length - 1);
                gameBoard.changeMarker(index);
            })
        });
    }

    return {
        gameBoardDiv: gameBoardDiv,
        gameSquareDivs: gameSquareDivs,
        renderHtml: renderHtml,
        wipeHtml: wipeHtml,
        markerListen: markerListen,

    };


})();

const playerCreator = () => {

}

console.log(domManipulation.gameBoard);
domManipulation.renderHtml();
domManipulation.markerListen();
