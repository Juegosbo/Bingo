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
                existingWinners.add(winner.boardNumber);  // Añadir al Set de ganadores existentes
            }
        });
    }

    // Función para encontrar los ganadores
    function findWinners() {
        const winners = [];
        const maxBoardNumber = parseInt(document.getElementById('maxBoardNumber').value, 10) || 10000;

        document.querySelectorAll('.bingoBoard').forEach(board => {
            const boardNumber = parseInt(board.dataset.boardNumber, 10);
            if (boardNumber <= maxBoardNumber) {
                const playerNameElement = board.querySelector('.playerName');
                const playerName = playerNameElement ? playerNameElement.textContent : 'Sin nombre';
                if (checkIfBoardWins(board)) {
                    winners.push({ boardNumber, playerName });
                }
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

    // Llamar a updateWinnersList inmediatamente después de cargar la página
    updateWinnersList();

    // Añadir un event listener al campo maxBoardNumber para actualizar la lista de ganadores cuando cambie el valor
    document.getElementById('maxBoardNumber').addEventListener('input', updateWinnersList);
});
