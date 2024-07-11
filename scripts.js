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
        board.innerHTML = `<div class="bingoHeader">
                                <div>B</div><div>I</div><div>N</div><div>G</div><div>O</div>
                           </div>`;
        
        const columns = document.createElement('div');
        columns.classList.add('bingoColumns');
        columns.style.display = 'grid';
        columns.style.gridTemplateColumns = 'repeat(5, 1fr)';
        columns.style.gap = '5px';

        for (let i = 0; i < 5; i++) {
            const column = document.createElement('div');
            column.classList.add('bingoColumn');
            for (let j = 0; j < 15; j++) {
                const cell = document.createElement('div');
                cell.classList.add('bingoCell');
                const num = j + 1 + (i * 15);
                cell.textContent = num;
                cell.dataset.number = num;
                cell.addEventListener('click', () => markNumber(num));
                column.appendChild(cell);
            }
            columns.appendChild(column);
        }

        board.appendChild(columns);
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
        const numbers = getRandomNumbers(min, max, 5
