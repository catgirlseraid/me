const allowedKeysModifier = ["Backspace", "Delete"]
const allowedKeysNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
const allowedKeysMovement = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"]
const validKeys = [].concat(allowedKeysModifier, allowedKeysNumbers, allowedKeysMovement)
const numberToLetter = ["a", "b", "c", "d", "e", "f", "g", "h", "i"]

let validatorCount = 0
let enteredNumber = []
let toValidator = []
let validNum = null
let invalidNumberLocationsToDraw = []
let inputArray = []
let invalidBoard = false
let allowOnlyInputField = ""
let solving = false

generateArray()

//generates the array
function generateArray() {
    inputArray = new Array(9).fill(null).map(() => new Array(9).fill(""));
}

addEventListener("keydown", keyPresses)

function keyPresses(event) {
    //this checks if a input is targetted
    if (event.target.id === "") {
        return
    }

    //only allows valid keys past this point
    if (!validKeys.includes(event.key)) {
        event.preventDefault()
        return
    }

    //arrow key and tab movement
    if (allowedKeysMovement.includes(event.key)) {

        if ((event.key === "ArrowLeft") && (event.target.id[1] > 1)) {
            document.getElementById(`${event.target.id[0]}${Number(event.target.id[1]) - 1}`).focus()
        }
        if ((event.key === "ArrowRight") && (event.target.id[1] < 9)) {
            document.getElementById(`${event.target.id[0]}${Number(event.target.id[1]) + 1}`).focus()
        }
        if ((event.key === "ArrowUp") && (event.target.id[0] != "a")) {
            document.getElementById(`${numberToLetter[numberToLetter.indexOf(event.target.id[0]) - 1]}${event.target.id[1]}`).focus()
        }
        if ((event.key === "ArrowDown") && (event.target.id[0] != "i")) {
            document.getElementById(`${numberToLetter[numberToLetter.indexOf(event.target.id[0]) + 1]}${event.target.id[1]}`).focus()
        }
        //nothing is needed for tab since the default behaviour is fine
        return
    }

    //if the value entered is the same as the value already there do nothing
    if (event.key === event.target.value) {
        event.preventDefault()
        return
    } 
    //this will only run if the board is invalid
    if (invalidBoard) {
        //if the board is invalid and the square isn't the square in allowonlyinputfield don't allow inputs
        if (allowOnlyInputField !== event.target.id) {
            event.preventDefault()
            return
        }
        
        //if the value is different clear invalid numbers
        else if ((allowedKeysNumbers.includes(event.key)) || (allowedKeysModifier.includes(event.key)) ){
            let count = 0
            for (const number of invalidNumberLocationsToDraw) {
                document.getElementById(invalidNumberLocationsToDraw[count]).classList.remove("error")
                count ++
            }
            invalidNumberLocationsToDraw = []
            document.getElementById(allowOnlyInputField).classList.remove("errorchange")
        } 
    }

    //if the number in the input is different from the number entered, the number in the input is changed
    if ((!isNaN(event.key)) && (event.target.value !== event.key)) {
        document.getElementById(event.target.id).value = event.key
    } else {
        //this makes delete work as expected, setting the box back to empty
        if (event.key === "Delete") {
            document.getElementById(event.target.id).value = ""
        }
        //this removes the number from inputArray
        if ((event.key === "Delete") || (event.key === "Backspace")) {
            inputArray[numberToLetter.indexOf(event.target.id[0])][(event.target.id[1]) - 1] = ""
        }
    }
    
    invalidBoard = false
    if (allowedKeysNumbers.includes(event.key)) {
        //format for saving numbers is [numbertobechecked][positionacross][positiondown]
        enteredNumber = []
        //positons adjusted to reflect the position in the array not the position on the grid
        enteredNumber.push(event.key, (event.target.id[1]) -1, numberToLetter.indexOf(event.target.id[0])) 
        toValidator = enteredNumber
        //call validator on the number so it can be added to invalidnumbers
        validator()
        
        if (!validNum) {
            invalidBoard = true
            drawInvalidNumbers()
        }
         //send the number to the stored array
        inputArray[enteredNumber[2]][enteredNumber[1]] = enteredNumber[0]
    }
}

