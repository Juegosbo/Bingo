document.addEventListener('DOMContentLoaded', () => {
    // Definición de los patrones de las figuras (sin cambios)
    const patterns = {
        T: [
            true,  true,  true,  true,  true,
            false, false, true,  false, false,
            false, false, true,  false, false,
            false, false, true,  false, false,
            false, false, true,  false, false
        ],
        L: [
            true,  false, false, false, false,
            true,  false, false, false, false,
            true,  false, false, false, false,
            true,  false, false, false, false,
            true,  true,  true,  true,  true
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

    // Función para actualizar la lista de ganadores
    function updateWinnersList() {
        const winnersList = document.getElementById('listagana');
        if (!winnersList) {
            console.error('Elemento listagana no encontrado');
            return;
        }

        const winners = findWinners();
        console.log('Ganadores encontrados:', winners); // Mensaje de depuración

        winners.forEach(winner => {
            const listItem = document.createElement('li');
            listItem.textContent = `Cartón Nº ${winner.boardNumber} - ${winner.playerName}`;
            listItem.dataset.boardNumber = winner.boardNumber;
            winnersList.appendChild(listItem);
        });
    }

    // Función para encontrar los ganadores
    function findWinners() {
        const winners = [];
        const allBoards = JSON.parse(localStorage.getItem('bingoBoardsState')) || {};
        Object.entries(allBoards).forEach(([boardNumber, board]) => {
            if (checkIfBoardWins(board)) {
                winners.push({ boardNumber, playerName: board.playerName });
            }
        });
        return winners;
    }

    // Función para verificar si un cartón ha ganado
    function checkIfBoardWins(board) {
        if (!board.cells || !Array.isArray(board.cells)) {
            console.error(`Cartón Nº ${board.boardNumber} no tiene una estructura de celdas válida.`);
            return false;
        }

        return Object.values(patterns).some(pattern => {
            return pattern.every((required, index) => !required || (board.cells[index] && board.cells[index].marked));
        });
    }

    // Exponer la función updateWinnersList globalmente
    window.updateWinnersList = updateWinnersList;

    // Llamar a updateWinnersList inmediatamente después de cargar la página
    updateWinnersList();

    // Agregar un listener para el evento 'storage' para actualizar la lista cuando cambie el localStorage
    window.addEventListener('storage', (event) => {
        if (event.key === 'bingoBoardsState') {
            updateWinnersList();
        }
    });
});
