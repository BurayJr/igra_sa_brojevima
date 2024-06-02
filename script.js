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
  
    function startGame() {
      randomNumber = generateRandomNumber();
      const audio = new Audio(`sounds/${randomNumber}.mp3`);
      audio.play();
      startTimer();
    }
  
    function generateRandomNumber() {
      return Math.floor(Math.random() * 10) + 1;
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
      leaderboard.push({ name: playerName, score });
      localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
      displayLeaderboard();
    }
  
    function displayLeaderboard() {
      const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
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
  
    for (let i = 1; i <= 10; i++) {
      const card = document.createElement('div');
      card.classList.add('card');
      card.textContent = i;
      card.addEventListener('click', () => {
        if (i === randomNumber) {
          score++;
          message.textContent = `Tačno! Vaš rezultat je ${score}.`;
          randomNumber = generateRandomNumber();
          const audio = new Audio(`sounds/${randomNumber}.mp3`);
          audio.play();
        } else {
          alert(`Pogrešna pretpostavka! Vaš konačni rezultat je ${score}.`);
          updateLeaderboard();
          resetGame();
        }
      });
      cardsContainer.appendChild(card);
    }
  
    displayLeaderboard();
  });
  