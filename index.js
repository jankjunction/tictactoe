const events = (function() {

    let events = {};

    function on(eventName, fn) {
        events[eventName] = events[eventName] || [];
        events[eventName].push(fn);
    };

    function off(eventName, fn) {
        if (events[eventName]) {
            for (var i = 0; i < events[eventName].length; i++) {
                if( events[eventName][i] === fn ) {
                    events[eventName].splice(i, 1);
                    break;
                }
            }
        }
    };

    function emit(eventName, data) {
        if (events[eventName]) {
            events[eventName].forEach(function(fn) {
                fn(data);
            });
        }
    };

    return {
        on: on,
        off: off,
        emit: emit,
    };

})();

const gameState = (() => {
    let board = ['', '', '',  '', '', '', '', '', ''];

    const clearBoard = () => {
        gameState.board = ['', '', '', '', '', '',  '', '', ''];
        events.emit('boardChanged', gameState.board);
    };

    const playerCreator = (name, token) => {
        return {name, token};
    };

    const player1 = playerCreator('player1', 'X');
    const player2 = playerCreator('player2', 'O');

    let currentPlayer = player1;

    const playerChange = () => {
        if (currentPlayer === player1) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1;
        }
    };

    const changeMarker = (index) => {
        board[index] = currentPlayer.token;
        events.emit('markerChanged', index);
        console.log(currentPlayer.token)
    };

    const gameOver = () => {
        let A = gameState.board[0];
        let B = gameState.board[1];
        let C = gameState.board[2];
        let D = gameState.board[3];
        let E = gameState.board[4];
        let F = gameState.board[5];
        let G = gameState.board[6];
        let H = gameState.board[7];
        let I = gameState.board[8];

        if (((A === B && B === C) && ((A != '') && (B != '') && (C != '')) ||
             (D === E && E === F) && ((D != '') && (E != '') && (F != '')) ||
             (G === H && H === I) && ((G != '') && (H != '') && (I != '')) ||
             (A === D && D === G) && ((A != '') && (D != '') && (G != '')) ||
             (B === E && E === H) && ((B != '') && (E != '') && (H != '')) ||
             (C === F && F === I) && ((C != '') && (F != '') && (I != '')) ||
             (A === E && E === I) && ((A != '') && (E != '') && (I != '')) ||
             (G === E && E === C) && ((G != '') && (E != '') && (C != '')))) {
                   events.emit('gameOver', { status: 'Game Over', currentPlayer: currentPlayer});
               }
        else {
            if ((A != '') && (B != '') && (C != '') && (D != '') && (E != '') && (F != '') && (G != '') && (H != '') && (I != '') ) {
                events.emit('gameOver', { status: 'Draw', currentPlayer: currentPlayer});
            }
        }
    };

    events.on('markerChanged', gameOver);
    events.on('markerChanged', playerChange);
    events.on('clearBoard', clearBoard);
    
    return {
        board: board,
        clearBoard: clearBoard,
        changeMarker: changeMarker,
        playerCreator: playerCreator,
    }
})();

const domManipulation = (() => {
    // cache the Dom
    let gameBoardDiv = document.querySelector('#game-board-container');
    let gameStatsDiv = document.querySelector('#game-stats-container');
    let gameSquareDivs = document.getElementsByClassName('game-square');
    let resetBtn = document.getElementById('reset');

    resetBtn.addEventListener('click', () => {
        events.emit('clearBoard');
    })

    const init = () => {
        wipeHtml()
        renderHtml();
        markerListen();
        gameState.playerCreator();
    };

    const gameStatus = (data) => {
        let gameStatus = document.createElement('div');
        gameStatus.setAttribute('id', 'game-status');
        if (data.status === 'Draw') {
            gameStatus.textContent = `${data.status}`
        } else {
            gameStatus.textContent = `${data.status}  ${data.currentPlayer.name} Wins`;
        }
        gameStatsDiv.appendChild(gameStatus);
    };

    const renderHtml = () => {
        for (let i = 0; i < gameState.board.length; i++) {
            let gameSquare = document.createElement('div');
            gameSquare.setAttribute('class', 'game-square');
            gameSquare.setAttribute('id', `game-square-${i}`)
            gameSquare.textContent = gameState.board[i];
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
                gameState.changeMarker(index);
                console.log('clicked');
            })
        })
    };

    events.on('markerChanged', wipeHtml);    
    events.on('boardChanged', wipeHtml);
    events.on('markerChanged', renderHtml);
    events.on('boardChanged', renderHtml);
    events.on('markerChanged', markerListen);
    events.on('boardChanged', markerListen);
    events.on('gameOver', gameStatus);

    return {
        init: init
    };

})();

domManipulation.init();