let moves = [], movesAI = [], images = [], tempArray = []; // consists of two images that user must swap 
let removedPiece = false, removedPiece2 = false;
let count = 0, movesCount = 0; // global count variable used when identifying where to move the user piece to 
let pieceUsed = "", movedPiece = "";
let userPoints = 0, aiPoints = 0;
let redPieces = ["41", "43", "45", "47", "50", "52", "54", "56", "57", "59", "61", "63"]; // starting pieces - create an AI logic function 
let pieces = document.querySelectorAll(".player");

for (let p of pieces) {
    p.style.cursor = "pointer";
    p.addEventListener("click", (event) => {
        if (count % 2 === 0 && p.innerHTML.includes("King")) {
            console.log("king"); 
            kingMoves(p, 7, "redPiece");
            kingMoves(p, 9, "redPiece"); 
            tempArray = [];
        } else if (count % 2 == 0 && p.innerHTML.includes("blackPiece")) {
            allPossibleMoves(p, 7);
            allPossibleMoves(p, 9); 
        }
        for (let m of moves) {
            m.style.backgroundColor = "red";
        }
        if ((count % 2 === 0 && p.innerHTML.includes("blackPiece")) || (count % 2 === 0 && p.innerHTML.includes("King"))) {
            images.push(p);
            count++;
        } else if (validPlaceToMove(moves, p) && count % 2 === 1 && p.innerHTML.includes("  ")) {
            images.push(p);
            count++;
        } else if (validPlaceToMove(moves, p)){
            images.pop();
            images.push(p);
        }
        if (images.length === 2) {
            if (images[1].id == "57" || images[1].id == "59" || images[1].id == "61" || images[1].id == "63" || images[0].innerHTML.includes("King")) {
                images[1].innerHTML = "<img src = 'images/blackPieceKing.png'>";
                kingRemovePiece(images[0]);
            } else {
                images[1].innerHTML = "<img src = 'images/blackPiece.webp'>";
            }
            images[0].innerHTML = "<img src = '  '>";
            for (let m of moves) {
                m.style.backgroundColor = "#C1BEBE"; 
            }
            
            removePiece(images[1]); 
            logicAI();
            if (pieceUsed.innerHTML.includes("King")) {
                kingRemovePiece2(pieceUsed);
            } else {
                removePiece2(pieceUsed);
            }
            images = [];
            moves = []; 
            removedPiece = false;
            removedPiece2 = false;
        }
        if (userPoints === 12) {
            alert("YOU WON!");
        }
        if (aiPoints === 12) {
            alert("YOU LOST!"); 
        }
    })
}

function allPossibleMoves(piece, number) { // piece is the actual element [all possible moves for the user] 
    moves = oneAcrossMove(piece, number); 
    let count = Number(piece.id) + number, nextCount = count + number;
    while (true) {
        try {  
            if (document.getElementById(String(count)).innerHTML.includes("redPiece") && document.getElementById(String(nextCount)).innerHTML.includes("  ")) {
                moves.push(document.getElementById(String(nextCount))); 
                removedPiece = true; 
            } else {
                break;
            }
            count += number;
            nextCount += (count + number);
        } catch (error) {
            break;
        }
    }
    return moves;  // returns all possible places to move [actual elements]
}

function oneAcrossMove(piece, number) { // helper function used for allPossibleMoves [for the user]
    try {
        if (document.getElementById(String(Number(piece.id) + number)).innerHTML.includes("  ")) {
            moves.push(document.getElementById(String(Number(piece.id) + number)));
        } 
    } catch (error) {}
    return moves;
}


function allPossibleMovesAI(piece, number) { // piece is the actual element [all possible moves for the AI]  
    movesAI = oneAcrossMoveAI(piece, number);
    let count = Number(piece.id) - number, nextCount = count - number;
    while (true) {
        try {  
            if (document.getElementById(String(count)).innerHTML.includes("blackPiece") && document.getElementById(String(nextCount)).innerHTML.includes("  ")) {
                movesAI.push(document.getElementById(String(nextCount)));
                removedPiece2 = true;
            } else {
                break;
            }
            count -= number;
            nextCount -= (count - number);   

        } catch (error) {
            break;
        }
    } 
    return movesAI; // returns all possible places to move [actual elements]
}

function oneAcrossMoveAI(piece, number) { // helper function used for AI
    try {
        if (document.getElementById(String(Number(piece.id) - number)).innerHTML.includes("  ")) {
            movesAI.push(document.getElementById(String(Number(piece.id) - number)));
        }
    } catch (error) {}
    return movesAI;
}

function logicAI() {
    let randomNumber = 0, randomNumberToMove = 0, moveTo = "";
    while (!moveTo) {
        randomNumber = Math.floor(Math.random() * redPieces.length);
        pieceUsed = document.getElementById(redPieces[randomNumber]);
        if (pieceUsed.innerHTML.includes("King")) {
            kingMoves(pieceUsed, 9, "blackPiece");
            kingMoves(pieceUsed, 7, "blackPiece");
        } else {
            allPossibleMovesAI(pieceUsed, 9);
            allPossibleMovesAI(pieceUsed, 7);
        }
        randomNumberToMove = Math.floor(Math.random() * movesAI.length);
        moveTo = movesAI[randomNumberToMove];
    } 
    if (moveTo.id == "8" || moveTo.id == "6" || moveTo.id == "4" || moveTo.id == "2" || pieceUsed.innerHTML.includes("King")) {
        moveTo.innerHTML = "<img src = 'images/redPieceKing.webp'>"; //find another one and change it to redpiece king 
    } else {
        moveTo.innerHTML = "<img src = 'images/redPiece.png'>";
    }
    pieceUsed.innerHTML = "<img src = '  '>";

    redPieces.push(moveTo.id);
    redPieces.splice(redPieces.indexOf(redPieces[randomNumber]), 1); 
    movedPiece = moveTo;
    movesAI = [];
}


