// Object
const jumbleGame = {
    totalSeconds: 0,
    score: 0,
    hintsRemaining: 4,
    interval: {},
    wordsCorrect: 0,
    finalStage:  false
 }

// Initial variables
let wordList = ['rural', 'joint', 'button', 'single'];
let finalQuestion = 'What They Felt When They Struck the Puzzle Motherlode: ';
let finalAnswer = 'jubilation';
/******************************************************************************/
// Functions
function setTimer() {
    jumbleGame.totalSeconds++;
    secondsCounter.innerHTML = padNum((jumbleGame.totalSeconds % 60));
    minutesCounter.innerHTML = Math.floor(jumbleGame.totalSeconds / 60);
    
}

function padNum(val) {
    let valString = val + ""; // turns val into string
    if (valString.length < 2) {
        return "0" + valString;
    }

    else {
        return valString;
    }
}

function startGame() {
    jumbleGame.hintsRemaining = 4;
    jumbleGame.interval = setInterval(setTimer, 1000);
    wordList.sort(() => {return 0.5 - Math.random()});

    generateContainers(wordList, finalAnswer);
}

function endGame() {
    // Stop Timer
    clearInterval(jumbleGame.interval);

    //Show Menu
    endMenu.style.display = 'flex';

    // Hide gameArea timer and score
    timeCounter.style.display = 'none';
    scoreContainer.style.display = 'none';

    // Set correct data for final game results to be displayed
    timeResult.textContent = timeCounter.textContent
    scoreResult.innerHTML = `Score:<br>${jumbleGame.score}`;
}

function updateScore() {
    // 5X multiplier for answering within the first 30 seconds
    if (jumbleGame.totalSeconds <= 30) {
        jumbleGame.score += (10 * 5);
    }

    // 4X multiplier for answering within the first minute
    else if ((jumbleGame.totalSeconds > 30) && (jumbleGame.totalSeconds <= 60)) {
        jumbleGame.score += (10 * 4);
    }
    
    // 3X multiplier for answering within the second minute
    else if ((jumbleGame.totalSeconds > 60) && (jumbleGame.totalSeconds <= 120)) {
        jumbleGame.score += (10 * 3);
    }

    // 2X multiplier for answering within the third minute
    else if ((jumbleGame.totalSeconds > 120) && (jumbleGame.totalSeconds <= 180)) {
        jumbleGame.score += (10 * 2);
    }

    // Normal 10 points for getting the word right after fourth minute
    else {
        jumbleGame.score += 10;
    }

    scoreOutput.textContent = `Score: ${jumbleGame.score}`;
}

function scrambleWord(word) {
    let scrambledWord = word.split('');
    scrambledWord.sort(() => {return 0.5 - Math.random()}); // scrambles string from myWords Array
    scrambledWord = scrambledWord.join(''); // reunites string array back into regular string

    // Make sure that the scrambled word is not identical to the original
    while (scrambledWord == word) {
        scrambledWord = scrambleWord(scrambledWord);
    }

    return scrambledWord;
}

function checkInput(inputArea, correctAnswer, hintElement) {
    // Stores all input elements from inputArea into variable
    let inputElements = inputArea.querySelectorAll('input');
    let inputList = [];

    inputElements.forEach((element, index) =>{
        // if original string has a space, input space in user input string
        // else input the value the user has input
        let inputValue = (element.correctChar == ' ') ? ' ' : element.value;
        inputList.push(inputValue);
    })

    // Creates string from array
    // string will be used to check for correct match to the answer
    let userInput = inputList.join('').toLowerCase().trim();
   
    ////////////////////////////////////////

    // get value from input

    // Compare input to correct answer
    if (userInput == correctAnswer.toLowerCase()) {
        // hide hint element for word
        hintElement.style.display = 'none';

        inputElements.forEach((element, index) =>{
            // if original string has a space, input space in user input string
            // else input the value the user has input
            element.style.background = 'lightgreen';
            element.disabled = true;
        })

        jumbleGame.wordsCorrect += 1;
        updateScore();
        //console.log(jumbleGame.wordsCorrect);

        // Check to see if all visible words have been
        // un-jumbled
        if ((jumbleGame.wordsCorrect == wordList.length) && (jumbleGame.finalStage == false)) {
            jumbleGame.finalStage = true;
            console.log('move to final stage');
            generateFinalQuestion();
        }

        // Only executes if final question is answered
        if ((jumbleGame.finalStage == true) && jumbleGame.wordsCorrect > wordList.length) {
            endGame();
        }
    }

    else {
        // Indicate player is incorrect 
        inputElements.forEach((element, index) =>{
            // if original string has a space, input space in user input string
            // else input the value the user has input
            element.style.background = 'salmon';
        })
    }

}

