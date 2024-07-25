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

      const maxBoardNumber = 2000; // Número máximo de cartones a considerar

    // Función para actualizar la lista de ganadores
    function updateWinnersList() {
        const winnersList = document.getElementById('listagana');
        if (!winnersList) {
            console.error('Elemento listagana no encontrado');
            return;
        }

        const existingWinners = new Set();
        winnersList.querySelectorAll('li').forEach(item => {
            existingWinners.add(item.dataset.boardNumber);
        });

        const winners = findWinners();
        console.log('Ganadores encontrados:', winners); // Mensaje de depuración

        winners.forEach(winner => {
            if (!existingWinners.has(winner.boardNumber)) {
                const listItem = document.createElement('li');
                listItem.textContent = `Cartón Nº ${winner.boardNumber} - ${winner.playerName}`;
                listItem.dataset.boardNumber = winner.boardNumber;
                winnersList.appendChild(listItem);
            }
        });
    }

    // Función para encontrar los ganadores
    function findWinners() {
        const winners = [];
        for (let i = 1; i <= maxBoardNumber; i++) {
            const board = getBoardData(i);
            const playerName = board.playerName || 'Sin nombre';
            if (checkIfBoardWins(board)) {
                winners.push({ boardNumber: i, playerName });
            }
        }
        return winners;
    }

    // Función para obtener datos de un cartón específico
    function getBoardData(boardNumber) {
        const boardState = JSON.parse(localStorage.getItem(`bingoBoard-${boardNumber}`)) || { cells: Array(25).fill(false) };
        const playerName = localStorage.getItem(`playerName-${boardNumber}`);
        return { ...boardState, playerName };
    }

    // Función para verificar si un cartón ha ganado
    function checkIfBoardWins(board) {
        const cells = board.cells;
        return Object.values(patterns).some(pattern => {
            return pattern.every((required, index) => !required || cells[index]);
        });
    }

    // Exponer la función updateWinnersList globalmente
    window.updateWinnersList = updateWinnersList;

    // Llamar a updateWinnersList inmediatamente después de cargar la página
    updateWinnersList();
});