//validating numbers
function validator() {
    validNum = false
    //validator count should go up by one every time the validator is called, for stat display purposes
    validatorCount++

    let numberToBeChecked = toValidator[0]
    let positionAcross = toValidator[1]
    let positionDown = toValidator[2]
    let positionDownLetter = numberToLetter[toValidator[2]]
    areValidNumbers = true

    //validating horizontal 
    if (inputArray[positionDown].includes(numberToBeChecked)) {
        areValidNumbers = false

        //if solving return to save time
        if (!solving) {
            //push current location in tovalidator to allowonlyinput field (letter number format)
            allowOnlyInputField = `${positionDownLetter}${positionAcross + 1}`

            //if tovalidator number position is not already in invalid numbers add it
            if (!invalidNumberLocationsToDraw.includes(`${positionDownLetter}${positionAcross + 1}`)) {
                invalidNumberLocationsToDraw.push(`${positionDownLetter}${positionAcross + 1}`)
            }

            //if the other number is not in invalid numbers also add their position as (letter number)
            if (!invalidNumberLocationsToDraw.includes(`${positionDownLetter}${inputArray[positionDown].indexOf(numberToBeChecked) + 1}`)) {
                invalidNumberLocationsToDraw.push(`${positionDownLetter}${inputArray[positionDown].indexOf(numberToBeChecked) + 1}`)
            }
        }
    } 

    //validate vertical
    let verticalColumn = inputArray.map((value) => value[positionAcross])

    if (verticalColumn.includes(numberToBeChecked)) {
        areValidNumbers = false

        //if solving return to save time
        if (!solving) {
            //push current location in tovalidator to allowonlyinput field (letter number format)
            allowOnlyInputField = `${positionDownLetter}${positionAcross + 1}`

            //if tovalidator number position is not already in invalid numbers add it
            if (!invalidNumberLocationsToDraw.includes(`${positionDownLetter}${positionAcross + 1}`)) {
                invalidNumberLocationsToDraw.push(`${positionDownLetter}${positionAcross + 1}`)
            }

            //if the other number is not in invalid numbers also add their position as (letter number)
            if (!invalidNumberLocationsToDraw.includes(`${numberToLetter[verticalColumn.indexOf(numberToBeChecked)]}${positionAcross + 1}`)) {
                invalidNumberLocationsToDraw.push(`${numberToLetter[verticalColumn.indexOf(numberToBeChecked)]}${positionAcross + 1}`)
            }
        }
    }
    //validating boxes
    //getting coords 
    let verticalStart = (Math.floor(positionDown / 3))*3
    let verticalEnd = ((Math.floor(positionDown / 3))*3)+3
    let horizontalStart = (Math.floor(positionAcross / 3))*3
    let horizontalEnd = ((Math.floor(positionAcross / 3))*3)+3

    //making the array to check
    let verticalDone = inputArray.slice(verticalStart, verticalEnd)
    let allDone = []
    for (const array of verticalDone) {
        allDone = allDone.concat(array.slice(horizontalStart, horizontalEnd))
    }
    
    if (allDone.includes(numberToBeChecked)) {
        areValidNumbers = false

        //return if solving to save time
        if (!solving) {
            //push current location in tovalidator to allowonlyinput field (letter number format)
            allowOnlyInputField = `${positionDownLetter}${positionAcross + 1}`

            //if tovalidator number position is not already in invalid numbers add it
            if (!invalidNumberLocationsToDraw.includes(`${positionDownLetter}${positionAcross + 1}`)) {
                invalidNumberLocationsToDraw.push(`${positionDownLetter}${positionAcross + 1}`)
            }
            //if the other number is not in invalid numbers also add their position as (letter number)
            //vertical
            let coordVertical = numberToLetter[Math.floor((allDone.indexOf(numberToBeChecked))/3) + verticalStart]
            let coordHorizontal = Math.floor(((allDone.indexOf(numberToBeChecked))%3) + horizontalStart)+ 1
        
            if (!invalidNumberLocationsToDraw.includes(`${coordVertical}${coordHorizontal}`)) {
                invalidNumberLocationsToDraw.push(`${coordVertical}${coordHorizontal}`)
            }
        }
    }
    if (areValidNumbers) {
        validNum = true
    } 
    toValidator = []
}

//status message display
function statusMessage(message, time) {
        //displays status message
        if (time !== 0) {
        document.getElementById("statusmessages").innerHTML = message
        document.getElementById("linebelowstatusbar").innerHTML = "<hr>"
        }
        //removes status message
        if (time === -1) {
            return
        }

        

        setTimeout(function(){
            document.getElementById("statusmessages").innerHTML = ""
            document.getElementById("linebelowstatusbar").innerHTML = ""
        }, time)
}