// Cbecks to see if character is alphabetic
function validCharacter(char, word) {
    for (let i = 0; i < word.length; i++) {
        if (char == word.charAt(i)) {
            return true;
        }
    }
    return false;
}

function generateJumbledWord(word, docElement) {
    const letterContainer = document.createElement('div');
    letterContainer.classList.add('letterContainer');

    let jumbledWord = scrambleWord(word);
    jumbledWord = jumbledWord.toUpperCase();
    let JumbledWordArray = jumbledWord.split('');

    for (let i = 0; i < JumbledWordArray.length; i++) {
        const letterBox = document.createElement('span');
        letterBox.classList.add('letterBox');

        letterBox.textContent = JumbledWordArray[i];
        letterContainer.append(letterBox);
        docElement.append(letterContainer);
        

    }
}

function generateInputArea(word, docElement, letterBoxArea, charsForFinalAnswer, hintElement) {
    // Get all letter box elements in letterBox area
    let letterBoxes = letterBoxArea.querySelectorAll('span');
    //console.log(letterBoxes);

    // Make a string of the last answers chars to be used to identify
    // which input box needs special styling
    let finalChars = charsForFinalAnswer.join('');
    
    // Mutable string that represents the text above 
    // this will determine which characters the user 
    // can input into the boxes
    let textAbove = word;
    //console.log(textAbove)

    // Check to see if all input boxes have been filled
    let inputAreaCharSize = 0;

    for (let i = 0; i < word.length; i++) {
        // Create input box and define basic attributes
        const playerInputBox = document.createElement('input');
        playerInputBox.setAttribute('maxlength', 1);
        playerInputBox.classList.add('inputBox');

        // Check if input box needs special styling to 
        // indicate to player that the input will be 
        // a letter in the final answer
        if (finalChars.includes(word.charAt(i))) {
            playerInputBox.style.background = 'lightskyblue';
            playerInputBox.style.borderRadius = '30px';
            finalChars = finalChars.replace(word.charAt(i), '');
        }

        // variable that determines if special class
        // should be applied to input box to indicate
        // it is a charcter of the final jumbled word
        playerInputBox.isFinalCharacter = false;
        
        playerInputBox.isCorrect = false;

        playerInputBox.correctChar = word.charAt(i);

        playerInputBox.userChar = '';

        // Disable boxes that are spaces
        if(word.charAt(i) == ' ') {
            playerInputBox.disabled = true;
        }

        docElement.append(playerInputBox);

        // Input event listeners
        // When user is in input box
        /*
        playerInputBox.addEventListener('focus', (e) => {
            if (playerInputBox.isCorrect == false) {
                // Capitilize and display input
                currInputLetter = playerInputBox.value
                console.log(currInputLetter);

            }
        }) */


        // When user releases key in the input box
        playerInputBox.addEventListener('keyup', (e) =>{
            let validExpression = /[A-Za-z]/;
            let moveToNextBox = false;   // determines wheter it is apprpriate to focus on next input
            let nextBox = e.target.nextElementSibling // next input box
            let previousBox = e.target.previousElementSibling; // previous input box


             // Go to previous box when the key is Backspace
             if (e.key == 'Backspace') {
                 // If there is a character currently
                if (playerInputBox.userChar != '') {
                    // Subtract 1 from the total character count 
                    inputAreaCharSize -= 1;
                    //console.log(inputAreaCharSize);
                }

                if (previousBox != null) {
                    // Check if previous is a space location if so select the element
                    // previous to the space
                    if (previousBox.disabled == true) {
                        previousBox = previousBox.previousElementSibling;
                    }
                    // Check all letterboxes in the jumbled word area
                    // If the player removed a letter box from the area 
                    // above make sure it is returned properly when the player
                    // types 'Backspace'
                    for (let i = 0; i < letterBoxes.length; i++) {
                        // Check if the char being deleted belongs above and the style is not displayed
                        if ((letterBoxes[i].textContent.toLowerCase() == playerInputBox.userChar) && (letterBoxes[i].style.display == 'none')) {
                            // Redisplay letterbox above and
                            // set the input box to empty 
                            letterBoxes[i].style.display = 'inline'; 
                            playerInputBox.value = '';

                            // Update textAbove to represent which characters are shown
                            // above
                            textAbove += playerInputBox.userChar;

                            // Empty out value to correctly update system
                            // the player box no longer holds any char value
                            playerInputBox.userChar = '';
                            break;
                        }
                    }

                    // move focus to previous box
                    previousBox.focus();
                }
                    
                // Condition is met when player hits 'Backspace on the first input
                // box
                else { 
                    // Repeat the same steps as previous condition except do not
                    // focus on a previous element
                    for (let i = 0; i < letterBoxes.length; i++) {
                        if ((letterBoxes[i].textContent.toLowerCase() == playerInputBox.userChar) && (letterBoxes[i].style.display == 'none')) {
                            letterBoxes[i].style.display = 'inline';
                            playerInputBox.value = '';
                            textAbove += playerInputBox.userChar;
                            playerInputBox.userChar = '';
                            break;
                        }
                    }
                    
                }
                
                
            }

            // If the user does not press backspace check if the key is 
            // valid
            else if (validExpression.test(e.key) && e.key.length == 1) {
                // Check to see if key pressed are the visible 
                // available chars to use
                if (validCharacter(e.key, textAbove)) {
                    // Check to see if there is no current userChar
                    if (playerInputBox.userChar == '') {
                        // Increment the char count
                        inputAreaCharSize += 1;
                        //console.log(inputAreaCharSize);
                    }

                    // Capitialize words in box
                    playerInputBox.value = e.key.toUpperCase();
                    // Update what is visible
                    textAbove = textAbove.replace(e.key, '');
                    moveToNextBox = true;

                    // Make sure the box does not lose the existing char
                    // inside if there is one in there
                    if (playerInputBox.userChar != '') {
                        // Return the previous character to textAbove
                        // and redisplay
                        for (let i = 0; i < letterBoxes.length; i++) {
                            if ((letterBoxes[i].textContent.toLowerCase() == playerInputBox.userChar) && (letterBoxes[i].style.display == 'none')) {
                                letterBoxes[i].style.display = 'inline';
                                textAbove += playerInputBox.userChar;
                                break;
                            }
                        }
                    }
                    // Store valid user input to reference when backspacing
                    playerInputBox.userChar = e.key.toLowerCase();

                    // Remove appropriate character letterbox from display
                    for (let i = 0; i < letterBoxes.length; i++) {
                        // Search letterboxes for a letterbox that mathches player key press
                        // and the display is visible
                        if ((letterBoxes[i].textContent.toLowerCase() == e.key.toLowerCase()) && (letterBoxes[i].style.display != 'none')) {
                            letterBoxes[i].style.display = 'none';  // Hide display
                            break;    // Leave to not hide repeat characters
                        }
                    }
                }
                
                else {
                    // if the input box had a pre existing character when typed to
                    // capitalize new character the box will hold
                    if (playerInputBox.userChar != '') {
                        playerInputBox.value = playerInputBox.userChar.toUpperCase();
                    }
                    
                    // Show no contents in the input box
                    else {
                        playerInputBox.value = '';
                    }
                }
            }

            // Go to the next input element when all correct conditions 
            // have been met in the current one
            // if we haven't reached the end of the input
            if ((nextBox != null) && (moveToNextBox == true)) {
                // if the next box is not a space
                if(nextBox.disabled == true) {
                    nextBox = nextBox.nextElementSibling;
                }
                // select the next box
                nextBox.focus();
            }
            
            // Chekcks once end has been reached
            /*
            if (nextBox == null && (e.key != 'Backspace') && (moveToNextBox == true)) {
                checkInput(docElement, word);
            }
            */

            if (inputAreaCharSize == word.length) {
                checkInput(docElement, word, hintElement);
            }
            
        })
    }
}

