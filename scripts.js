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
    const totalBoards = 10000;

    let generatedNumbers = [];
    let bingoBoardsState = {};
    let playerNames = {};
    let selectedFigure = '';
    let currentPage = 1;

    // Cargar el estado guardado
    loadState();

    // Calcular páginas totales
    let totalPages = Math.ceil(totalBoards / boardsPerPage);
    totalPagesSpan.textContent = totalPages;

    createMasterBoard();
    createBingoBoards(currentPage);
    
     if (selectedFigure) {
        updateFigurePreview(selectedFigure);
        markFigureNumbers();
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
        const boards = document.querySelectorAll('.bingoBoard');

        // Agregar estilo de borde temporalmente
        boards.forEach(board => {
            board.style.border = '2px solid black';
            board.style.padding = '10px';
        });

        for (let i = 0; i < boards.length; i++) {
            const canvas = await html2canvas(boards[i]);
            const imgData = canvas.toDataURL('image/png');

            const link = document.createElement('a');
            link.href = imgData;
            link.download = `bingo_carton_${i + 1}.png`;
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // Eliminar estilo de borde después de la captura
        boards.forEach(board => {
            board.style.border = '';
            board.style.padding = '';
        });
    });

    function createMasterBoard() {
    masterBoardContainer.innerHTML = '';
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

        // Marcar números previamente generados
        generatedNumbers.forEach(number => {
            const cell = board.querySelector(`[data-number="${number}"]`);
            if (cell) {
                cell.classList.add('marked');
            }
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
            cell.addEventListener('click', () => toggleMarkNumber(i));
            column.appendChild(cell);
        }
        return column;
    }

    function toggleMarkNumber(number) {
    const index = generatedNumbers.indexOf(number);
    if (index > -1) {
        generatedNumbers.splice(index, 1);
    } else {
        generatedNumbers.push(number);
    }
    saveState();

    // Marcar o desmarcar solo en el tablero maestro
    document.querySelectorAll('#masterBoardContainer .bingoCell').forEach(cell => {
        if (parseInt(cell.dataset.number) === number) {
            cell.classList.toggle('master-marked');
        }
    });

    // Marcar o desmarcar en el resto de los tableros
    document.querySelectorAll(`.bingoBoard .bingoCell`).forEach(cell => {
        if (!cell.closest('#masterBoardContainer') && parseInt(cell.dataset.number) === number) {
            cell.classList.toggle('marked');
        }
    });

    if (selectedFigure) {
        markFigureNumbers();
    }
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

            const boardNumberContainer = document.createElement('div');
            boardNumberContainer.classList.add('boardNumberContainer');
            
            const boardNumber = document.createElement('div');
            boardNumber.classList.add('bingoBoardNumber');
            boardNumber.textContent = `Cartón Nº ${i}`;

            const playerName = document.createElement('div');
            playerName.classList.add('playerName');
            playerName.textContent = playerNames[i] || 'Sin nombre';
            
            boardNumberContainer.appendChild(boardNumber);
            boardNumberContainer.appendChild(playerName);
            board.appendChild(boardNumberContainer);

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

        // Marcar los números generados
        generatedNumbers.forEach(number => {
            document.querySelectorAll(`[data-number="${number}"]`).forEach(cell => {
                cell.classList.add('marked');
            });
        });

        // Marcar los números de la figura si hay una seleccionada
        if (selectedFigure) {
            markFigureNumbers();
        }

     /*   currentPageSpan.textContent = currentPage; */
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
        const index = generatedNumbers.indexOf(number);
        if (index > -1) {
            generatedNumbers.splice(index, 1);
        } else {
            generatedNumbers.push(number);
        }
        saveState();
        document.querySelectorAll(`[data-number="${number}"]`).forEach(cell => {
            cell.classList.toggle('marked');
        });

        if (selectedFigure) {
            markFigureNumbers();
        }
    }

    function resetGame() {
        generatedNumbers = [];
        bingoBoardsState = {};
        playerNames = {};
        saveState();
        document.querySelectorAll('.bingoCell').forEach(cell => {
            cell.classList.remove('marked');
            cell.classList.remove('figure-marked');
        });
        masterBoardContainer.innerHTML = '';
        createMasterBoard();
        currentPage = 1;
        createBingoBoards(currentPage);
    }

   function clearMarks() {
    // Eliminar marcas en todos los tableros y en el tablero maestro
    document.querySelectorAll('.bingoCell.marked, .bingoCell.master-marked, .bingoCell.figure-marked').forEach(cell => {
        cell.classList.remove('marked', 'master-marked', 'figure-marked');
    });

    // Limpiar los números generados
    generatedNumbers = [];
    saveState();
}
    
    function saveState() {
        localStorage.setItem('generatedNumbers', JSON.stringify(generatedNumbers));
        localStorage.setItem('bingoBoardsState', JSON.stringify(bingoBoardsState));
        localStorage.setItem('playerNames', JSON.stringify(playerNames));
        localStorage.setItem('selectedFigure', selectedFigure);
        localStorage.setItem('currentPage', currentPage.toString());
    }

    function saveState() {
    localStorage.setItem('generatedNumbers', JSON.stringify(generatedNumbers));
    localStorage.setItem('bingoBoardsState', JSON.stringify(bingoBoardsState));
    localStorage.setItem('playerNames', JSON.stringify(playerNames));
    localStorage.setItem('selectedFigure', selectedFigure);
    localStorage.setItem('currentPage', currentPage.toString());

    // Guardar las marcas en la tabla maestra
    const masterBoardMarks = Array.from(document.querySelectorAll('#masterBoardContainer .bingoCell.master-marked')).map(cell => parseInt(cell.dataset.number));
    localStorage.setItem('masterBoardMarks', JSON.stringify(masterBoardMarks));
}

function loadState() {
    generatedNumbers = JSON.parse(localStorage.getItem('generatedNumbers')) || [];
    bingoBoardsState = JSON.parse(localStorage.getItem('bingoBoardsState')) || {};
    playerNames = JSON.parse(localStorage.getItem('playerNames')) || {};
    selectedFigure = localStorage.getItem('selectedFigure') || '';
    currentPage = parseInt(localStorage.getItem('currentPage')) || 1;

    // Cargar las marcas en la tabla maestra
    const masterBoardMarks = JSON.parse(localStorage.getItem('masterBoardMarks')) || [];
    masterBoardMarks.forEach(number => {
        const cell = document.querySelector(`#masterBoardContainer .bingoCell[data-number="${number}"]`);
        if (cell) {
            cell.classList.add('master-marked');
        }
    });

    // Actualizar el selector de figura
    if (selectedFigure) {
        selectFigure.value = selectedFigure;
    }
}
    
    function filterBoards() {
    const query = searchBox.value.trim().toLowerCase();
    let found = false;

    document.querySelectorAll('.bingoBoard').forEach(board => {
        board.classList.remove('blurry');
        board.classList.remove('highlighted-permanent');
    });

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
                        document.querySelectorAll('.bingoBoard').forEach(b => {
                            if (b !== board && !b.closest('#masterBoardContainer')) {
                                b.classList.add('blurry');
                            }
                        });
                        document.getElementById('masterBoardContainer').classList.remove('blurry');

                        board.classList.remove('blurry');
                        board.scrollIntoView({ behavior: 'smooth' });
                        board.classList.add('highlighted-permanent');

                        const closeButton = document.createElement('button');
                        closeButton.textContent = 'X';
                        closeButton.classList.add('closeButton');
                        closeButton.addEventListener('click', () => {
                            board.classList.remove('highlighted-permanent');
                            board.querySelector('.closeButton').remove();
                            document.querySelectorAll('.bingoBoard').forEach(b => {
                                b.classList.remove('blurry');
                            });
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
    saveState();
}

function updateFigurePreview(figure) {
    figurePreview.innerHTML = '';
    let cells = Array(25).fill(false);

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
            cells = [
                true, false, false, false, true,
                true, false, false, false, true,
                true, true, true, true, true,
                true, false, false, false, true,
                true, false, false, false, true
            ];
            break;
        case 'tree':
            cells = [
                false, false, true,  false, false,
                false, true,  true,  true,  false,
                true,  true, true,  true, true,
                false, false,  true,  false,  false,
                false, false, true,  false, false
            ];
            break;
        case 'numberOne':
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

    const board = document.createElement('div');
    board.classList.add('bingoBoard', 'small', 'figure-board'); 
    
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
    selectedFigure = figure;
    localStorage.setItem('selectedFigure', figure);
    markFigureNumbers();
}

function markFigureNumbers() {
    if (!selectedFigure) return;

    let cells = Array(25).fill(false);

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
                true, false, false, false, true,
                true, false, false, false, true,
                true, true, true, true, true,
                true, false, false, false, true,
                true, false, false, false, true
            ];
            break;
        case 'tree':
            cells = [
                false, false, true,  false, false,
                false, true,  true,  true,  false,
                true,  true, true,  true, true,
                false, false,  true,  false,  false,
                false, false, true,  false, false
            ];
            break;
        case 'numberOne':
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
        if (!board.classList.contains('figure-board')) {
            const boardCells = board.querySelectorAll('.bingoCell');
            boardCells.forEach((cell, index) => {
                const cellNumber = parseInt(cell.dataset.number);
                if (cells[index] && generatedNumbers.includes(cellNumber)) {
                    cell.classList.add('figure-marked');
                } else {
                    cell.classList.remove('figure-marked');
                }
            });
        }
    });
}

    const masterBoardCells = document.querySelectorAll('#masterBoardContainer .bingoCell');
    masterBoardCells.forEach((cell, index) => {
        const cellNumber = parseInt(cell.dataset.number);
        if (cells[index] && generatedNumbers.includes(cellNumber)) {
            cell.classList.add('figure-marked');
        } else {
            cell.classList.remove('figure-marked');
        }
    });
}

// Restaurar la figura seleccionada al cargar la página
if (selectedFigure) {
    updateFigurePreview(selectedFigure);
}

// Event listeners
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
    const boards = document.querySelectorAll('.bingoBoard');

    boards.forEach(board => {
        board.style.border = '2px solid black';
        board.style.padding = '10px';
    });

    for (let i = 0; i < boards.length; i++) {
        const canvas = await html2canvas(boards[i]);
        const imgData = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = imgData;
        link.download = `bingo_carton_${i + 1}.png`;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    boards.forEach(board => {
        board.style.border = '';
        board.style.padding = '';
    });
});

createMasterBoard();
createBingoBoards(currentPage);
});
