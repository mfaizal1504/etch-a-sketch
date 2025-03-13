// constants
const BOARD_SIZE = 700;
const DEFAULT_COUNT = 16;


// element selections
const sketchboard = document.querySelector("#sketch-board");
const setSizeButton = document.querySelector("#set-sketchpad")
const resetButton = document.querySelector("#reset-sketchpad")
const defaultRadio = document.querySelector("#default");
const colorfulRadio = document.querySelector("#colorful");
const acidRadio = document.querySelector("#acid");
const slowfillRadio = document.querySelector("#slowfill")

// read values from css file
const root = document.querySelector(':root');
const defaultLineColor = getComputedStyle(root).getPropertyValue('--line-color');
const defaultBackColor = getComputedStyle(root).getPropertyValue('--bg-color');
const defaultTaintColor = getComputedStyle(root).getPropertyValue('--taint-color');

// derive defaultTaint as numbers only
const currentTaintColor = defaultTaintColor.replace('rgb(','').replace(')','');

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
    // reset the grids to original formatting while keeping the current size
    
    Array.from(document.querySelectorAll('.minor-grid')).forEach(
        (elem) => resetGrid(elem)
    );
}



function resetGrid(elem) {
    // reset minor-grid element
    // for default
    elem.classList.remove('tainted');
    elem.style.removeProperty('background-color');
    // reset for acid
    elem.classList.add('min-opacity');
    elem.classList.remove('mid-opacity');
    elem.classList.remove('max-opacity');
    elem.style.removeProperty('opacity');
    elem.classList.remove('corroded');
    // reset for slowfill
    elem.classList.add('no-pass');
    elem.classList.remove('passed');
    elem.classList.remove('full-pass');
}

function createGrids(sideCount) {
    // create grids based on number of sideCount

    // calculate the size for each grid and number of grids
    const gridSize = BOARD_SIZE / sideCount;
    const gridCount = sideCount * sideCount;

    for (let i = 0; i < gridCount; i++) {
        const minorGrid = document.createElement('div');
        // minorGrid.textContent = `${i+1}`; // to check number of grids
        minorGrid.classList.add('minor-grid');
        // add classes to be used as indicator for coloring
        minorGrid.classList.add('default-color'); // for slow fill since need to change the rgb to rgba
        minorGrid.classList.add('no-pass'); // for slow fill (no-pass, mid-pass, full-pass)
        minorGrid.classList.add('min-opacity'); // for acid (min-opacity, mid-opacity, max-opacity)
        minorGrid.style.minWidth = `${gridSize}px`;
        minorGrid.style.height = `${gridSize}px`;
        sketchboard.appendChild(minorGrid);
    }

    sketchboard.addEventListener('mouseover', (e) => {
        if (defaultRadio.checked) { // taint using default color
            defaultTaint(e);
        } else if (colorfulRadio.checked) { // taint using random rgb
            colorfulTaint(e);
        } else if (acidRadio.checked) {
            acidTaint(e);
        } else if (slowfillRadio.checked) {
            slowFill(e);
        }
        
    })
}

function defaultTaint(e) {
    // default, assign a class with formats predefined in css file
    if (e.target.classList.contains('minor-grid')) {
        clearAcid(e);
        clearSlowfill(e);
        e.target.classList.add('tainted');
    }
}

function colorfulTaint(e) {
    // assign random color to selected grid
    if (e.target.classList.contains('minor-grid')) {
        clearAcid(e);
        clearSlowfill(e);
        e.target.style.backgroundColor = randomizeColor();
    }
}

function acidTaint(e) {
    // making gradual change of color by changing opacity
    // opacity affect the border so it will be 'missing' until opacity is high enough
    if (e.target.classList.contains('minor-grid')) {
        clearSlowfill(e);
        if (e.target.classList.contains('min-opacity')) {
            e.target.style.removeProperty('background-color');
            e.target.classList.remove('min-opacity');
            e.target.classList.add('mid-opacity');
            e.target.classList.add('corroded');
            e.target.style.opacity = 0.1;
        } else if (e.target.classList.contains('mid-opacity')) {
            let currentOpacity = e.target.style.opacity;
            currentOpacity = parseFloat(currentOpacity) + 0.1;
            if (currentOpacity < 1.0) {
                e.target.style.opacity = currentOpacity;
            } else {
                e.target.style.opacity = currentOpacity;
                e.target.classList.remove('mid-opacity');
                e.target.classList.add('max-opacity');
            }
        }
    }
    
    
}

function slowFill(e) {
    // making gradual change of color by changing alpha for background color
    // keeping the border intact, unlike with acidTaint
    if (e.target.classList.contains('minor-grid')) {
        clearAcid(e);
        e.target.classList.remove('default-color');

        // different action based on class
        if (e.target.classList.contains('passed')) {
            let currentValue = e.target.style.backgroundColor;
            currentValue = currentValue.replace('rgba(','').replace(')','');

            // split and get the last value (a) and increase it
            const currentArray = currentValue.split(',');
            if (parseFloat(currentArray[3]) < 1.0) {
                currentArray[3] = parseFloat(currentArray[3]) + 0.1;
                if (currentArray[3] == 1.0) {
                    e.target.classList.remove('passed');
                    e.target.classList.add('full-pass');
                }
            } 

            e.target.style.backgroundColor = `rgba(${currentArray.join(',')})`;
        }

        if (e.target.classList.contains('no-pass')) {
            e.target.classList.remove('no-pass');
            e.target.classList.add('passed');
            e.target.style.backgroundColor = `rgba(${currentTaintColor},0.1)`;

        }
    }
}

function clearAcid(e) {
    // remove formatting made by acid function
    if (e.target.classList.contains('minor-grid')) {
        e.target.style.removeProperty('opacity');
        e.target.classList.remove('corroded');
        e.target.classList.add('min-opacity');
        
        if (e.target.classList.contains('mid-opacity')) {
            e.target.classList.remove('mid-opacity')
        }

        if (e.target.classList.contains('max-opacity')) {
            e.target.classList.remove('max-opacity')
        }
    }
}

function clearSlowfill(e) {
    // remove formatting made by slowfill function
    if (e.target.classList.contains('minor-grid')) {
        e.target.classList.remove('passed');
        e.target.classList.remove('full-pass');
        e.target.classList.add('no-pass');
        e.target.style.removeProperty('background-color');
    }
}

function randomizeColor() {
    // return a randomized rng color
    return `rgb(${randomInteger(0,255)},${randomInteger(0,255)},${randomInteger(0,255)})`;
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min +1)) + min;
}