let secretNumber;
let remainingAttempts;
let gameOver;

function startGame() {
    secretNumber = Math.floor(Math.random() * 10) + 1;
    remainingAttempts = 5;
    gameOver = false;
    document.getElementById('message').textContent = 'Guess a number between 1 and 10.';
    document.getElementById('attempts').textContent = `Attempts left: ${remainingAttempts}`;
    document.getElementById('resultPanel').textContent = '';
    document.getElementById('guessInput').value = '';
}

function submitGuess() {
    if (gameOver) {
        return;
    }

    const guess = Number(document.getElementById('guessInput').value);
    if (!guess || guess < 1 || guess > 10) {
        document.getElementById('message').textContent = 'Please enter a valid number from 1 to 10.';
        return;
    }

    if (guess === secretNumber) {
        document.getElementById('message').textContent = 'Correct! You win.';
        document.getElementById('resultPanel').textContent = `The secret number was ${secretNumber}.`;
        gameOver = true;
        return;
    }

    remainingAttempts -= 1;
    document.getElementById('attempts').textContent = `Attempts left: ${remainingAttempts}`;

    if (remainingAttempts === 0) {
        document.getElementById('message').textContent = 'Game over. You have used all attempts.';
        document.getElementById('resultPanel').textContent = `The correct number was ${secretNumber}.`;
        gameOver = true;
        return;
    }

    if (guess > secretNumber) {
        document.getElementById('message').textContent = 'Too high. Try again.';
    } else {
        document.getElementById('message').textContent = 'Too low. Try again.';
    }

    document.getElementById('resultPanel').textContent = '';
}

function resetGame() {
    startGame();
}

startGame();