function removePiece(piece) { // move to piece for AI and images[1] for user 
    let firstPiece = images[0], number = 0, count = Number(piece.id);
    if ((Number(piece.id) - Number(firstPiece.id)) % 9 === 0) {
        number = 9;
    } else {
        number = 7;
    }
    if (Number(firstPiece.id) + number === count) {
        return;
    }
    if (removedPiece) {
        while (count - number >= Number(firstPiece.id) && redPieces.indexOf(String(count - number)) != -1) { 
            document.getElementById(String(count - number)).innerHTML = "<img src = '  '>";
            redPieces.splice((redPieces.indexOf(String(count - number))), 1);  
            count -= (number * 2);
            userPoints++;  
            document.getElementById("user").textContent = "Your Points: " + userPoints;  
        }
    }
    movesAI = []; 
}

function removePiece2(piece) { // for the AI piece is moveTo
    let firstPiece = piece, number = 0, count = Number(movedPiece.id);
    if ((Number(firstPiece.id) - Number(movedPiece.id)) % 9 === 0) {
        number = 9;
    } else {
        number = 7;
    }
    if (Number(firstPiece.id) - number === count) {
        return;
    }
    if (removedPiece2) {
        while (count < Number(firstPiece.id)) {
            document.getElementById(String(count + number)).innerHTML = "<img src = '  '>"; 
            count += (number * 2);
            aiPoints++;  
            document.getElementById("ai").textContent = "AI Points: " + aiPoints;
        }
    }
    movesAI = []; 
}

function validPlaceToMove(moves, piece) {
    for (let m of moves) {
        if (m == piece) {
            return true;
        }
    }
    return false;
}

function kingMoves(piece, number, include) { 
    let count = 0, nextCount = 0;
    try {
        count = Number(piece.id) + number, nextCount = count + number; 
        if (document.getElementById(String(Number(piece.id) + number)).innerHTML.includes("  ")) {
            tempArray.push(document.getElementById(String(Number(piece.id) + number)));
        }
        while (true) {
            try {
                if (document.getElementById(String(count)).innerHTML.includes(include) && document.getElementById(String(nextCount)).innerHTML.includes("  ")) {
                    tempArray.push(document.getElementById(String(nextCount))); 
                    removedPiece = true; 
                } else {
                    break;
                }
                count += number;
                nextCount += (count + number);
            } catch (error) {
                break;
            }
                
        }
            
    } catch (error) {}
    count = 0, nextCount = 0;
    try {
        count = Number(piece.id) - number, nextCount = count - number;
        if (document.getElementById(String(Number(piece.id) - number)).innerHTML.includes("  ")) {
            tempArray.push(document.getElementById(String(Number(piece.id) - number)));
        }
        while (true) {
            try { 
                if (document.getElementById(String(count)).innerHTML.includes(include) && document.getElementById(String(nextCount)).innerHTML.includes("  ")) {
                    tempArray.push(document.getElementById(String(nextCount)));
                    removedPiece2 = true;
                } else {
                    break;
                }  
                count -= number;
                nextCount -= (count - number);   
                } catch (error) {
                    break;
                }
            }
        } catch (error) {}

    if (include === "redPiece") {
        moves = tempArray;
    } else {
        movesAI = tempArray;
    }
    movesCount++;
    if (movesCount % 2 === 0 ) {
        tempArray = [];
    }
}

function kingRemovePiece(piece) {
    let firstPiece = piece, number = 0, count = Number(images[1].id);
    if ((Number(firstPiece.id) - Number(images[1].id)) % 9 === 0) {
        number = 9;
    } else {
        number = 7;
    }
    if (count - number == firstPiece.id) {
        return;
    }
    if (removedPiece2) {
        while (count < Number(firstPiece.id)) {
            document.getElementById(String(count + number)).innerHTML = "<img src = '  '>";  
            redPieces.splice((redPieces.indexOf(String(count + number))), 1);  
            count += (number * 2);
            userPoints++;  
            document.getElementById("user").textContent = "Your Points: " + userPoints;
        }
    }
    movesAI = []; 
}


function kingRemovePiece2(piece) {
    let firstPiece = piece, number = 0, count = Number(movedPiece.id);
    if ((Number(movedPiece.id) - Number(firstPiece.id)) % 9 === 0) {
        number = 9;
    } else {
        number = 7;
    }
    if (Number(firstPiece.id) + number === count) {
        return;
    }
    if (removedPiece) {
        while (count - number >= Number(firstPiece.id) && redPieces.indexOf(String(count - number)) != -1) { 
            document.getElementById(String(count - number)).innerHTML = "<img src = '  '>";
            count -= (number * 2);
            aiPoints++;  
            document.getElementById("ai").textContent = "AI Points: " + aiPoints;
        }
    }
    movesAI = [];
}