function provideHint(word, inputArea) {
    
    let inputElements = inputArea.querySelectorAll('input');

    for (let i = 0; i < inputElements.length; i++) {
        if (inputElements[i].placeholder == '' && inputElements[i].value == '') {
            inputElements[i].placeholder = word.charAt(i).toUpperCase();

            // Decrement available hints
            jumbleGame.hintsRemaining -= 1;
            console.log(jumbleGame.hintsRemaining);

            // Update hint counter
            hintCounter.textContent = `Hints Remaining: ${jumbleGame.hintsRemaining}`

            // Remove hints when there are no more remaining
            if (jumbleGame.hintsRemaining <= 0) {
                let hintElements = gameArea.querySelectorAll('.hintArea');
                hintElements.forEach((element, index) => {
                    // hide hint element
                    element.style.display = 'none';
                })
            }
            
            break;
        }
    } 
    
}

function generateHintArea(word, docElement, inputArea) {

    const hintButton = document.createElement('button');
    hintButton.classList.add('hintButton');
    hintButton.textContent = '?';

    docElement.append(hintButton);

    hintButton.addEventListener('click', (e) => {
        provideHint(word, inputArea);
    })
}

function generateContainers(listArray, finalGameWord) {
    finalGameWord = finalGameWord.toLowerCase();
    for (let i = 0; i < listArray.length; i++) {
        // This array will be used to identify which input boxes need
        // special styling to let the player know the box will be used 
        // for the final jumbled word
        let currWord = listArray[i];
        let charsForFinalAnswer = [];

        // Check if character is in final word if so append to array
        // remove character from string so it is not used repeatedly
        for (let i = 0; i < currWord.length; i++ ) {
            if (finalGameWord.includes(currWord.charAt(i))) {
                charsForFinalAnswer.push(currWord.charAt(i));
                finalGameWord = finalGameWord.replace(currWord.charAt(i), '');
            }
        }
        
        const wordPairContainer = document.createElement('div');
        wordPairContainer.classList.add('wordPairContainer')

        const jumbledWordArea = document.createElement('div');
        jumbledWordArea.classList.add('jumbledWordContainer')

        const hintArea = document.createElement('div');
        hintArea.classList.add('hintArea');
        

        const playerInputArea = document.createElement('div');
        playerInputArea.classList.add('inputArea');
        
        generateJumbledWord(listArray[i], jumbledWordArea);
        generateInputArea(listArray[i], playerInputArea, jumbledWordArea, charsForFinalAnswer, hintArea);
        generateHintArea(listArray[i], hintArea, playerInputArea);
        

        wordPairContainer.append(hintArea);
        wordPairContainer.append(jumbledWordArea);
        wordPairContainer.append(playerInputArea);

        gameArea.append(wordPairContainer);

    }
}

