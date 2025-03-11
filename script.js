const BOARD_SIZE = 700;

const sketchboard = document.querySelector("#sketch-board");
if (sketchboard === null) {
    console.log("Cannot find that");
}

// set board size
sketchboard.style.width = `${BOARD_SIZE}px`;
sketchboard.style.height = `${BOARD_SIZE}px`;

// number of grid for each side (will be made changeable later)
const sideCount = 64;


// calculate the size for each grid and number of grids
const gridSize = BOARD_SIZE / sideCount;
const gridCount = sideCount * sideCount;

for (let i = 0; i < gridCount; i++) {
    const minorGrid = document.createElement('div');
    // minorGrid.textContent = `${i+1}`;
    minorGrid.classList.add('minor-grid');
    minorGrid.style.minWidth = `${gridSize}px`;
    minorGrid.style.height = `${gridSize}px`;
    minorGrid.addEventListener
    sketchboard.appendChild(minorGrid);
}

sketchboard.addEventListener('mouseover', (e) => {
    e.target.classList.add('tainted');
})