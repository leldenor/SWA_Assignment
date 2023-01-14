interface GameState {
    grid: number[][]
}

const initialState: GameState = {
    grid: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ]
}

const checkMatch = (x: number, y: number, state: GameState): boolean => {
    const currentPiece = state.grid[x][y];
    if (x > 0 && state.grid[x - 1][y] === currentPiece) {
        return true;
    }
    if (x < state.grid.length - 1 && state.grid[x + 1][y] === currentPiece) {
        return true;
    }
    if (y > 0 && state.grid[x][y - 1] === currentPiece) {
        return true;
    }
    if (y < state.grid[x].length - 1 && state.grid[x][y + 1] === currentPiece) {
        return true;
    }
    return false;
}

const removeMatches = (state: GameState): GameState => {
    for (let x = 0; x < state.grid.length; x++) {
        for (let y = 0; y < state.grid[x].length; y++) {
            if (checkMatch(x, y, state)) {
                state.grid[x][y] = 0;
            }
        }
    }
    return state;
}

const handleSwap = (x1: number, y1: number, x2: number, y2: number, state: GameState): GameState => {
    const piece1 = state.grid[x1][y1];
    const piece2 = state.grid[x2][y2];
    state.grid[x1][y1] = piece2;
    state.grid[x2][y2] = piece1;
    return state;
}

let x1: number, y1: number;
let x2: number, y2: number;
let firstClick = true;

const gameLoop = (state: GameState) => {
    document.addEventListener('click', (event) => {
        if (firstClick) {
            x1 = event.target.getAttribute('data-x');
            y1 = event.target.getAttribute('data-y');
            firstClick = false;
        } else {
            x2 = event.target.getAttribute('data-x');
            y2 = event.target.getAttribute('data-y');
            firstClick = true;
            state = handleSwap(x1, y1, x2, y2, state);
        }
    });
    state = removeMatches(state);
    // some code here to add new pieces to the grid
    return state;
}

let currentState = initialState;
setInterval(() => {
    currentState = gameLoop(currentState);
}, 1000);
