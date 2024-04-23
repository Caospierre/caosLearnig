
const canvas = document.getElementById('gridCanvas');
const button = document.getElementById('resume');

const ctx = canvas.getContext('2d');
const lifeColors = ['#000', '#fff'];
const resumeColors = ['pausar', 'continuar'];

const squareSize = 50;
const {width: adjustedWidth, height: adjustedHeight, rows, cols} = getAdjustedCanvasSize(squareSize);
let world = buildWorld(rows, cols);
let isDrawingUser = false
let hasResume = false
canvas.width = adjustedWidth;
canvas.height = adjustedHeight;
canvas.style.backgroundColor = lifeColors[0];

function getAdjustedCanvasSize(squareSize) {
    const fullWidthSquares = Math.floor(window.innerWidth / squareSize);
    const fullHeightSquares = Math.floor(window.innerHeight / squareSize);
    const adjustedWidth = fullWidthSquares * squareSize;
    const adjustedHeight = fullHeightSquares * squareSize;
    return {
        width: adjustedWidth,
        height: adjustedHeight,
        rows: fullHeightSquares,
        cols: fullWidthSquares
    };
}

function buildWorld(rows, cols) {
    const world = [];
    for (let i = 0; i < rows; i++) {
        world[i] = [];
        for (let j = 0; j < cols; j++) {
            world[i][j] = {x: j * squareSize, y: i * squareSize, alive: false};
        }
    }
    return world;
}

function drawWorld(world) {
    world.forEach(row => {
        row.forEach(cell => {
            ctx.fillStyle = lifeColors[Number(cell.alive)];
            ctx.fillRect(cell.x, cell.y, squareSize, squareSize);
            ctx.strokeStyle = lifeColors[1];
            ctx.strokeRect(cell.x, cell.y, squareSize, squareSize);
            deadOrLife(cell.x, cell.y, cell.alive)
        });
    });
}

function countAliveNeighbors(world, row, col) {
    const rows = world.length;
    const cols = world[0].length;
    let count = 0;

    const positions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (const [dx, dy] of positions) {
        const newRow = row + dx;
        const newCol = col + dy;

        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            if (world[newRow][newCol].alive) {
                count++;
            }
        }
    }

    return count;
}

function nextGeneration(world) {
    const newWorld = _.cloneDeep(world)
    const rows = newWorld.length;
    const cols = newWorld[0].length;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const neighbors = countAliveNeighbors(world, i, j);
            const cell = world[i][j];

            if (cell.alive) {
                if (neighbors < 2 || neighbors > 3) {
                    newWorld[i][j].alive = false; // Muere por soledad o sobrepoblación
                }
            } else {
                if (neighbors === 3) {
                    newWorld[i][j].alive = true; // Nace por reproducción
                }
            }
        }
    }

    return newWorld;
}

function drawGrid() {
    drawWorld(world);
    if (!isDrawingUser && !hasResume)
        world = nextGeneration(world)
}

function deadOrLife(posX, posY, alive) {
    const cellSize = squareSize;
    const x = posX * cellSize;
    const y = posY * cellSize;
    ctx.fillStyle = lifeColors[Number(alive)]; // Convertir true/false a 1/0
    ctx.fillRect(x, y, cellSize, cellSize);
    ctx.strokeRect(x, y, cellSize, cellSize);
}

function resume() {
    hasResume = !hasResume;
}

function getCell(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const cellX = Math.floor(mouseX / squareSize);
    const cellY = Math.floor(mouseY / squareSize);

    const clickedCell = world[cellY][cellX];

    clickedCell.alive = event.button === 0
    world[cellY][cellX] = clickedCell;

    return clickedCell
}

function defineConfig(){
    button.textContent=resumeColors[Number(hasResume)]
}

canvas.addEventListener('mousemove', function (event) {

    const clickedCell = getCell(event)
    isDrawingUser = !_.isUndefined(clickedCell)

});


canvas.addEventListener("touchstart", function(event) {
    const clickedCell = getCell(event)
    isDrawingUser = !_.isUndefined(clickedCell)
});

canvas.addEventListener('mouseout', function (event) {
    isDrawingUser = false;

});


function live() {
    defineConfig()
    setInterval(() => {
        drawGrid();
    }, 700);
}

live()



