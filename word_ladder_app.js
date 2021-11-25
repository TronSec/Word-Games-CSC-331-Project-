
const wordLadderGame = {
    totalSeconds: 301, // 5 minutes
    score: 0,
    hintsRemaining: 3,
    wordsCorrect: 0,
    roundsCompleted: 0,
    currInputBox: null,
    interval: {}
}


// Game data members
let wordList = ['rug', 'bug', 'bag', 'bat', 'cat'];
let wordDefinitions =  ['A thick woolen coverlet or wrap',
                        'A small insect',
                        'A container made out of flexible material',
                        'Used for hitting the ball in games such as baseball',
                        'A small domisticated mammal with soft fur and goes meow'];

////////////////////////////////////////////////////////////////////

            // FUNCTIONS //
function generateTopContainer(words) {
    // Create HTML Element above main container
    const topContainer = document.createElement('div');
    topContainer.classList.add('topContainer');


    // Title
    // Create HTML element where title will go
    const gameTitleContainer = document.createElement('div');
    gameTitleContainer.classList.add('titleContainer');

    // Title of the given game ' First word to Last Word '
    let gameTitle = words[0].toUpperCase() + ' to ' + words[words.length - 1].toUpperCase();
    gameTitleContainer.textContent = gameTitle;

    // Hint Area
    const hintArea = document.createElement('div');
    hintArea.classList.add('hintArea');
    hintArea.textContent = `Hint: ${wordLadderGame.hintsRemaining} Remaining`;
    // Hide hint area initially
    hintArea.style.display = 'none';

    // Add elements to page
    topContainer.append(hintArea);
    topContainer.append(gameTitleContainer);
    gameArea.prepend(topContainer);

    // Hint Area click event listner
    hintArea.addEventListener('click', (e) => {
        provideHint(words, hintArea);
    })
}