//saving and loading
document.querySelector("#savesudoku").addEventListener("click", saveSudoku)
document.querySelector("#loadsudoku").addEventListener("click", loadSudoku)
document.querySelector("#cleartable").addEventListener("click", clearSudoku)

function saveSudoku() {
    //TODO fix this mess later and do it properly
    //checks if there is any sudoku to save
    if (JSON.stringify(inputArray) === `[["","","","","","","","",""],["","","","","","","","",""],["","","","","","","","",""],["","","","","","","","",""],["","","","","","","","",""],["","","","","","","","",""],["","","","","","","","",""],["","","","","","","","",""],["","","","","","","","",""]]`) {
        statusMessage("Sudoku is empty!", 3000)
        return
    }
    
    localStorage.setItem("savedsudokuerrors", JSON.stringify(invalidNumberLocationsToDraw))
    localStorage.setItem("savedsudoku", JSON.stringify(inputArray))
    localStorage.setItem("allowOnlyInputField", allowOnlyInputField) 
    statusMessage("Sudoku saved", 3000)
}

function loadSudoku() {
    //if there is no saved sudoku return
    if (!localStorage.getItem("savedsudokuerrors")) {
        statusMessage("No sudoku in storage", 3000)
        return
    }
    statusMessage("Sudoku loaded", 3000)

    invalidNumberLocationsToDraw = JSON.parse(localStorage.getItem("savedsudokuerrors"))
    inputArray = JSON.parse(localStorage.getItem("savedsudoku"))
    allowOnlyInputField = localStorage.getItem("allowOnlyInputField")
    
    if (allowOnlyInputField !== "") {
        invalidBoard  = true
    } else {
        invalidBoard = false
    }
    drawScreen()
    //there is nothing here to draw the sudoku to the screen again, drawing will be a seperate function
}

function clearSudoku() {
    //TODO stop the solver from running if the solver is running before doing anything
    generateArray()
    drawScreen()
    let count = 0
    for (const number of invalidNumberLocationsToDraw) {
        
        document.getElementById(invalidNumberLocationsToDraw[count]).classList.remove("error")
        count ++
    }
    if (allowOnlyInputField) {
        document.getElementById(allowOnlyInputField).classList.remove("errorchange")
    }

    allowOnlyInputField = ""
    invalidNumberLocationsToDraw = []
    invalidBoard = false
    statusMessage("Sudoku cleared", 3000)
}

//drawing items from inputArray back into the input boxes
function drawScreen() {
    //in here is where i draw what is in inputArray onto the screen
    for (i = 0; i < 81; i++) {
        document.getElementById(`${numberToLetter[Math.floor(i / 9)]}${(i % 9) + 1}`).value = inputArray[Math.floor(i / 9)][i % 9]
        drawInvalidNumbers()
    }
    
}

function drawInvalidNumbers() {
    for (const number of invalidNumberLocationsToDraw) {
        document.getElementById(number).classList.add("error") 
    }
    //adds the single square that can be changed
    if (allowOnlyInputField) {
        document.getElementById(allowOnlyInputField).classList.add("errorchange")
    }
    
}

//displaying stats and the moveable status box
document.querySelector("#statsdisplaybutton").addEventListener("click", updateStats)
let statsout = false
function updateStats() {

    if (!statsout) {
        document.getElementById("statsdisplay").style.display = null
        updateStatsRefresh()
        statsout = true
    } else {
        document.getElementById("statsdisplay").style.display = "none"
        statsout = false
    }
}

//refresh the stats display
//TODO add a reset button somewhere on the page for stats
document.querySelector("#refreshforstatsbox").addEventListener("click", updateStatsRefresh)
function updateStatsRefresh() {
    document.getElementById("validatorcountdisplay").innerHTML = `validated: ${validatorCount}`
    document.getElementById("timetakentosolvesudoku").innerHTML = `time(ms): ${timeTaken}`
}


let isMovingStats = false
document.querySelector("#movementstats").addEventListener("mousedown", (() => {isMovingStats = true}))
document.addEventListener("mouseup", (() => {isMovingStats = false}))


document.addEventListener("mousemove", windowsMovement)
function windowsMovement(event) {
    if (isMovingStats) {
        let Y = Math.max(60, Math.min(event.clientY, window.innerHeight - document.getElementById("statsdisplay").offsetHeight - 15))
        let X = Math.max(0, Math.min(event.clientX, window.innerWidth - document.getElementById("statsdisplay").offsetWidth))
        document.getElementById("statsdisplay").style.top = `${Y - 2}px`
        document.getElementById("statsdisplay").style.left = `${X - 2}px`
    } 
}