function generateFinalQuestion() {
    let finalAnswerArray = finalAnswer.split('');

    const finalQuestionPairContainer = document.createElement('div');
    finalQuestionPairContainer.classList.add('finalPairContainer');
    
    const questionPrompt = document.createElement('div');
    questionPrompt.classList.add('questionPrompt');
    questionPrompt.textContent = finalQuestion;

    const finalJumbledWordArea = document.createElement('div');
    finalJumbledWordArea.classList.add('jumbledWordContainer');
    generateJumbledWord(finalAnswer,finalJumbledWordArea);

    const hintArea = document.createElement('div');
    hintArea.classList.add('hintArea');

    const inputArea = document.createElement('div');
    inputArea.classList.add('inputArea');
    generateInputArea(finalAnswer, inputArea, finalJumbledWordArea, finalAnswerArray, hintArea);

    if (jumbleGame.hintsRemaining > 0) {
        generateHintArea(finalAnswer, hintArea, inputArea);
    }


    finalQuestionPairContainer.append(questionPrompt);
    finalQuestionPairContainer.append(hintArea);
    finalQuestionPairContainer.append(finalJumbledWordArea);
    finalQuestionPairContainer.append(inputArea);

    gameArea.append(finalQuestionPairContainer);
}



/******************************************************************************/
//// Assign current HTML elements to variables ////
const gameArea = document.querySelector('.gameArea');
const endMenu = document.querySelector('.endMenuContainer');
const gameResultContainer = document.querySelector('.gameResultContainer');
const buttonContainer = document.querySelector('.buttonContainer');


