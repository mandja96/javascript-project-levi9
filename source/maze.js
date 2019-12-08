//##########################################
// SOUND object

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}
const soundWin = new sound("../sound/soundWin.mp3");

//##########################################

const maze = new Maze(15, 15, 20);


// MAZE object
function Maze(rows, 
              cols, 
              time_limit) {

    this.TIME_LIMIT = time_limit;
    this.MAX_COLS = rows;
    this.MAX_ROWS = cols;
    this.numOfMoves = 0;
    this.soundOn = false;

    this.matrix = [];
    for (let i=0; i<2*this.MAX_ROWS-1; i++) {
        this.matrix[i] = [];
        for (let j=0; j<2*this.MAX_COLS-1; j++) {
            this.matrix[i][j] = 0;
        }
    }
    let checkbox = document.getElementById("sound");
    checkbox.addEventListener('change', e => {
        if(e.target.checked){
            this.soundOn = true;
        }
        else{
            this.soundOn = false;
        }
        console.log(this.soundOn);
    });

    this.initializeMaze = () => {
        let innerHTMLString = "";
        innerHTMLString = '<table>';
        for (let the_row = 1; the_row <= this.MAX_ROWS; the_row++) {
            innerHTMLString += '<tr>';
            for (let the_col = 1; the_col <= this.MAX_COLS; the_col++) 
                innerHTMLString += '<td id=\"r' + the_row + 'c' + the_col + '\"</td>';
            innerHTMLString += '</tr>';
        }
        innerHTMLString += '</table>';
    
        document.getElementById("maze_grid").innerHTML = innerHTMLString;
        this.generateMaze();
        generateState();
    };

    this.timerStarted = false;
    this.timer = 0;
    this.currentTimer = 0;

    this.previousState = {
        i : 1,
        j : 1
    }
    this.currentState = {
        i : 1,
        j : 1
    }
    this.endState = {
        i : this.MAX_ROWS,
        j : 1
    }

    this.generateMaze = () => {
        for (let the_row = 1; the_row <= this.MAX_ROWS; the_row++) {
            for (let the_col = 1; the_col <= this.MAX_COLS; the_col++) {
                
                let cell = 'r' + the_row + 'c' + the_col;
            
                if (the_row === 1) {
                    if (the_col === this.MAX_COLS)
                        continue;
                    document.getElementById(cell).style.borderRightStyle = "hidden";
                    this.matrix[2*the_row-2][2*the_col-2] = 1;
                    this.matrix[2*the_row-2][2*the_col-1] = 1;
                    this.matrix[2*the_row-2][2*the_col] = 1;
                }
                else if (the_col === this.MAX_COLS) {
                    document.getElementById(cell).style.borderTopStyle = "hidden";
                    this.matrix[2*the_row-3][2*the_col-2] = 1;
                    this.matrix[2*the_row-2][2*the_col-2] = 1;
                }
                else {
                    if (Math.random() >= 0.5) {                    
                        document.getElementById(cell).style.borderTopStyle = "hidden";
                        this.matrix[2*the_row-4][2*the_col-2] = 1;
                        this.matrix[2*the_row-3][2*the_col-2] = 1;
                        this.matrix[2*the_row-2][2*the_col-2] = 1;

                    } else {
                        document.getElementById(cell).style.borderRightStyle = "hidden";
                        this.matrix[2*the_row-2][2*the_col-2] = 1;
                        this.matrix[2*the_row-2][2*the_col-1] = 1;
                        this.matrix[2*the_row-2][2*the_col] = 1;
                    }
                }
            }
        }

        // START
        document.getElementById("r1c1").style.borderLeftStyle = "hidden";
        let end = 'r' + this.MAX_ROWS + 'c' + 1;

        // FINISH
        document.getElementById(end).style.borderLeftStyle = "hidden"; 
    };

    this.startMaze = () => {
        if (!this.timerStarted) {
            this.timerStarted = true;
            this.timer = window.setInterval(() => {
                this.currentTimer++;

                document.getElementById('timer')
                    .innerText = 'Timer status: ' + this.currentTimer;

                if (this.currentTimer === this.TIME_LIMIT) {
                    alert(" GAME OVER\n" + " Number of moves: " + this.numOfMoves); 
                    clearInterval(this.timer);
                    document.location.reload();
                }
            }, 1000)
            this.initializeMaze();
        }
    };

    this.resetMaze = () => {
        document.location.reload();
    };
}

