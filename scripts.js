document.addEventListener('DOMContentLoaded', () => {
    const masterBoardContainer = document.getElementById('masterBoardContainer');
    const bingoBoardsContainer = document.getElementById('bingoBoardsContainer');
    const resetGameBtn = document.getElementById('resetGame');
    const clearMarksBtn = document.getElementById('clearMarks');
    const nameCardsBtn = document.getElementById('nameCards');
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const winnerButton = document.getElementById('winnerButton');
    const winnerVideoContainer = document.getElementById('winnerVideoContainer');
    const winnerVideo = document.getElementById('winnerVideo');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    const selectFigure = document.getElementById('selectFigure');
    const figurePreviewContainer = document.getElementById('figurePreviewContainer');
    const figurePreview = document.getElementById('figurePreview');
    const printButton = document.getElementById('printButton');

    const boardsPerPage = 9;
    let currentPage = 1;
    let totalPages;
    let generatedNumbers = JSON.parse(localStorage.getItem('generatedNumbers')) || [];
    let bingoBoardsState = JSON.parse(localStorage.getItem('bingoBoardsState')) || {};
    let playerNames = JSON.parse(localStorage.getItem('playerNames')) || {};
    const totalBoards = 10000;

    let selectedFigure = '';

    // Calculate total pages
    totalPages = Math.ceil(totalBoards / boardsPerPage);
    totalPagesSpan.textContent = totalPages;

    function createMasterBoard() {
        const board = document.createElement('div');
        board.classList.add('bingoBoard');

        const header = document.createElement('div');
        header.classList.add('bingoHeader');
        ['B', 'I', 'N', 'G', 'O'].forEach(letter => {
            const cell = document.createElement('div');
            cell.textContent = letter;
            header.appendChild(cell);
        });
        board.appendChild(header);

        const columns = document.createElement('div');
        columns.classList.add('bingoColumns');
        columns.style.display = 'grid';
        columns.style.gridTemplateColumns = 'repeat(5, 1fr)';
        columns.style.gap = '5px';

        const bColumn = createFixedBingoColumn(1, 15);
        const iColumn = createFixedBingoColumn(16, 30);
        const nColumn = createFixedBingoColumn(31, 45);
        const gColumn = createFixedBingoColumn(46, 60);
        const oColumn = createFixedBingoColumn(61, 75);

        columns.appendChild(bColumn);
        columns.appendChild(iColumn);
        columns.appendChild(nColumn);
        columns.appendChild(gColumn);
        columns.appendChild(oColumn);

        board.appendChild(columns);
        masterBoardContainer.appendChild(board);

        // Mark previously generated numbers
        generatedNumbers.forEach(number => {
            markNumber(number);
        });
    }

    function createFixedBingoColumn(min, max) {
        const column = document.createElement('div');
        column.classList.add('bingoColumn');
        for (let i = min; i <= max; i++) {
            const cell = document.createElement('div');
            cell.classList.add('bingoCell');
            cell.textContent = i;
            cell.dataset.number = i;
            cell.addEventListener('click', () => markNumber(i));
            column.appendChild(cell);
        }
        return column;
    }

    function getRandomNumbers(min, max, count) {
        const numbers = [];
        while (numbers.length < count) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            if (!numbers.includes(num)) {
                numbers.push(num);
            }
        }
        return numbers;
    }

    function createBingoBoards(page) {
        bingoBoardsContainer.innerHTML = '';
        const startBoard = (page - 1) * boardsPerPage + 1;
        const endBoard = Math.min(startBoard + boardsPerPage - 1, totalBoards);

        for (let i = startBoard; i <= endBoard; i++) {
            const board = document.createElement('div');
            board.classList.add('bingoBoard');
            board.dataset.boardNumber = i;

            const boardNumber = document.createElement('div');
            boardNumber.classList.add('bingoBoardNumber');
            boardNumber.textContent = `Cartón Nº ${i} (${playerNames[i] || 'Sin nombre'})`;
            board.appendChild(boardNumber);

            const header = document.createElement('div');
            header.classList.add('bingoHeader');
            ['B', 'I', 'N', 'G', 'O'].forEach(letter => {
                const cell = document.createElement('div');
                cell.textContent = letter;
                header.appendChild(cell);
            });
            board.appendChild(header);

            const columns = document.createElement('div');
            columns.classList.add('bingoColumns');
            columns.style.display = 'grid';
            columns.style.gridTemplateColumns = 'repeat(5, 1fr)';
            columns.style.gap = '5px';

            const bColumn = createBingoColumn(1, 15, i);
            const iColumn = createBingoColumn(16, 30, i);
            const nColumn = createBingoColumn(31, 45, i, true);
            const gColumn = createBingoColumn(46, 60, i);
            const oColumn = createBingoColumn(61, 75, i);

            columns.appendChild(bColumn);
            columns.appendChild(iColumn);
            columns.appendChild(nColumn);
            columns.appendChild(gColumn);
            columns.appendChild(oColumn);

            board.appendChild(columns);
            bingoBoardsContainer.appendChild(board);
        }

        generatedNumbers.forEach(number => {
            markNumber(number);
        });

        currentPageSpan.textContent = currentPage;
    }

    function createBingoColumn(min, max, boardNumber, hasFreeCell = false) {
    const column = document.createElement('div');
    column.classList.add('bingoColumn');
    const numbers = bingoBoardsState[boardNumber] && bingoBoardsState[boardNumber][`col${min}-${max}`] ?
        bingoBoardsState[boardNumber][`col${min}-${max}`] :
        getRandomNumbers(min, max, 5);

    const boardState = bingoBoardsState[boardNumber] || {};
    numbers.forEach((num, index) => {
        const cell = document.createElement('div');
        cell.classList.add('bingoCell');
        const cellNumber = hasFreeCell && index === 2 ? 'FREE' : num;
        cell.textContent = cellNumber;
        cell.dataset.number = cellNumber;

        if (cellNumber === 'FREE') {
            cell.classList.add('free');
        }

        if (cellNumber === 'FREE' || generatedNumbers.includes(Number(cellNumber))) {
            cell.classList.add('marked');
        }
        column.appendChild(cell);

        if (!boardState[`col${min}-${max}`]) {
            boardState[`col${min}-${max}`] = numbers;
        }
    });

    bingoBoardsState[boardNumber] = boardState;
    saveState();
    return column;
}

    function markNumber(number) {
        if (!generatedNumbers.includes(number)) {
            generatedNumbers.push(number);
            saveState();
        }
        document.querySelectorAll(`[data-number="${number}"]`).forEach(cell => {
            cell.classList.add('marked');
        });
        markFigureNumbers(); // Llamar a la función para marcar los números de la figura en color naranja
    }

    function resetGame() {
        generatedNumbers = [];
        bingoBoardsState = {};
        playerNames = {}; // Borrar los nombres de los jugadores
        saveState();
        document.querySelectorAll('.bingoCell').forEach(cell => {
            cell.classList.remove('marked');
            cell.classList.remove('figure-marked'); // Remove the figure-marked class
        });
        masterBoardContainer.innerHTML = ''; // Limpia el contenedor del cartón maestro
        createMasterBoard(); // Crea el cartón maestro nuevamente
        currentPage = 1;
        createBingoBoards(currentPage);
    }

    function clearMarks() {
        // Clear marks from all boards in memory
        Object.keys(bingoBoardsState).forEach(boardNumber => {
            Object.keys(bingoBoardsState[boardNumber]).forEach(colKey => {
                bingoBoardsState[boardNumber][colKey].forEach((number, index) => {
                    if (number !== 'FREE') {
                        const cell = document.querySelector(`[data-number="${number}"]`);
                        if (cell) {
                            cell.classList.remove('marked');
                            cell.classList.remove('figure-marked'); // Remove the figure-marked class
                        }
                    }
                });
            });
        });

        // Clear marks from master board
        document.querySelectorAll('.bingoCell.marked').forEach(cell => {
            cell.classList.remove('marked');
            cell.classList.remove('figure-marked'); // Remove the figure-marked class
        });

        generatedNumbers = [];
        saveState();
    }

    function saveState() {
        localStorage.setItem('generatedNumbers', JSON.stringify(generatedNumbers));
        localStorage.setItem('bingoBoardsState', JSON.stringify(bingoBoardsState));
        localStorage.setItem('playerNames', JSON.stringify(playerNames)); // Guardar los nombres de los jugadores
    }

    function filterBoards() {
        const query = searchBox.value.trim().toLowerCase();
        let found = false;

        for (let page = 1; page <= totalPages; page++) {
            const startBoard = (page - 1) * boardsPerPage + 1;
            const endBoard = Math.min(startBoard + boardsPerPage - 1, totalBoards);

            for (let i = startBoard; i <= endBoard; i++) {
                const playerName = playerNames[i] ? playerNames[i].toLowerCase() : '';
                if (i.toString().includes(query) || playerName.includes(query)) {
                    found = true;
                    changePage(page);
                    setTimeout(() => {
                        const board = document.querySelector(`.bingoBoard[data-board-number='${i}']`);
                        if (board) {
                            board.scrollIntoView({ behavior: 'smooth' });
                            board.classList.add('highlighted-permanent'); // Add highlighted-permanent class

                            // Add close button
                            const closeButton = document.createElement('button');
                            closeButton.textContent = 'X';
                            closeButton.classList.add('closeButton');
                            closeButton.addEventListener('click', () => {
                                board.classList.remove('highlighted-permanent');
                                board.querySelector('.closeButton').remove();
                            });

                            board.appendChild(closeButton);
                        }
                    }, 500);
                    break;
                }
            }

            if (found) {
                break;
            }
        }

        if (!found) {
            alert('No se encontró el cartón.');
        }
    }

    function changePage(newPage) {
        if (newPage < 1 || newPage > totalPages) return;
        currentPage = newPage;
        createBingoBoards(currentPage);
    }

    function updateFigurePreview(figure) {
        figurePreview.innerHTML = ''; // Clear previous preview
        let cells = Array(25).fill(false); // 5x5 grid

        switch (figure) {
            case 'cross':
                cells = [
                    false, false, true,  false, false,
                    false, false, true,  false, false,
                    true,  true,  true,  true,  true,
                    false, false, true,  false, false,
                    false, false, true,  false, false
                ];
                break;
            case 'bigO':
                cells = [
                    true,  true,  true,  true,  true,
                    true,  false, false, false, true,
                    true,  false, false, false, true,
                    true,  false, false, false, true,
                    true,  true,  true,  true,  true
                ];
                break;
            case 'diamond':
                cells = [
                    false, false, true,  false, false,
                    false, true,  false, true,  false,
                    true,  false, false, false, true,
                    false, true,  false, true,  false,
                    false, false, true,  false, false
                ];
                break;
            case 'fourCorners':
                cells = [
                    true,  false, false, false, true,
                    false, false, false, false, false,
                    false, false, false, false, false,
                    false, false, false, false, false,
                    true,  false, false, false, true
                ];
                break;
             case 'letterH':
                // Corrección para la figura Letra H
                cells = [
                    true, false, false, false, true,
                    true, false, false, false, true,
                    true, true, true, true, true,
                    true, false, false, false, true,
                    true, false, false, false, true
                ];
                break;
            case 'tree':
                // Corrección para la figura Árbol
                cells = [
                    false, false, true,  false, false,
                    false, true,  true,  true,  false,
                    true,  true, true,  true, true,
                    false, false,  true,  false,  false,
                    false, false, true,  false, false
                ];
                break;
            case 'numberOne':
                // Corrección para la figura Número 1
                cells = [
                    false, false, true,  false, false,
                    false, true, true,  false, false,
                    false, false, true,  false, false,
                    false, false, true,  false, false,
                    false,  true,  true,  true,  false
                ];
                break;
            case 'chess':
                cells = [
                    true,  false, true,  false, true,
                    false, true,  false, true,  false,
                    true,  false, true,  false, true,
                    false, true,  false, true,  false,
                    true,  false, true,  false, true
                ];
                break;
            case 'diagonals':
                cells = [
                    true,  false, false, false, true,
                    false, true,  false, true,  false,
                    false, false, true,  false, false,
                    false, true,  false, true,  false,
                    true,  false, false, false, true
                ];
                break;
            default:
                return;
        }

        // Create a mini bingo board for the figure preview
        const board = document.createElement('div');
        board.classList.add('bingoBoard', 'small');
        
        const header = document.createElement('div');
        header.classList.add('bingoHeader');
        ['B', 'I', 'N', 'G', 'O'].forEach(letter => {
            const cell = document.createElement('div');
            cell.textContent = letter;
            header.appendChild(cell);
        });
        board.appendChild(header);

        const columns = document.createElement('div');
        columns.classList.add('bingoColumns');
        columns.style.display = 'grid';
        columns.style.gridTemplateColumns = 'repeat(5, 1fr)';
        columns.style.gap = '2px';

        cells.forEach((marked, index) => {
            const cell = document.createElement('div');
            cell.classList.add('bingoCell');
            if (marked) {
                cell.classList.add('marked');
            }
            columns.appendChild(cell);
        });

        board.appendChild(columns);
        figurePreview.appendChild(board);

        figurePreviewContainer.classList.remove('hidden');
        selectedFigure = figure; // Update the selected figure
        markFigureNumbers(); // Call the function to mark figure numbers
    }

    function markFigureNumbers() {
        if (!selectedFigure) return;

        let cells = Array(25).fill(false); // 5x5 grid

        switch (selectedFigure) {
            case 'cross':
                cells = [
                    false, false, true,  false, false,
                    false, false, true,  false, false,
                    true,  true,  true,  true,  true,
                    false, false, true,  false, false,
                    false, false, true,  false, false
                ];
                break;
            case 'bigO':
                cells = [
                    true,  true,  true,  true,  true,
                    true,  false, false, false, true,
                    true,  false, false, false, true,
                    true,  false, false, false, true,
                    true,  true,  true,  true,  true
                ];
                break;
            case 'diamond':
                cells = [
                    false, false, true,  false, false,
                    false, true,  false, true,  false,
                    true,  false, false, false, true,
                    false, true,  false, true,  false,
                    false, false, true,  false, false
                ];
                break;
            case 'fourCorners':
                cells = [
                    true,  false, false, false, true,
                    false, false, false, false, false,
                    false, false, false, false, false,
                    false, false, false, false, false,
                    true,  false, false, false, true
                ];
                break;
             case 'letterH':
                cells = [
                    true, true, true, true, true,
                    false, false, true, false, false,
                    false, false, true, false, false,
                    false, false, true, false, false,
                    true, true, true, true, true
                ];
                break;
            case 'tree':
                // Corrección para la figura Árbol
                cells = [
                    false, false, true,  false, false,
                    false, true,  true,  true,  false,
                    true,  true, true,  true, true,
                    false, true,  true,  false,  false,
                    false, false, true,  false, false
                ];
                break;
            case 'numberOne':
                // Corrección para la figura Número 1
                cells = [
                    false, false, false,  false, false,
                    false, true, false,  false, true,
                    true, true, true,  true, true,
                    false, false, false,  false, true,
                    false,  false,  false,  false,  false
                ];
                break;
            case 'chess':
                cells = [
                    true,  false, true,  false, true,
                    false, true,  false, true,  false,
                    true,  false, true,  false, true,
                    false, true,  false, true,  false,
                    true,  false, true,  false, true
                ];
                break;
            case 'diagonals':
                cells = [
                    true,  false, false, false, true,
                    false, true,  false, true,  false,
                    false, false, true,  false, false,
                    false, true,  false, true,  false,
                    true,  false, false, false, true
                ];
                break;
            default:
                return;
        }

        document.querySelectorAll('.bingoBoard').forEach(board => {
            const boardCells = board.querySelectorAll('.bingoCell');
            boardCells.forEach((cell, index) => {
                const cellNumber = parseInt(cell.dataset.number);
                if (cells[index] && generatedNumbers.includes(cellNumber)) {
                    cell.classList.add('figure-marked');
                } else {
                    cell.classList.remove('figure-marked');
                }
            });
        });
    }

    searchButton.addEventListener('click', filterBoards);
    resetGameBtn.addEventListener('click', resetGame);
    clearMarksBtn.addEventListener('click', clearMarks);
    nameCardsBtn.addEventListener('click', () => {
        window.location.href = 'naming.html';
    });
    winnerButton.addEventListener('click', () => {
        winnerVideoContainer.style.display = 'block';
        winnerVideo.play();
    });
    prevPageBtn.addEventListener('click', () => changePage(currentPage - 1));
    nextPageBtn.addEventListener('click', () => changePage(currentPage + 1));
    selectFigure.addEventListener('change', (e) => {
        const figure = e.target.value;
        updateFigurePreview(figure);
    });

   printButton.addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const boards = document.querySelectorAll('.bingoBoard');

    const scaleFactor = 0.25; // Factor de escala para reducir el tamaño del cartón
    const cartonesPorPagina = 9; // Número de cartones por página
    const filas = 4; // Número de filas por página
    const columnas = 3; // Número de columnas por página
    const margin = 10; // Margen entre los cartones

    for (let i = 0; i < boards.length; i++) {
        const canvas = await html2canvas(boards[i]);
        const imgData = canvas.toDataURL('image/png');
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = (doc.internal.pageSize.getWidth() - margin * (columnas + 1)) / columnas;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        const x = margin + (i % columnas) * (pdfWidth + margin);
        const y = margin + Math.floor(i % cartonesPorPagina / columnas) * (pdfHeight + margin);

        if (i % cartonesPorPagina === 0 && i > 0) {
            doc.addPage();
        }
        doc.addImage(imgData, 'PNG', x, y, pdfWidth, pdfHeight);
    }

    doc.save('bingo_cartones.pdf');
});
    createMasterBoard();
    createBingoBoards(currentPage);
});
