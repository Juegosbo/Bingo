document.addEventListener('DOMContentLoaded', () => {
    const bingoBoardsContainer = document.getElementById('bingoBoardsContainer');
    const completePurchaseButton = document.getElementById('completePurchase');
    let selectedBoards = [];

    // Crear cartones de bingo
    function createBingoBoards() {
        for (let i = 1; i <= 100; i++) { // Cambia 100 por el número total de cartones
            const board = document.createElement('div');
            board.classList.add('bingoBoard');
            board.dataset.boardNumber = i;
            board.innerHTML = `<div class="bingoBoardNumber">Cartón Nº ${i}</div>`;
            board.addEventListener('click', () => toggleBoardSelection(i));
            bingoBoardsContainer.appendChild(board);
        }
    }

    function toggleBoardSelection(boardNumber) {
        const board = document.querySelector(`.bingoBoard[data-board-number='${boardNumber}']`);
        if (selectedBoards.includes(boardNumber)) {
            selectedBoards = selectedBoards.filter(num => num !== boardNumber);
            board.classList.remove('selected');
        } else {
            selectedBoards.push(boardNumber);
            board.classList.add('selected');
        }
    }

    completePurchaseButton.addEventListener('click', () => {
        const whatsappMessage = `Compré los siguientes cartones de bingo: ${selectedBoards.join(', ')}`;
        const whatsappURL = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappURL, '_blank');
    });

    createBingoBoards();
});
