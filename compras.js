document.addEventListener('DOMContentLoaded', () => {
    const bingoBoardsContainer = document.getElementById('bingoBoardsContainer');
    const checkoutButton = document.getElementById('checkoutButton');
    let cart = [];

    // Crear y mostrar los cartones
    for (let i = 1; i <= 1000; i++) {
        const board = document.createElement('div');
        board.classList.add('bingoBoard');
        board.dataset.boardNumber = i;

        const boardNumberContainer = document.createElement('div');
        boardNumberContainer.classList.add('boardNumberContainer');
        
        const boardNumber = document.createElement('div');
        boardNumber.classList.add('bingoBoardNumber');
        boardNumber.textContent = `Cartón Nº ${i}`;

        const addButton = document.createElement('button');
        addButton.textContent = 'Añadir al carrito';
        addButton.addEventListener('click', () => {
            cart.push(i);
            alert(`Cartón Nº ${i} añadido al carrito`);
        });

        boardNumberContainer.appendChild(boardNumber);
        boardNumberContainer.appendChild(addButton);
        board.appendChild(boardNumberContainer);
        bingoBoardsContainer.appendChild(board);
    }

    // Realizar compra
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('No hay cartones en el carrito.');
            return;
        }
        
        const message = `Hola, me gustaría comprar los siguientes cartones de bingo: ${cart.join(', ')}`;
        const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
});
