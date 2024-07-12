document.addEventListener('DOMContentLoaded', () => {
    const masterBoardContainer = document.getElementById('masterBoardContainer');
    const bingoBoardsContainer = document.getElementById('bingoBoardsContainer');
    const resetGameBtn = document.getElementById('resetGame');
    const clearMarksBtn = document.getElementById('clearMarks');
    const nameCardsBtn = document.getElementById('nameCards'); // Botón Nombrar Cartón
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const winnerButton = document.getElementById('winnerButton');
    const winnerVideoContainer = document.getElementById('winnerVideoContainer');
    const winnerVideo = document.getElementById('winnerVideo');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    
    const boardsPerPage = 10;
    let currentPage = 1;
    let totalPages;
    let generatedNumbers = JSON.parse(localStorage.getItem('generatedNumbers')) || [];
    let bingoBoardsState = JSON.parse(localStorage.getItem('bingoBoardsState')) || {};
    let playerNames = JSON.parse(localStorage.getItem('playerNames')) || {};
    const totalBoards = 1000;

    // Calculate total pages
    totalPages = Math.ceil(totalBoards / boardsPerPage);
    totalPagesSpan.textContent = totalPages;

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

    function createBingoBoards(page) {
        bingoBoardsContainer.innerHTML = '';
        const startBoard = (page - 1) * boardsPerPage + 1;
        const endBoard = Math.min(startBoard + boardsPerPage - 1, totalBoards);

        for (let i = startBoard; i <= endBoard; i++) {
            const board = document.createElement('div');
            board.classList.add('bingoBoard');
            board.dataset.boardNumber = i;

            const boardNumber = document.createElement('div');
            boardNumber.classList.add('bingoBoardNumber');
            boardNumber.textContent = `Cartón Nº ${i} (${playerNames[i] || 'Sin nombre'})`;
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
            const nColumn = createBingoColumn(31, 45, i, true);
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

        generatedNumbers.forEach(number => {
            markNumber(number);
        });

        currentPageSpan.textContent = currentPage;
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

            if (!boardState[`col${min}-${max}`]) {
                boardState[`col${min}-${max}`] = numbers;
            }
        });

        bingoBoardsState[boardNumber] = boardState;
        saveState();
        return column;
    }

    function markNumber(number) {
        if (!generatedNumbers.includes(number)) {
            generatedNumbers.push(number);
            saveState();
        }
        document.querySelectorAll(`[data-number="${number}"]`).forEach(cell => {
            cell.classList.add('marked');
        });
    }

    function resetGame() {
        generatedNumbers = [];
        bingoBoardsState = {};
        playerNames = {}; // Borrar los nombres de los jugadores
        saveState();
        document.querySelectorAll('.bingoCell').forEach(cell => {
            cell.classList.remove('marked');
        });
        masterBoardContainer.innerHTML = ''; // Limpia el contenedor del cartón maestro
        createMasterBoard(); // Crea el cartón maestro nuevamente
        currentPage = 1;
        createBingoBoards(currentPage);
    }

    function clearMarks() {
        // Clear marks from all boards in memory
        Object.keys(bingoBoardsState).forEach(boardNumber => {
            Object.keys(bingoBoardsState[boardNumber]).forEach(colKey => {
                bingoBoardsState[boardNumber][colKey].forEach((number, index) => {
                    if (number !== 'FREE') {
                        const cell = document.querySelector(`[data-number="${number}"]`);
                        if (cell) {
                            cell.classList.remove('marked');
                        }
                    }
                });
            });
        });

        // Clear marks from master board
        document.querySelectorAll('.bingoCell.marked').forEach(cell => {
            cell.classList.remove('marked');
        });

        generatedNumbers = [];
        saveState();
    }

    function saveState() {
        localStorage.setItem('generatedNumbers', JSON.stringify(generatedNumbers));
        localStorage.setItem('bingoBoardsState', JSON.stringify(bingoBoardsState));
        localStorage.setItem('playerNames', JSON.stringify(playerNames)); // Guardar los nombres de los jugadores
    }

    function filterBoards() {
        const query = searchBox.value.trim().toLowerCase();
        document.querySelectorAll('.bingoBoard').forEach(board => {
            const boardNumber = board.dataset.boardNumber;
            const playerName = playerNames[boardNumber] ? playerNames[boardNumber].toLowerCase() : '';
            if (boardNumber.includes(query) || playerName.includes(query)) {
                board.scrollIntoView({ behavior: 'smooth' });
                board.style.border = '2px solid red';
                setTimeout(() => {
                    board.style.border = '1px solid #ddd';
                }, 2000);
            }
        });
    }

    function changePage(newPage) {
        if (newPage < 1 || newPage > totalPages) return;
        currentPage = newPage;
        createBingoBoards(currentPage);
    }

    searchButton.addEventListener('click', filterBoards);
    resetGameBtn.addEventListener('click', resetGame);
    clearMarksBtn.addEventListener('click', clearMarks);
    nameCardsBtn.addEventListener('click', () => {
        window.location.href = 'naming.html';
    });
    winnerButton.addEventListener('click', () => {
        winnerVideoContainer.style.display = 'block';
        winnerVideo.play();
    });
    prevPageBtn.addEventListener('click', () => changePage(currentPage - 1));
    nextPageBtn.addEventListener('click', () => changePage(currentPage + 1));

    createMasterBoard();
    createBingoBoards(currentPage);
});
