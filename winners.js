document.addEventListener('DOMContentLoaded', () => {
    const winnersList = document.getElementById('winnersList');
    const totalBoards = 2000;
    let generatedNumbers = JSON.parse(localStorage.getItem('generatedNumbers')) || [];

    // Definimos las figuras posibles
    const figures = {
        'X': [
            true, false, false, false, true,
            false, true, false, true, false,
            false, false, true, false, false,
            false, true, false, true, false,
            true, false, false, false, true
        ],
        'L': [
            true, false, false, false, false,
            true, false, false, false, false,
            true, false, false, false, false,
            true, false, false, false, false,
            true, true, true, true, true
        ],
        '2linea': [
            true, true, true, true, true,
            true, true, true, true, true,
            false, false, false, false, false,
            false, false, false, false, false,
            false, false, false, false, false
        ],
        '4esquinas': [
            true, false, false, false, true,
            false, false, false, false, false,
            false, false, false, false, false,
            false, false, false, false, false,
            true, false, false, false, true
        ],

        // Añadir otras figuras aquí
    };

    // Cargar nombres de jugadores
    let playerNames = JSON.parse(localStorage.getItem('playerNames')) || {};

    function checkForWinners() {
        winnersList.innerHTML = '';
        for (let i = 1; i <= totalBoards; i++) {
            const boardNumbers = generateBoardNumbers(i);
            for (const [figureName, figurePattern] of Object.entries(figures)) {
                if (isWinningBoard(boardNumbers, figurePattern)) {
                    addWinnerToList(i, figureName);
                }
            }
        }
    }

    function generateBoardNumbers(boardNumber) {
        const boardNumbers = [];
        for (let col = 0; col < 5; col++) {
            const start = col * 15 + 1;
            const end = start + 14;
            const colNumbers = getSeededRandomNumbers(start, end, 5, boardNumber * 10 + col);
            boardNumbers.push(...colNumbers);
        }
        return boardNumbers;
    }

    function isWinningBoard(boardNumbers, figurePattern) {
        return figurePattern.every((marked, index) => !marked || generatedNumbers.includes(boardNumbers[index]));
    }

    function addWinnerToList(boardNumber, figureName) {
        const playerName = playerNames[boardNumber] || 'Sin nombre';
        const listItem = document.createElement('li');
        listItem.textContent = `Cartón Nº ${boardNumber} (${playerName}) - Figura: ${figureName}`;
        winnersList.appendChild(listItem);
    }

    function getSeededRandomNumbers(min, max, count, seed) {
        const numbers = [];
        while (numbers.length < count) {
            const num = Math.floor(seedRandom(seed++) * (max - min + 1)) + min;
            if (!numbers.includes(num)) {
                numbers.push(num);
            }
        }
        return numbers;
    }

    function seedRandom(seed) {
        var x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    function toggleMarkNumber(number) {
        const index = generatedNumbers.indexOf(number);
        if (index > -1) {
            generatedNumbers.splice(index, 1);
        } else {
            generatedNumbers.push(number);
        }
        saveState();
        updateMasterBoard();
        checkForWinners(); // Verificar ganadores después de marcar un número
    }

    function updateMasterBoard() {
        document.querySelectorAll('#masterBoardContainer .bingoCell').forEach(cell => {
            const number = parseInt(cell.dataset.number);
            if (generatedNumbers.includes(number)) {
                cell.classList.add('master-marked');
            } else {
                cell.classList.remove('master-marked');
            }
        });
    }

    function saveState() {
        localStorage.setItem('generatedNumbers', JSON.stringify(generatedNumbers));
    }

    document.querySelectorAll('#masterBoardContainer .bingoCell').forEach(cell => {
        cell.addEventListener('click', () => {
            const number = parseInt(cell.dataset.number);
            toggleMarkNumber(number);
        });
    });

    updateMasterBoard();
    checkForWinners();
});