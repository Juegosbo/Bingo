document.addEventListener('DOMContentLoaded', () => {
    const nombresData = [
        ["1 CARTON Nº 1", null, null, null, null, "Diagonales"],
        ["2 CARTON Nº 2", null, null, null, null, "Letra M"],
        ["3 CARTON Nº 3", null, null, null, null, "Cruz en la Mitad"],
        ["4 CARTON Nº 4", null, null, null, null, "O Grande"],
        ["5 CARTON Nº 5", null, null, null, null, "Diamante"]
    ];
    const jugadoresData = [
        ["POS", "LISTA DE JUGADORES"],
        [1, "CARTON Nº 1"],
        [2, "CARTON Nº 2"],
        [3, "CARTON Nº 3"],
        [4, "CARTON Nº 4"],
        [5, "CARTON Nº 5"]
    ];
    const bingoData = [
        ["TIPO DE JUEGO", "CARTON Nº", "B", "I", "N", "G", "O"],
        ["Cuatro Esquinas", 1, null, null, null, null, null],
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""],
        ["1 CARTON Nº 1", "", "B", "I", "N", "G", "O"],
        ["2 CARTON Nº 2", "", "B", "I", "N", "G", "O"]
    ];
    const hoja1Data = [
        ["SOFIA BERMUDEZ"],
        ["RAQUEL MENDOZA"],
        ["ISMAEL AGUILAR"],
        ["IRENE MENDEZ"],
        ["BENITO ESTEBAN"]
    ];

    function populateTable(tableId, data) {
        const table = document.getElementById(tableId);
        data.forEach(rowData => {
            const row = document.createElement('tr');
            rowData.forEach(cellData => {
                const cell = document.createElement('td');
                cell.textContent = cellData === null ? '' : cellData;
                row.appendChild(cell);
            });
            table.appendChild(row);
        });
    }

    populateTable('nombresTable', nombresData);
    populateTable('jugadoresTable', jugadoresData);
    populateTable('bingoTable', bingoData);
    populateTable('hoja1Table', hoja1Data);
});
