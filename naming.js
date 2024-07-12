document.addEventListener('DOMContentLoaded', () => {
    const namingTableBody = document.querySelector('#namingTable tbody');
    const backToGameBtn = document.getElementById('backToGame');

    // Cargar nombres de localStorage
    let playerNames = JSON.parse(localStorage.getItem('playerNames')) || {};

    // Crear filas para cada cartón
    for (let i = 1; i <= 1000; i++) {
        const row = document.createElement('tr');
        const cellNumber = document.createElement('td');
        cellNumber.textContent = `Cartón Nº ${i}`;
        const cellName = document.createElement('td');
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = playerNames[i] || '';
        nameInput.dataset.boardNumber = i;
        nameInput.addEventListener('input', () => {
            playerNames[i] = nameInput.value;
            localStorage.setItem('playerNames', JSON.stringify(playerNames));
        });
        cellName.appendChild(nameInput);
        row.appendChild(cellNumber);
        row.appendChild(cellName);
        namingTableBody.appendChild(row);
    }

    // Regresar al juego
    backToGameBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});