//can be removed later - gravy time
gravyLandTime()
setInterval(gravyLandTime, 1000)
function gravyLandTime() {
    const currentTime = new Date();
    let gravytime = currentTime.toLocaleString('en-GB', { timeZone: 'America/St_Johns' });
    document.getElementById("gravytime").innerHTML = `Gravy Time: ${gravytime}`
}

//solving
document.querySelector("#solvesudoku").addEventListener("click", solveSudoku)
//TODO check if sudoku is empty before attempting to solve

//setting up variables i need
let placedNum = false
let validNumbersToTry = []
let timeTaken = 0


function solveSudoku() {
    statusMessage("Solving...", -1)
    solving = true
    let startTime = window.performance.now()
    solveSudokuGeneratePossibleNumbers()
    solveSudokuAlgorithm()
    solveSudokuRecursive()
    
    timeTaken = (window.performance.now() - startTime).toFixed(2)
    
    drawScreen()

    // discordWebhook(inputArray)
    solving = false
    //removes the displayed status
    statusMessage("", 0)
}

function solveSudokuGeneratePossibleNumbers() {
    validNumbersToTry = new Array(9).fill(null).map(() => new Array(9).fill(null).map(() => []));

    //each array
    for (arrayofarray = 0; arrayofarray < 9; arrayofarray++) {
        //each number in that array
        for (indexofsinglearray = 0; indexofsinglearray < 9; indexofsinglearray++) {
            //tries each number on a single number in array
            for (num1to9 = 1; num1to9 < 10; num1to9++) {
                if (inputArray[arrayofarray][indexofsinglearray] === "") {
                    toValidator = ["" + num1to9, indexofsinglearray, arrayofarray]
                    validator()
                    if (validNum) {
                        validNumbersToTry[arrayofarray][indexofsinglearray].push(num1to9)
                    }
                }
            }
        }
    }
}

function solveSudokuAlgorithm() {
    
    placedNum = false
    let numToBeRemoved = null
    //tells the user the status

    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            if (inputArray[i][j] === "") {
                if (validNumbersToTry[i][j].length === 1) {
                    inputArray[i][j] = "" + validNumbersToTry[i][j][0]
                    //TODO remove number from possible number in every relevant row, column and box

                    numToBeRemoved = validNumbersToTry[i][j][0]

                    //removes the number from valid numbers
                    validNumbersToTry[i][j].pop()

                   //removing duplicate numbers along the row
                   let index = undefined
                    for (e = 0; e < 9; e++) {
                        if ((validNumbersToTry[i][e] !== "") && (validNumbersToTry[i][e].includes(numToBeRemoved))) {
                            index = validNumbersToTry[i][e].indexOf(numToBeRemoved)
                            validNumbersToTry[i][e].splice(index, 1)
                        }
                    }

                    //removing duplicated numbers vertically
                    for (e = 0; e < 9; e++) {
                        if ((validNumbersToTry[e][j] !== "") && (validNumbersToTry[e][j].includes(numToBeRemoved))) {
                            index = validNumbersToTry[e][j].indexOf(numToBeRemoved)
                            validNumbersToTry[e][j].splice(index, 1)
                        }
                    }
                    
                    //validating boxes 
                    //TODO there has to be a better way to do this
                    let verticalStart = (Math.floor(i / 3))*3
                    let verticalEnd = ((Math.floor(i / 3))*3)+3
                    let horizontalStart = (Math.floor(j / 3))*3
                    let horizontalEnd = ((Math.floor(j / 3))*3)+3

                    let boxNumToCheck = []
                    boxNumToCheck.push([verticalStart, horizontalStart])
                    boxNumToCheck.push([verticalStart, horizontalStart + 1])
                    boxNumToCheck.push([verticalStart, horizontalStart + 2])
                    boxNumToCheck.push([verticalStart + 1, horizontalStart])
                    boxNumToCheck.push([verticalStart + 1, horizontalStart + 1])
                    boxNumToCheck.push([verticalStart + 1, horizontalStart + 2])
                    boxNumToCheck.push([verticalStart + 2, horizontalStart])
                    boxNumToCheck.push([verticalStart + 2, horizontalStart + 1])
                    boxNumToCheck.push([verticalStart + 2, horizontalStart + 2])

                    for (let array of boxNumToCheck) {
                        if ((validNumbersToTry[array[0]][array[1]] !== "") && validNumbersToTry[array[0]][array[1]].includes(numToBeRemoved)) {
                            index = validNumbersToTry[array[0]][array[1]].indexOf(numToBeRemoved)
                            validNumbersToTry[array[0]][array[1]].splice(index, 1)
                        }
                    }
                    placedNum = true
                }
            }
        }
    }
    if (placedNum) {
        solveSudokuAlgorithm()
    }
    //TODO possible optimisation, check if there's only one place for a number in a row, column or box
}