function provideHint(gameWords, hintElement) {
    let charToChangeIndex = 0;
    let currWord = '';

    for (let i = 0; i < gameWords.length; i++) {
        if (gameWords[i] ==  wordLadderGame.currInputBox.correctWord) {
            currWord = gameWords[i];
            let previousWord = gameWords[i-1];

            for (let i = 0; i < previousWord.length; i++) {
                if (previousWord.charAt(i) != currWord.charAt(i)) {
                    charToChangeIndex = i;
                }
            }
        }
    } // end for loop

    currWord = currWord.toUpperCase();
    let hintOutput = currWord.replace(currWord.charAt(charToChangeIndex), '_');

    // Check to see if hint provided has not already been provided
    if (hintOutput != wordLadderGame.currInputBox.placeholderText) {
        wordLadderGame.currInputBox.placeholderText = hintOutput;
        wordLadderGame.currInputBox.placeholder = hintOutput;

        // Update Hint Box
        wordLadderGame.hintsRemaining -= 1;
        hintArea.textContent = `Hint: ${wordLadderGame.hintsRemaining} Remaining`;

        if (wordLadderGame.hintsRemaining <= 0) {
            hintElement.style.display = 'none';
        }
    }

    
   
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

function setTimer() {
    wordLadderGame.totalSeconds--;
    secondsCounter.innerHTML = padNum((wordLadderGame.totalSeconds % 60));
    minutesCounter.innerHTML = Math.floor(wordLadderGame.totalSeconds / 60);

    if (wordLadderGame.totalSeconds <= 0)  {
        endGame();
        console.log('Game Over: You Lose');
    }
    
}

function updateScore() {
    wordLadderGame.score += 10;
    scoreOutput.textContent = `Score: ${wordLadderGame.score}`;
}

function endGame() {
    // Stop Timer
    clearInterval(wordLadderGame.interval);
}

function checkInput(userAnswer, correctAnswer, totalWords) {
    if (userAnswer.value.toLowerCase().trim() == correctAnswer.toLowerCase()) {
        userAnswer.value = correctAnswer.toUpperCase();
        userAnswer.style.background = 'lightgreen';
        userAnswer.disabled = true;
        updateScore();

        // Hide hint area
        hintArea = document.querySelector('.hintArea');
        hintArea.style.display = 'none';

        // Identify how many answers are correct
        wordLadderGame.wordsCorrect += 1;

        // End the current round and start the next
        if (wordLadderGame.wordsCorrect == (totalWords - 2)) {
            wordLadderGame.roundsCompleted += 1; // Update round completion

            // Check for Game Completion
            if (wordLadderGame.roundsCompleted == 3) {
                endGame();
                console.log('Game Over: You Win');
            }

            else {
                generateNewRound();
            }
            
        }
    }

    else {
        userAnswer.value = '';
        userAnswer.placeholder = 'INCORRECT';
        userAnswer.style.background = 'salmon';
    }
}

function generateNewRound() {
    // Remove all elements in current game area
    // And reset the Words Correct for the next round
    gameArea.innerHTML = '';
    wordLadderGame.wordsCorrect = 0;

    wordList = ['dove', 'dive', 'dire', 'dare', 'dark', 'lark'];
    wordDefinitions = [ 'A small wild pigeon, typically white',
                        'To plunge, especially headfirst, into water',
                        'Warning of or having dreadful or terrible consequences; calamitous',
                        'To confront boldly; brave',
                        'Lacking or having very little light',
                        'Any of several similiar birds, such as the meadowlark' ];

    generateTopContainer(wordList);
    generateContainers(wordList, wordDefinitions);


}

function generateInputContainers(word, docElement, totalWords) {
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('inputContainer');


    const inputBox = document.createElement('input');
    inputBox.classList.add('actualInput');

    inputBox.setAttribute('maxlength', word.length)

    inputContainer.style.display = 'inline'


    inputContainer.append(inputBox);

    docElement.append(inputContainer);

    //test
    inputBox.correctWord = word;
    inputBox.placeholderText = '';

    inputBox.addEventListener('focus', (e) => {
        // Identify the current box being tyoed in 
        // this will allow the hint functions to perform
        // correctly
        wordLadderGame.currInputBox = inputBox;
        console.log(wordLadderGame.currInputBox.correctWord);

        // Display Hint Area allowing players to get hints
        // for the current input box
        if (wordLadderGame.hintsRemaining > 0) {
            hintArea = document.querySelector('.hintArea');
            hintArea.style.display = 'inline';
        }
        
    })

    // Listen when key is pressed
    inputBox.addEventListener('keydown', (e) => {
        // Reset style to default if box style was marked as incorrect
        inputBox.style.background = 'rgb(56, 54, 54)';
        inputBox.placeholder = inputBox.placeholderText;
    })

    // Listen when Key is released
    inputBox.addEventListener('keyup', (e) => {
        if (inputBox.value.length == word.length || e.code == 'Enter') {
           checkInput(inputBox, word, totalWords);
        }

    })

}

function generateContainers(words, definitions) {
    // Create are for words and definitions
    const mainContainer = document.createElement('div');
    mainContainer.classList.add('mainContainer');
    gameArea.append(mainContainer);

    gameArea.append(timeAndScoreContainer);

    let totalWords = words.length


    for (let i = 0; i < totalWords; i++) {


        const wordPairContainer = document.createElement('div');
        wordPairContainer.classList.add('wordPairContainer');

        const definitionContainer = document.createElement('span');
        definitionContainer.classList.add('definitionContainer');
        definitionContainer.style.display = 'inline';
        definitionContainer.textContent = definitions[i];
        
        if ((i == 0) || (i == totalWords - 1)) {
            /*
            const holderContainer = document.createElement('div');
            holderContainer.classList.add('holderContainer');
            const wordDisplay = document.createElement('div');
            wordDisplay.classList.add('wordDisplay');

            wordDisplay.textContent = words[i].toUpperCase();
            holderContainer.append(wordDisplay);

            holderContainer.style.display = 'inline';
            wordPairContainer.append(holderContainer);
            */

            const inputContainer = document.createElement('div');
            inputContainer.classList.add('inputContainer');


            const inputBox = document.createElement('input');
            inputBox.classList.add('actualInput');


            inputContainer.style.display = 'inline'

            inputBox.value = words[i].toUpperCase();
            inputBox.disabled = true;

            inputContainer.append(inputBox);
            wordPairContainer.append(inputContainer);


           
        }

        else {
            generateInputContainers(words[i], wordPairContainer, totalWords);
        }
       
        
        wordPairContainer.append(definitionContainer);
        mainContainer.append(wordPairContainer);

        
        
    }
    

}

/////////////////////////////////////////////////////////////////////


// Create HTML elements
const gameArea = document.querySelector('.gameArea'); // Holds Main Game Elements

const timeAndScoreContainer = document.createElement('div');
timeAndScoreContainer.classList.add('timeAndScoreContainer');

const timeCounter = document.createElement('div'); // Timer
const minutesCounter = document.createElement('span');
const secondsCounter = document.createElement('span');
timeCounter.classList.add('gameTimer');

const scoreContainer = document.createElement('div');
const scoreOutput = document.createElement('span');
scoreContainer.classList.add('scoreContainer');

// Modify
// Timer
timeCounter.textContent = 'Time: ';
minutesCounter.textContent = '0';
secondsCounter.textContent = '00';

// Score
scoreOutput.textContent = `Score: ${wordLadderGame.score}`;


// Add to page
timeCounter.append(minutesCounter);
timeCounter.append(document.createTextNode(':'));
timeCounter.append(secondsCounter);

scoreContainer.append(scoreOutput);

timeAndScoreContainer.append(timeCounter);
timeAndScoreContainer.append(scoreContainer);
///////////////////////////////////////////////////////////////////////////////////
// Main //
randSortNum = 0.5 - Math.random()
// Randomly sort both arrays in the same order for matching
//wordList.sort(() => {return randSortNum});
//wordDefinitions.sort(() => {return randSortNum});
console.log(wordList);

// Start Timer and Game
wordLadderGame.interval = setInterval(setTimer, 1000);
setTimer();
generateTopContainer(wordList);
generateContainers(wordList,wordDefinitions);

