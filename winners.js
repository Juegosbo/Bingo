document.addEventListener('DOMContentLoaded', () => {
    function updateWinnersList() {
        const winnersList = document.getElementById('listagana');
        if (!winnersList) {
            console.error('Elemento listagana no encontrado');
            return;
        }
        winnersList.innerHTML = ''; // Limpiar la lista de ganadores

        const winners = findWinners();
        console.log('Ganadores encontrados:', winners); // Mensaje de depuración

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
            const playerNameElement = board.querySelector('.playerName');
            const playerName = playerNameElement ? playerNameElement.textContent : 'Sin nombre';
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
        const result = tPattern.every(index => cells[index].classList.contains('marked'));
        console.log('Figura T:', result); // Mensaje de depuración
        return result;
    }

    function checkFigureL(cells) {
        const lPattern = [0, 5, 10, 15, 20, 21, 22, 23, 24];
        const result = lPattern.every(index => cells[index].classList.contains('marked'));
        console.log('Figura L:', result); // Mensaje de depuración
        return result;
    }

    function checkFigureX(cells) {
        const xPattern = [0, 4, 6, 8, 12, 16, 18, 20, 24];
        const result = xPattern.every(index => cells[index].classList.contains('marked'));
        console.log('Figura X:', result); // Mensaje de depuración
        return result;
    }

    // Exponer la función updateWinnersList globalmente
    window.updateWinnersList = updateWinnersList;
});
