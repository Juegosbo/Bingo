document.addEventListener('DOMContentLoaded', () => {
    const masterBoardContainer = document.getElementById('masterBoardContainer');
    const bingoBoardsContainer = document.getElementById('bingoBoardsContainer');
    const resetGameBtn = document.getElementById('resetGame');
    const clearMarksBtn = document.getElementById('clearMarks'); // Botón Limpiar
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    let generatedNumbers = JSON.parse(localStorage.getItem('generatedNumbers')) || [];
    let bingoBoardsState = JSON.parse(localStorage.getItem('bingoBoardsState')) || {};

    // Helper function to generate numbers for the master boards
    function createMasterBoard() {
        const board = document.createElement('div');
        board.classList.add('bingoBoard');

        const header = document.createElement('div');
        header.classList.add('bingoHeader');
        ['B', 'I', 'N', 'G', 'O'].forEach(letter => {
            const cell = document.createElement('div');
            cell.textContent = letter;
            header.appendChild(cell);
        });
        board.appendChild(header);

        const columns = document.createElement('div');
        columns.classList.add('bingoColumns');
        columns.style.display = 'grid';
        columns.style.gridTemplateColumns = 'repeat(5, 1fr)';
        columns.style.gap = '5px';

        const bColumn = createFixedBingoColumn(1, 15);
        const iColumn = createFixedBingoColumn(16, 30);
        const nColumn = createFixedBingoColumn(31, 45);
        const gColumn = createFixedBingoColumn(46, 60);
        const oColumn = createFixedBingoColumn(61, 75);

        columns.appendChild(bColumn);
        columns.appendChild(iColumn);
        columns.appendChild(nColumn);
        columns.appendChild(gColumn);
        columns.appendChild(oColumn);

        board.appendChild(columns);
        masterBoardContainer.appendChild(board);

        // Mark previously generated numbers
        generatedNumbers.forEach(number => {
            markNumber(number);
        });
    }

    function createFixedBingoColumn(min, max) {
        const column = document.createElement('div');
        column.classList.add('bingoColumn');
        for (let i = min; i <= max; i++) {
            const cell = document.createElement('div');
            cell.classList.add('bingoCell');
            cell.textContent = i;
            cell.dataset.number = i;
            cell.addEventListener('click', () => markNumber(i));
            column.appendChild(cell);
        }
        return column;
    }

    // Helper function to generate a random number in a range
    function getRandomNumbers(min, max, count) {
        const numbers = [];
        while (numbers.length < count) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            if (!numbers.includes(num)) {
                numbers.push(num);
            }
        }
        return numbers;
    }

    // Create Bingo Boards
    function createBingoBoards() {
        bingoBoardsContainer.innerHTML = '';
        for (let i = 1; i <= 100; i++) {
            const board = document.createElement('div');
            board.classList.add('bingoBoard');
            board.dataset.boardNumber = i;

            const boardNumber = document.createElement('div');
            boardNumber.classList.add('bingoBoardNumber');
            boardNumber.textContent = `Cartón Nº ${i}`;
            board.appendChild(boardNumber);

            const header = document.createElement('div');
            header.classList.add('bingoHeader');
            ['B', 'I', 'N', 'G', 'O'].forEach(letter => {
                const cell = document.createElement('div');
                cell.textContent = letter;
                header.appendChild(cell);
            });
            board.appendChild(header);

            const columns = document.createElement('div');
            columns.classList.add('bingoColumns');
            columns.style.display = 'grid';
            columns.style.gridTemplateColumns = 'repeat(5, 1fr)';
            columns.style.gap = '5px';

            const bColumn = createBingoColumn(1, 15, i);
            const iColumn = createBingoColumn(16, 30, i);
            const nColumn = createBingoColumn(31, 45, i, true); // Middle cell is free
            const gColumn = createBingoColumn(46, 60, i);
            const oColumn = createBingoColumn(61, 75, i);

            columns.appendChild(bColumn);
            columns.appendChild(iColumn);
            columns.appendChild(nColumn);
            columns.appendChild(gColumn);
            columns.appendChild(oColumn);

            board.appendChild(columns);
            bingoBoardsContainer.appendChild(board);
        }

        // Mark previously generated numbers
        generatedNumbers.forEach(number => {
            markNumber(number);
        });
    }

    function createBingoColumn(min, max, boardNumber, hasFreeCell = false) {
        const column = document.createElement('div');
        column.classList.add('bingoColumn');
        const numbers = bingoBoardsState[boardNumber] && bingoBoardsState[boardNumber][`col${min}-${max}`] ?
            bingoBoardsState[boardNumber][`col${min}-${max}`] :
            getRandomNumbers(min, max, 5);

        const boardState = bingoBoardsState[boardNumber] || {};
        numbers.forEach((num, index) => {
            const cell = document.createElement('div');
            cell.classList.add('bingoCell');
            const cellNumber = hasFreeCell && index === 2 ? 'FREE' : num;
            cell.textContent = cellNumber;
            cell.dataset.number = cellNumber;
            if (cellNumber === 'FREE' || generatedNumbers.includes(Number(cellNumber))) {
                cell.classList.add('marked');
            }
            column.appendChild(cell);

            // Save number to board state
            if (!boardState[`col${min}-${max}`]) {
                boardState[`col${min}-${max}`] = numbers;
            }
        });

        bingoBoardsState[boardNumber] = boardState;
        saveState();
        return column;
    }

    // Mark a number across all boards
    function markNumber(number) {
        if (!generatedNumbers.includes(number)) {
            generatedNumbers.push(number);
            saveState();
        }
        document.querySelectorAll(`[data-number="${number}"]`).forEach(cell => {
            cell.classList.add('marked');
        });
    }

    // Reset the game
    function resetGame() {
        generatedNumbers = [];
        bingoBoardsState = {};
        saveState();
        document.querySelectorAll('.bingoCell').forEach(cell => {
            cell.classList.remove('marked');
        });
        masterBoardContainer.innerHTML = ''; // Limpia el contenedor del cartón maestro
        createBingoBoards();
        createMasterBoard();
    }

    // Clear marks without resetting the boards
    function clearMarks() {
        document.querySelectorAll('.bingoCell').forEach(cell => {
            cell.classList.remove('marked');
        });
    }

    // Save generated numbers and boards state to localStorage
    function saveState() {
        localStorage.setItem('generatedNumbers', JSON.stringify(generatedNumbers));
        localStorage.setItem('bingoBoardsState', JSON.stringify(bingoBoardsState));
    }

    // Filter boards based on search input
    searchButton.addEventListener('click', () => {
        const query = searchBox.value.trim();
        document.querySelectorAll('.bingoBoard').forEach(board => {
            if (!query || board.dataset.boardNumber === query) {
                board.style.display = '';
            } else {
                board.style.display = 'none';
            }
        });
    });

    resetGameBtn.addEventListener('click', resetGame);
    clearMarksBtn.addEventListener('click', clearMarks); // Evento del botón Limpiar
    createMasterBoard();
    createBingoBoards();
});
