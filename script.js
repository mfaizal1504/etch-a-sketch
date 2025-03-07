const sketchboard = document.querySelector("#sketch-board");
if (sketchboard === null) {
    console.log("Cannot find that");
}

const iCount = 16;

for (i = 0; i < iCount; i++) {
    // create 'major' grid
    let majorGrid = document.createElement("div");
    majorGrid.classList.add("major-grid");

    //create 'minor' grid
    for (let j = 0; j < iCount; j++) {
        let minorGrid = document.createElement("div");
        minorGrid.classList.add("minor-grid");
        majorGrid.appendChild(minorGrid);
    };
    
    sketchboard.appendChild(majorGrid);    
}

sketchboard.addEventListener('mouseover', (e) => {
    e.target.classList.add("pathed");
})