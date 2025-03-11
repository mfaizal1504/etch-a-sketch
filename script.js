// constants
const BOARD_SIZE = 700;
const DEFAULT_COUNT = 16;


// element selections
const sketchboard = document.querySelector("#sketch-board");
const setSizeButton = document.querySelector("#set-sketchpad")
const resetButton = document.querySelector("#reset-sketchpad")
const defaultRadio = document.querySelector("#default");
const colorfulRadio = document.querySelector("#colorful");


// checks (temp)
if (defaultRadio === null) {
    console.log("Cannot find default");
} else if (defaultRadio.checked) {
    console.log("Default selected");
}

if (colorfulRadio === null) {
    console.log("Cannot find default");
} else if (colorfulRadio.checked) {
    console.log("Default selected");
}

// set board size
sketchboard.style.width = `${BOARD_SIZE}px`;
sketchboard.style.height = `${BOARD_SIZE}px`;


// button actions
setSizeButton.addEventListener('click', createCustomGrids);
resetButton.addEventListener('click', resetBoard);

// default when starting up
createGrids(DEFAULT_COUNT);

// functions
function createCustomGrids() {

    // get number of grid for each side from prompt
    const sideCount = prompt("Number of squares per side, 1-100: ");
    clearBoard();
    createGrids(sideCount);
}

function clearBoard(){
    // clean up DOM under sketchpad
    sketchboard.innerHTML = "";
}

function resetBoard() {
    // reset the grids to untainted form
    Array.from(document.querySelectorAll('.minor-grid.tainted')).forEach(
        (el) => el.classList.remove('tainted')
    );
    Array.from(document.querySelectorAll('.minor-grid')).forEach(
        (el) => el.style.removeProperty('background-color')
    );
}



function createGrids(sideCount) {
    // create grids based on number of sideCount

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
        if (defaultRadio.checked) { // taint using default color
            e.target.style.removeProperty('background-color');
            e.target.classList.add('tainted');
        } else if (colorfulRadio.checked) { // taint using random rgb
            e.target.style.backgroundColor = randomizeColor();
        }
        
    })
}

function randomizeColor() {
    // return a randomized rng color
    return `rgb(${randomInteger(0,255)},${randomInteger(0,255)},${randomInteger(0,255)})`;
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min +1)) + min;
}