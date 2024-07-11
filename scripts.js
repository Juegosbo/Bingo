document.addEventListener('DOMContentLoaded', () => {
    const bingoBoardsContainer = document.getElementById('bingoBoardsContainer');
    const generateNumberBtn = document.getElementById('generateNumber');
    const resetGameBtn = document.getElementById('resetGame');
    const generatedNumberDiv = document.getElementById('generatedNumber');
    const searchBox = document.getElementById('searchBox');
    let numbers = Array.from({ length: 75 }, (_, i) => i + 1);
    let generatedNumbers = [];

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

            const bColumn = createBingoColumn(1, 15);
            const iColumn = createBingoColumn(16, 30);
            const nColumn = createBingoColumn(31, 45, true); // Middle cell is free
            const gColumn = createBingoColumn(46, 60);
            const oColumn = createBingoColumn(61, 75);

            const columns = document.createElement('div');
            columns.style.display = 'flex';
            columns.style.gap = '10px';
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

    // Generate a random Bingo number
    function generateNumber() {
        if (numbers.length === 0) {
            alert('Todos los números han sido generados.');
            return;
        }
        const randomIndex = Math.floor(Math.random() * numbers.length);
        const number = numbers.splice(randomIndex, 1)[0];
        generatedNumbers.push(number);
        generatedNumberDiv.textContent = `Número Generado: ${number}`;

        document.querySelectorAll(`[data-number="${number}"]`).forEach(cell => {
            cell.classList.add('marked');
        });
    }

    // Reset the game
    function resetGame() {
        numbers = Array.from({ length: 75 }, (_, i) => i + 1);
        generatedNumbers = [];
        generatedNumberDiv.textContent = '';
        createBingoBoards();
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

    generateNumberBtn.addEventListener('click', generateNumber);
    resetGameBtn.addEventListener('click', resetGame);
    createBingoBoards();
});
