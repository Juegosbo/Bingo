document.addEventListener('DOMContentLoaded', () => {
    const masterBoardContainer = document.getElementById('masterBoardContainer');
    const bingoBoardsContainer = document.getElementById('bingoBoardsContainer');
    const resetGameBtn = document.getElementById('resetGame');
    const searchBox = document.getElementById('searchBox');
    let generatedNumbers = [];

    // Helper function to generate numbers for the master board
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
        
        const rows = document.createElement('div');
        rows.classList.add('bingoRows');
        rows.style.display = 'grid';
        rows.style.gridTemplateColumns = 'repeat(5, 1fr)';
        rows.style.gap = '5px';

        const bRow = createBingoRow(1, 15);
        const iRow = createBingoRow(16, 30);
        const nRow = createBingoRow(31, 45);
        const gRow = createBingoRow(46, 60);
        const oRow = createBingoRow(61, 75);

        rows.appendChild(bRow);
        rows.appendChild(iRow);
        rows.appendChild(nRow);
        rows.appendChild(gRow);
        rows.appendChild(oRow);

        board.appendChild(rows);
        masterBoardContainer.appendChild(board);
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
            columns.style.gap = '5px'; // Ajusta el espacio entre las columnas

            const bColumn = createBingoColumn(1, 15);
            const iColumn = createBingoColumn(16, 30);
            const nColumn = createBingoColumn(31, 45, true); // Middle cell is free
            const gColumn = createBingoColumn(46, 60);
            const oColumn = createBingoColumn(61, 75);

            columns.appendChild(bColumn);
            columns.appendChild(iColumn);
            columns.appendChild(nColumn);
            columns.appendChild(gColumn);
            columns.appendChild(oColumn);

            board.appendChild(columns);
            bingoBoardsContainer.appendChild(board);
        }
    }

    function createBingoColumn(min, max, hasFreeCell = false) {
        const column = document.createElement('div');
        column.classList.add('bingoColumn');
        const numbers = getRandomNumbers(min, max, 5);
        numbers.forEach((num, index) => {
            const cell = document.createElement('div');
            cell.classList.add('bingoCell');
            cell.textContent = hasFreeCell && index === 2 ? 'FREE' : num;
            cell.dataset.number = hasFreeCell && index === 2 ? 'FREE' : num;
            if (cell.textContent === 'FREE') {
                cell.classList.add('marked');
            }
            column.appendChild(cell);
        });
        return column;
    }

    function createBingoRow(min, max) {
        const row = document.createElement('div');
        row.classList.add('bingoRow');
        for (let i = min; i <= max; i++) {
            const cell = document.createElement('div');
            cell.classList.add('bingoCell');
            cell.textContent = i;
            cell.dataset.number = i;
            cell.addEventListener('click', () => markNumber(i));
            row.appendChild(cell);
        }
        return row;
    }

    // Mark a number across all boards
    function markNumber(number) {
        if (!generatedNumbers.includes(number)) {
            generatedNumbers.push(number);
            document.querySelectorAll(`[data-number="${number}"]`).forEach(cell => {
                cell.classList.add('marked');
            });
        }
    }

    // Reset the game
    function resetGame() {
        generatedNumbers = [];
        document.querySelectorAll('.bingoCell').forEach(cell => {
            cell.classList.remove('marked');
        });
        createBingoBoards();
        createMasterBoard();
    }

    // Filter boards based on search input
    searchBox.addEventListener('input', () => {
        const query = searchBox.value.trim();
        document.querySelectorAll('.bingoBoard').forEach(board => {
            if (!query || board.dataset.boardNumber.includes(query)) {
                board.style.display = '';
            } else {
                board.style.display = 'none';
            }
        });
    });

    resetGameBtn.addEventListener('click', resetGame);
    createMasterBoard();
    createBingoBoards();
});
