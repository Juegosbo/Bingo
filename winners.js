 document.addEventListener('DOMContentLoaded', () => {
    const winnersList = document.getElementById('winnersList');
    const confirmedWinnersList = document.getElementById('confirmedWinnersList');
    const totalBoards = 2000;
    let generatedNumbers = JSON.parse(localStorage.getItem('generatedNumbers')) || [];

    // Definimos las figuras posibles
    const figures = {
        'T': [
            true, false, false,  false, false,
            true, false, false,  false, false,
            true,  true,  false,  true,  true,
            true, false, false,  false, false,
            true, false, false,  false, false
        ],
        'L': [
            true, true, true,  true, true,
            false, false, false,  false, true,
            false,  false,  false,  false,  true,
            false, false, false,  false, true,
            false, false, false,  false, true
        ],

         'P': [
            true, true, true,  true, true,
            true, false, true,  false, false,
            true,  false,  false,  false,  false,
            true, false, true,  false, false,
            true, true, true,  false, false
        ],
         'I': [
            true, false, false,  false, true,
            true, false, false,  false, true,
            true,  true,  false,  true,  true,
            true, false, false,  false, true,
            true, false, false,  false, true
        ],

        'S': [
            true, true, true,  false, true,
            true, false, true,  false, true,
            true,  false,  false,  false,  true,
            true, false, true,  false, true,
            true, false, true,  true, true
        ],

        'Z': [
           true, false, false,  false, true,
           true, false, false,  true, true,
           true,  false,  false,  false,  true,
           true, true, false,  false, true,
           true, false, false,  false, true
        ],

        'AJEDREZ': [
            true,  false, true,  false, true,
            false, true,  false, true,  false,
            true,  false, false,  false, true,
            false, true,  false, true,  false,
            true,  false, true,  false, true
        ],
        'X': [
            true,  false, false, false, true,
            false, true,  false, true,  false,
            false, false, false,  false, false,
            false, true,  false, true,  false,
            true,  false, false, false, true
        ],

        
        '2linea': [
            true, true, false, false, false,
            true, true, false, false, false,
            true, true, false, false, false,
            true, true, false, false, false,
            true, true, false, false, false
        ],
        'LINEA': [
            true, false, false, false, false,
            true, false, false, false, false,
            true, false, false, false, false,
            true, false, false, false, false,
            true, false, false, false, false
        ],
        '4ESQUINAS': [
            true, false, false, false, true,
            false, false, false, false, false,
            false, false, false, false, false,
            false, false, false, false, false,
            true, false, false, false, true
        ],
         'COMODIN': [
            false, false, false, false, false,
            false, true, true, true, false,
            false, true, false, true, false,
            false, true, true, true, false,
            false, false, false, false, false
        ],

      
    };

    
   let playerNames = JSON.parse(localStorage.getItem('playerNames')) || {};
    let wonFigures = JSON.parse(localStorage.getItem('wonFigures')) || [];

    function checkForWinners() {
        const newWinners = [];
        for (let i = 1; i <= totalBoards; i++) {
            const boardNumbers = generateBoardNumbers(i);
            for (const [figureName, figurePattern] of Object.entries(figures)) {
                if (!wonFigures.includes(figureName) && isWinningBoard(boardNumbers, figurePattern)) {
                    newWinners.push({ boardNumber: i, figureName });
                }
            }
        }

        newWinners.forEach(winner => {
            addWinnerToList(winner.boardNumber, winner.figureName);
            wonFigures.push(winner.figureName);
        });
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
        listItem.classList.add('winner-item', figureName.toLowerCase().replace(/\s+/g, ''));
        listItem.textContent = `Cartón Nº ${boardNumber} (${playerName}) - Figura: ${figureName}`;

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Bien';
        confirmButton.classList.add('confirm');
        confirmButton.addEventListener('click', () => confirmWinner(listItem, figureName));

        const removeButton = document.createElement('button');
        removeButton.textContent = 'X';
        removeButton.classList.add('remove');
        removeButton.addEventListener('click', () => removeWinner(listItem, figureName));

        listItem.appendChild(confirmButton);
        listItem.appendChild(removeButton);
        winnersList.appendChild(listItem);

        listItem.classList.add('animated');
        setTimeout(() => listItem.classList.remove('animated'), 1000);
    }

    function confirmWinner(listItem, figureName) {
        confirmedWinnersList.appendChild(listItem);
        listItem.querySelectorAll('button').forEach(button => button.remove());
        saveState();
    }

    function removeWinner(listItem, figureName) {
        listItem.remove();
        const index = wonFigures.indexOf(figureName);
        if (index > -1) {
            wonFigures.splice(index, 1);
        }
        saveState();
        checkForWinners();  // Vuelve a verificar los ganadores para la figura eliminada
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
        checkForWinners();
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
        localStorage.setItem('wonFigures', JSON.stringify(wonFigures));
    }

    function loadState() {
        generatedNumbers = JSON.parse(localStorage.getItem('generatedNumbers')) || [];
        wonFigures = JSON.parse(localStorage.getItem('wonFigures')) || [];
    }

    loadState();
    updateMasterBoard();
    checkForWinners();

    document.querySelectorAll('#masterBoardContainer .bingoCell').forEach(cell => {
        cell.addEventListener('click', () => {
            const number = parseInt(cell.dataset.number);
            toggleMarkNumber(number);
        });
    });
});