//different validator for the recursive solver since it has to check against a tempoary array
function validatorForRecursiveSolver() { 
    validNum = false
    //validator count should go up by one every time the validator is called, for stat display purposes
    validatorCount++

    let numberToBeChecked = toValidator[0]
    let positionAcross = toValidator[2]
    let positionDown = toValidator[1]
    let positionDownLetter = numberToLetter[toValidator[1]]
    areValidNumbers = true

    //validating horizontal 
    if (sudokuAlgorithmNumbers[positionDown].includes(numberToBeChecked)) {
        areValidNumbers = false
    } 

    //validate vertical
    let verticalColumn = sudokuAlgorithmNumbers.map((value) => value[positionAcross])

    if (verticalColumn.includes(numberToBeChecked)) {
        areValidNumbers = false
    }
    //validating boxes
    //getting coords 
    let verticalStart = (Math.floor(positionDown / 3))*3
    let verticalEnd = ((Math.floor(positionDown / 3))*3)+3
    let horizontalStart = (Math.floor(positionAcross / 3))*3
    let horizontalEnd = ((Math.floor(positionAcross / 3))*3)+3

    //making the array to check
    let verticalDone = sudokuAlgorithmNumbers.slice(verticalStart, verticalEnd)
    let allDone = []
    for (const array of verticalDone) {
        allDone = allDone.concat(array.slice(horizontalStart, horizontalEnd))
    }
    
    if (allDone.includes(numberToBeChecked)) {
        areValidNumbers = false
    }

    if (areValidNumbers) {
        validNum = true
    } 
    toValidator = []
}

//setting up variables i need
let sudokuAlgorithmNumbers = undefined
let mutatablePossibleNumbers = []
let allPossibleNumbersList = []


//TODO this is broken/never worked
//TODO the problem is that the first number tried will always be the first possible number
//i need to somehow make it so if it goes back to the first possible number it tries the next number
//if it goes back to the first square remove the number already in there from possible numbers
//create array of done squares
//when the first square only has one possible solution, set the logic to work on the second square instead
function solveSudokuRecursive() {
    //more variables
    //sudokuAlgorithmNumbers is the array i save to 
    //use possible numbers to check what squares i can place in
    sudokuAlgorithmNumbers = inputArray
    let i = 0
    let row = 0
    let column = 0
    toValidator = []
    let backtracking = false
    let index = 0
    let squarePossibleNumbersDelete = new Array(9).fill(null).map(() => new Array(9).fill(false));
    squarePossibleNumbersDelete[0][0] = true
    //debug
    let startTime = window.performance.now()
    mutatablePossibleNumbers = JSON.parse(JSON.stringify(validNumbersToTry))





    //format for saving numbers is [numbertobechecked][positionacross][positiondown]
    while (true) {  
        /*
        if (((window.performance.now() - startTime).toFixed(2)) > 60000) {
            console.log("ending due to timeout")
            return
        }
        */

        //managing row and column overflow and end conditions
        //forwards
        if (column > 8) {
            //console.log("changing row forward")
            column = 0
            row++
        }
        //backwards
        if (column < 0) {
            //console.log("changing row back")
            column = 8
            row--
        }
        //end condition
        if (row > 8) {
            console.log("end condition reached")
            break
        }
        
        //this can maybe be removed later
        //end condition if there is an error somewhere
        if ((row == 0) && (column < 0)) {
            console.log("sudoku is unsolvable")
            break
        }
        //end contion if there are no solutions and somehow row is -1 
        if (row === -1) {
            console.log("row is -1, stopping")
            break
        }
        

        //if the square should not be changed (it's aleady solved) this moves to the next one
        if (validNumbersToTry[row][column].length === 0) {
            if (backtracking) {
                column--
                //otherwise if going forward
            } else {
                column++
            }
            continue
        }

        //trying numbers
        while  (true) {
            //debug
            //if backtracking set the number to nothing
            if (backtracking) {
                sudokuAlgorithmNumbers[row][column] = ""
            }

            //if there are no more possible numbers when backtracing to a square, continue going backwards
            if (mutatablePossibleNumbers[row][column].length === 0) {
                //reset possible numbers for that square
                mutatablePossibleNumbers[row][column] = JSON.parse(JSON.stringify(validNumbersToTry[row][column]))
                column--
                break
            }

            //tries the first possible number
            toValidator = [`${mutatablePossibleNumbers[row][column][0]}`, row, column]
            validatorForRecursiveSolver()
            if (validNum) {
                backtracking = false
                //place the number and move to next number
                sudokuAlgorithmNumbers[row][column] = `${mutatablePossibleNumbers[row][column][0]}`

                console.log("number placed")
                //remove it from possible numbers so it won't be tried again?
                
               // removeFromMutatePossibleNumbers(mutatablePossibleNumbers[row][column][0], row, column)

                //TODO might need later
                mutatablePossibleNumbers[row][column].shift()
                column++
                break
                
            } else {
                //if there is no more possible numbers
                if (mutatablePossibleNumbers[row][column][1] === undefined) {
                    //reset possible numbers for that square
                    mutatablePossibleNumbers[row][column] = JSON.parse(JSON.stringify(validNumbersToTry[row][column]))

                    //reset possible numbers to backup before recurse


                    //go backwards
                    backtracking = true
                    column--
                    break
                }
                //if invalid number but there are still possible numbers to try
                mutatablePossibleNumbers[row][column].shift()
                continue
                
            }
        }
    }     
}

