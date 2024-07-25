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

    // Función para actualizar la lista de ganadores
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

    // Función para encontrar los ganadores
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

    // Función para verificar si un cartón ha ganado
    function checkIfBoardWins(board) {
        const cells = Array.from(board.querySelectorAll('.bingoCell'));
        return Object.values(patterns).some(pattern => {
            return pattern.every((required, index) => !required || cells[index].classList.contains('marked'));
        });
    }

    // Exponer la función updateWinnersList globalmente
    window.updateWinnersList = updateWinnersList;
});
