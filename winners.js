document.addEventListener('DOMContentLoaded', () => {
    // Definición de los patrones de las figuras utilizando matrices de true/false
    const patterns = {
        T: [
            true,  true,  true,  true,  true,
            false, false, true,  false, false,
            false, false, true,  false, false,
            false, false, true,  false, false,
            false, false, true,  false, false
        ],
        L: [
            true,  true, true, true, true,
            false,  false, false, false, true,
            false,  false, false, false, true,
            false,  false, false, false, true,
            false,  false,  false,  false,  true
        ],
        X: [
            true,  false, false, false, true,
            false, true,  false, true,  false,
            false, false, true,  false, false,
            false, true,  false, true,  false,
            true,  false, false, false, true
        ]
        // Añadir más patrones según sea necesario
    };
 function updateWinnersList() {
        const winnersList = document.getElementById('listagana');
        if (!winnersList) {
            console.error('Elemento listagana no encontrado');
            return;
        }

        const winners = findWinners();
        console.log('Ganadores encontrados:', winners);

        winners.forEach(winner => {
            const listItem = document.createElement('li');
            listItem.textContent = `Cartón Nº ${winner.boardNumber} - ${winner.playerName}`;
            listItem.dataset.boardNumber = winner.boardNumber;
            if (!winnersList.querySelector(`[data-board-number="${winner.boardNumber}"]`)) {
                winnersList.appendChild(listItem);
            }
        });
    }

    function findWinners() {
        const winners = [];
        const allBoards = JSON.parse(localStorage.getItem('bingoBoardsState')) || {};
        const maxBoardNumber = parseInt(document.getElementById('maxBoardNumber').value, 10) || 10000;

        Object.entries(allBoards).forEach(([boardNumber, boardData]) => {
            const playerName = boardData.playerName || 'Sin nombre';
            if (parseInt(boardNumber, 10) <= maxBoardNumber && checkIfBoardWins(boardData)) {
                winners.push({ boardNumber, playerName });
            }
        });
        return winners;
    }

    function checkIfBoardWins(boardData) {
        const cells = boardData.cells;
        if (!cells || cells.length !== 25) {
            console.error(`Cartón Nº ${boardData.boardNumber} no tiene una estructura de celdas válida.`);
            return false;
        }
        return Object.values(patterns).some(pattern => {
            return pattern.every((required, index) => !required || cells[index].marked);
        });
    }

    window.updateWinnersList = updateWinnersList;
    updateWinnersList();

    document.getElementById('maxBoardNumber').addEventListener('input', updateWinnersList);
});