function removeFromMutatePossibleNumbers(number, row, column) {
    console.log("number to be removed")
    console.log(number)
    console.log("row")
    console.log(row)
    console.log("column")
    console.log(column)

    //removing duplicate numbers along the row
    let index = undefined

    for (e = 0; e < 9; e++) {
        if (mutatablePossibleNumbers[row][e].includes(number)) {
            index = mutatablePossibleNumbers[row][e].indexOf(number)
            mutatablePossibleNumbers[row][e].splice(index, 1)
        }
    }

    //removing duplicated numbers vertically
    for (e = 0; e < 9; e++) {
        if (mutatablePossibleNumbers[e][column].includes(number)) {
            index = mutatablePossibleNumbers[e][column].indexOf(number)
            mutatablePossibleNumbers[e][column].splice(index, 1)
        }
    }
    
    //validating boxes 
    //TODO there has to be a better way to do this
    let verticalStart = (Math.floor(row / 3))*3
    let verticalEnd = ((Math.floor(row / 3))*3)+3
    let horizontalStart = (Math.floor(column / 3))*3
    let horizontalEnd = ((Math.floor(column / 3))*3)+3

    let boxNumToCheck = []
    boxNumToCheck.push([verticalStart, horizontalStart])
    boxNumToCheck.push([verticalStart, horizontalStart + 1])
    boxNumToCheck.push([verticalStart, horizontalStart + 2])
    boxNumToCheck.push([verticalStart + 1, horizontalStart])
    boxNumToCheck.push([verticalStart + 1, horizontalStart + 1])
    boxNumToCheck.push([verticalStart + 1, horizontalStart + 2])
    boxNumToCheck.push([verticalStart + 2, horizontalStart])
    boxNumToCheck.push([verticalStart + 2, horizontalStart + 1])
    boxNumToCheck.push([verticalStart + 2, horizontalStart + 2])

    for (let array of boxNumToCheck) {
        if (mutatablePossibleNumbers[array[0]][array[1]].includes(number)) {
            index = mutatablePossibleNumbers[array[0]][array[1]].indexOf(number)
            mutatablePossibleNumbers[array[0]][array[1]].splice(index, 1)
        }
    }
}


//sending progress to discord webhook
// function discordWebhook(message) {
//     fetch("https://discord.com/api/webhooks/1222013599988580474/yATpHppwXInuPIHEvgoIgVFEAjeEipfB33GpMkV1p1REJjaSWx9mkTYbYxWPQNSRfEXs", {
//         method:"POST", 
//         headers: {
//             "Content-Type": "application/json",
//         }, 
//         body: JSON.stringify({
//             content: `${message}`
//         })
//     }).catch(() => {})

// }