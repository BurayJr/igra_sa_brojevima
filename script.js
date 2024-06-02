document.addEventListener('DOMContentLoaded', () => {
    let score = 0;
    let timeLeft = 60;
    let timerId;
    let randomNumber;
    let playerName;

    function getPlayerName() {
        if (!localStorage.getItem('playerName')) {
            playerName = prompt('Enter your name:');
            localStorage.setItem('playerName', playerName);
        } else {
            playerName = localStorage.getItem('playerName');
        }
    }

    getPlayerName();

    const cardsContainer = document.querySelector('.cards-container');
    const message = document.getElementById('message');
    const timerElement = document.getElementById('timer');
    const replayButton = document.getElementById('replay-button');
    const leaderboardElement = document.getElementById('leaderboard');
    const changeNameButton = document.getElementById('change-name-button');
    const correctSound = new Audio('correct.mp3');
    const incorrectSound = new Audio('incorrect.mp3');

    changeNameButton.addEventListener('click', () => {
        const remainingTime = timeLeft;
        clearInterval(timerId); // Stop the timer when changing the name
        playerName = prompt('Enter your new name:', playerName);
        localStorage.setItem('playerName', playerName);
        startTimer(remainingTime); // Restart the timer after changing the name with remaining time
    });

    replayButton.addEventListener('click', () => {
        const audio = new Audio(`sounds/${randomNumber}.mp3`);
        audio.play();
    });

    function generateRandomNumber() {
        return Math.floor(Math.random() * 10) + 1; // Return a number between 1 and 10
    }

    function startGame() {
        randomNumber = generateRandomNumber();
        const audio = new Audio(`sounds/${randomNumber}.mp3`);
        audio.play();
        startTimer();
    }

    function startTimer(startTime = 60) {
        timeLeft = startTime;
        timerElement.textContent = `Preostalo vreme: ${timeLeft}s`;
        timerId = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `Preostalo vreme: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timerId);
                alert(`Vreme je isteklo! Vaš konačni rezultat je ${score}.`);
                updateLeaderboard();
                resetGame();
            }
        }, 1000);
    }

    function updateLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        const existingEntry = leaderboard.find(entry => entry.name === playerName);

        if (existingEntry) {
            if (score > existingEntry.score) {
                existingEntry.score = score;
            }
        } else {
            leaderboard.push({ name: playerName, score });
        }

        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        displayLeaderboard();
    }

    function displayLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.sort((a, b) => b.score - a.score); // Sort leaderboard entries from highest to lowest score
        leaderboardElement.innerHTML = '';
        leaderboard.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.name}: ${entry.score}`;
            leaderboardElement.appendChild(li);
        });
    }

    function resetGame() {
        score = 0;
        message.textContent = `Guess the number by clicking on a card!`;
        startGame();
    }

    startGame();

  // Define an object mapping numbers to image file names
  const numberImageMap = {
    1: '1.jpg',
    2: '2.png',
    3: '3.png',
    4: '4.png',
    5: '5.png',
    6: '6.png',
    7: '7.png',
    8: '8.png',
    9: '9.png',
    10: '10.png'
};

    for (let i = 1; i <= 10; i++) {
        const card = document.createElement('div');
    card.classList.add('card');

    // Create an image element
    const image = document.createElement('img');
    image.src = `images/${numberImageMap[i]}`;
    image.alt = `Number ${i}`;

    // Create a span for the number
    const numberSpan = document.createElement('span');
    numberSpan.textContent = i; // Set the number as text content

    // Append the image and the number span to the card
    card.appendChild(image);
    card.appendChild(numberSpan);
        card.addEventListener('click', () => {
            if (i === randomNumber) {
                score++;
                message.textContent = `Correct! Your score is ${score}.`;
                correctSound.play();
                randomNumber = generateRandomNumber();
                const audio = new Audio(`sounds/${randomNumber}.mp3`);
                audio.play();
            } else {
                incorrectSound.play();
                alert(`Wrong guess! Your final score is ${score}.`);
                updateLeaderboard();
                resetGame();
            }
        });
        cardsContainer.appendChild(card);
    }

    displayLeaderboard();
});