//// Create HTML Elements ////
// Game Area elements
const timeCounter = document.createElement('div');
const minutesCounter = document.createElement('span');
const secondsCounter = document.createElement('span');
timeCounter.classList.add('gameTimer');

const scoreContainer = document.createElement('div')
const scoreOutput = document.createElement('div');
scoreContainer.classList.add('scoreContainer');

const hintCounter = document.createElement('div');
hintCounter.classList.add('hintCounter');

// End Menu elements
const timeResult = document.createElement('div');
const scoreResult = document.createElement('div');
timeResult.classList.add('gameResult');
scoreResult.classList.add('gameResult');


const replayButton = document.createElement('button');
const newGameButton = document.createElement('button');
const mainMenuButton = document.createElement('button');
replayButton.classList.add('endMenuButton');
newGameButton.classList.add('endMenuButton');
mainMenuButton.classList.add('endMenuButton');


//// Modify HTML Elements////

// Timer
timeCounter.textContent = 'Time: ';
minutesCounter.textContent = '0';
secondsCounter.textContent = '00';

// Score
scoreOutput.textContent = `Score: ${jumbleGame.score}`;

hintCounter.textContent = `Hints Remaining: ${jumbleGame.hintsRemaining}`;

// End Menu
endMenu.style.display = 'none';

timeResult.innerHTML = `Time:<br> 0:00`;
scoreResult.innerHTML = 'Score:<br> 000';

replayButton.textContent = 'Replay';
newGameButton.textContent = 'New Game';
mainMenuButton.textContent = 'Main Menu'


//// Append HTML Elements ////
timeCounter.append(minutesCounter);
timeCounter.append(document.createTextNode(':'));
timeCounter.append(secondsCounter);

scoreContainer.append(scoreOutput);


gameArea.prepend(timeCounter);
gameArea.append(scoreContainer);
gameArea.append(hintCounter);


gameResultContainer.append(timeResult);
gameResultContainer.append(scoreResult);

buttonContainer.append(replayButton);
buttonContainer.append(newGameButton);
buttonContainer.append(mainMenuButton);



/*******************************************************************************/
//// Main ////
startGame();

// Replay button event listener
replayButton.addEventListener('click', (e) => {
    console.log('replay')

    // Reset game variables to default
    gameArea.innerHTML = '';

    jumbleGame.totalSeconds = 0;
    jumbleGame.score = 0;
    jumbleGame.wordsCorrect = 0;
    jumbleGame.finalStage = false;

    // Hide menu and restart game
    endMenu.style.display = 'none';
    timeCounter.style.display = 'block';
    scoreContainer.style.display = 'block';

    // Add timer and score elements back to the page
    gameArea.prepend(timeCounter);
    gameArea.append(scoreContainer);
    
    // Reset timer and score and start game
    minutesCounter.textContent = '0';
    secondsCounter.textContent = '00';
    scoreOutput.textContent = `Score: 0`;
    startGame();
})
