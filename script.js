// constants
const BOARD_SIZE = 700;
const DEFAULT_COUNT = 16;


// element selections
const sketchboard = document.querySelector("#sketch-board");
const setSizeButton = document.querySelector("#set-sketchpad")
const resetButton = document.querySelector("#reset-sketchpad")
const defaultRadio = document.querySelector("#default");
const colorfulRadio = document.querySelector("#colorful");

// read values from css file
const root = document.querySelector(':root');
let defaultLineColor = getComputedStyle(root).getPropertyValue('--line-color');
let defaultBackColor = getComputedStyle(root).getPropertyValue('--bg-color');
let defaultTaintColor = getComputedStyle(root).getPropertyValue('--taint-color');

// set board size
sketchboard.style.width = `${BOARD_SIZE}px`;
sketchboard.style.height = `${BOARD_SIZE}px`;

// button actions
setSizeButton.addEventListener('click', createCustomGrids);
resetButton.addEventListener('click', resetBoard);

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

console.log(defaultBackColor);
console.log(defaultLineColor);
console.log(defaultTaintColor);

// default when starting up
createGrids(DEFAULT_COUNT);

// functions
function createCustomGrids() {

    // get number of grid for each side from prompt
    const sideCount = parseInt(prompt("Number of squares per side, 1-100: "));
    if (validInput(sideCount)) {
        clearBoard();
        createGrids(sideCount);    
    } else {
        alert("Please enter a valid number from 1 to 100");
    }
    
}

function validInput(inputString) {
    return (parseInt(inputString) >= 1 && parseInt(inputString) <= 100);
        
}

function clearBoard(){
    // clean up DOM under sketchpad
    sketchboard.innerHTML = "";
}

function resetBoard() {
    // reset the grids to untainted form while keeping the grids
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
        // add classes to be used as indicator for coloring
        minorGrid.classList.add('no-pass'); // for slow fill (no-pass, mid-pass, full-pass)
        minorGrid.classList.add('min-opacity'); // for incinerate (min-opacity, mid-opacity, max-opacity)
        minorGrid.style.minWidth = `${gridSize}px`;
        minorGrid.style.height = `${gridSize}px`;
        // add opacity value for incinerate option
        minorGrid.style.opacity = '1.0';
        // minorGrid.addEventListener
        sketchboard.appendChild(minorGrid);
    }

    sketchboard.addEventListener('mouseover', (e) => {
        if (defaultRadio.checked) { // taint using default color
            defaultTaint(e);
        } else if (colorfulRadio.checked) { // taint using random rgb
            colorfulTaint(e);
        }
        
    })
}

function defaultTaint(e) {
    // default, assign a class with formats predefined in css file
    e.target.style.removeProperty('background-color');
    e.target.classList.add('tainted');
}

function colorfulTaint(e) {
    // assign random color to selected grid
    e.target.style.backgroundColor = randomizeColor();
}

function randomizeColor() {
    // return a randomized rng color
    return `rgb(${randomInteger(0,255)},${randomInteger(0,255)},${randomInteger(0,255)})`;
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min +1)) + min;
}