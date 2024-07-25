document.addEventListener('DOMContentLoaded', () => {
    const showWinnersButton = document.getElementById('showWinners');
    const winnersListModal = document.getElementById('winnersList');
    const closeWinnersButton = document.getElementById('closeWinners');
    const winnersList = document.getElementById('winners');

    showWinnersButton.addEventListener('click', () => {
        updateWinnersList();
        winnersListModal.classList.remove('hidden');
    });

    closeWinnersButton.addEventListener('click', () => {
        winnersListModal.classList.add('hidden');
    });

    function updateWinnersList() {
        winnersList.innerHTML = '';
        const winners = findWinners();
        winners.forEach(winner => {
            const listItem = document.createElement('li');
            listItem.textContent = `Cartón Nº ${winner.boardNumber} - ${winner.playerName}`;
            winnersList.appendChild(listItem);
        });
    }

    function findWinners() {
        const winners = [];
        document.querySelectorAll('.bingoBoard').forEach(board => {
            const boardNumber = board.dataset.boardNumber;
            const playerName = board.querySelector('.playerName').textContent;
            if (checkIfBoardWins(board)) {
                winners.push({ boardNumber, playerName });
            }
        });
        return winners;
    }

    function checkIfBoardWins(board) {
        const cells = board.querySelectorAll('.bingoCell');
        return checkFigureT(cells) || checkFigureL(cells) || checkFigureX(cells); // Añadir más figuras según sea necesario
    }

    function checkFigureT(cells) {
        const tPattern = [0, 1, 2, 3, 4, 7, 12, 17];
        return tPattern.every(index => cells[index].classList.contains('marked'));
    }

    function checkFigureL(cells) {
        const lPattern = [0, 5, 10, 15, 20, 21, 22, 23, 24];
        return lPattern.every(index => cells[index].classList.contains('marked'));
    }

    function checkFigureX(cells) {
        const xPattern = [0, 4, 6, 8, 12, 16, 18, 20, 24];
        return xPattern.every(index => cells[index].classList.contains('marked'));
    }
});
