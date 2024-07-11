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

            const cellContainer = document.createElement('div');
            cellContainer.classList.add('bingoCellContainer');

            const bNumbers = getRandomNumbers(1, 15, 5);
            const iNumbers = getRandomNumbers(16, 30, 5);
            const nNumbers = getRandomNumbers(31, 45, 4); // Middle cell is free
            const gNumbers = getRandomNumbers(46, 60, 5);
            const oNumbers = getRandomNumbers(61, 75, 5);

            [...bNumbers, ...iNumbers, ...nNumbers.slice(0, 2), 'FREE', ...nNumbers.slice(2), ...gNumbers, ...oNumbers].forEach((num, index) => {
                const cell = document.createElement('div');
                cell.classList.add('bingoCell');
                cell.textContent = num === 'FREE' ? 'FREE' : num;
                cell.dataset.number = num;
                if (num === 'FREE') {
                    cell.classList.add('marked');
                }
                cellContainer.appendChild(cell);
            });

            board.appendChild(cellContainer);
            bingoBoardsContainer.appendChild(board);
        }
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
        generatedNumberDiv.textContent = number;

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
