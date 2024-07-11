document.addEventListener('DOMContentLoaded', () => {
    const bingoBoard = document.getElementById('bingoBoard');
    const generateNumberBtn = document.getElementById('generateNumber');
    const generatedNumberDiv = document.getElementById('generatedNumber');
    const numbers = Array.from({ length: 75 }, (_, i) => i + 1);
    let generatedNumbers = [];

    // Create Bingo Board
    function createBingoBoard() {
        const bingoLetters = ['B', 'I', 'N', 'G', 'O'];
        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.classList.add('bingoCell');
            cell.textContent = i === 12 ? 'FREE' : bingoLetters[Math.floor(i / 5)] + (i + 1);
            cell.dataset.number = i + 1;
            if (i === 12) {
                cell.classList.add('marked');
            }
            cell.addEventListener('click', () => {
                cell.classList.toggle('marked');
            });
            bingoBoard.appendChild(cell);
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
    }

    generateNumberBtn.addEventListener('click', generateNumber);
    createBingoBoard();
});