const generateState = () => {
    let nameID = 'r' + maze.currentState.i + 'c' + maze.currentState.j;
    let cell = document.getElementById(nameID);
    let divPointer = document.createElement('div');
    divPointer.id = "pointer";
    divPointer.textContent = "x";

    cell.appendChild(divPointer);
    divPointer.style.backgroundColor = "rgb(54, 138, 21)";

    setTimeout(function() {
        checkFinish();
    }, 0)
};

window.addEventListener("keydown", event => {
    if (event.key === 'a') {
        if(maze.currentState.j === 1){
            console.log("Ne mozes levo!");
        }
        else{
            if (maze.matrix[2*maze.currentState.i-2][2*maze.currentState.j-3] === 1){ 
                maze.numOfMoves++;
                maze.previousState.i = maze.currentState.i;
                maze.previousState.j = maze.currentState.j;
                maze.currentState.i = maze.previousState.i;
                maze.currentState.j = maze.previousState.j - 1;

                let id = "pointer";
                document.getElementById(id).remove();
                generateState();
            }
        }
    }
});

window.addEventListener("keydown", event => {
    if (event.key === 'w') {
        if(maze.currentState.i === 1){
            console.log("Ne mozes gore!");
        }
        else{
            if(maze.matrix[2*maze.currentState.i-3][2*maze.currentState.j-2] === 1){
                maze.numOfMoves++;
                maze.previousState.i = maze.currentState.i;
                maze.previousState.j = maze.currentState.j;
                maze.currentState.i = maze.previousState.i - 1;
                maze.currentState.j = maze.previousState.j;

                let id = "pointer";
                document.getElementById(id).remove();
                generateState();
            }   
        }
    }
});

window.addEventListener("keydown", event => {
    if (event.key === 'd') {
        if(maze.currentState.j === maze.MAX_COLS){
            console.log("Ne mozes desno!");
        }
        else{
            if(maze.matrix[2*maze.currentState.i-2][2*maze.currentState.j-2+1] === 1){
                maze.numOfMoves++;
                maze.previousState.i = maze.currentState.i;
                maze.previousState.j = maze.currentState.j;
                maze.currentState.i = maze.previousState.i;
                maze.currentState.j = maze.previousState.j + 1;

                let id = "pointer";
                document.getElementById(id).remove();
                generateState();
            }
        }
    }
});

window.addEventListener("keydown", event => {
    if (event.key === 's') {
        if(maze.currentState.i === maze.MAX_ROWS){
            console.log("Ne mozes dole!");
        }
        else{
            if(maze.matrix[2*maze.currentState.i-2+1][2*maze.currentState.j-2] === 1){
                maze.numOfMoves++;
                maze.previousState.i = maze.currentState.i;
                maze.previousState.j = maze.currentState.j;
                maze.currentState.i = maze.previousState.i+1;
                maze.currentState.j = maze.previousState.j;

                let id = "pointer";
                document.getElementById(id).remove();
                generateState();
            }    
        }
    }
});

const checkFinish = () => {
    if (maze.currentState.i === maze.endState.i && maze.currentState.j === maze.endState.j){
        if(maze.soundOn){
            soundWin.play();
        }
        alert(" Yaaay! You mazed it :)\n" + " Total moves: " + maze.numOfMoves + "\n" 
            + " Total seconds: " + maze.currentTimer);
        document.location.reload();
    }
}

// #######################################