document.addEventListener('DOMContentLoaded', function () {
  const questionElement = document.getElementById('question');
  const cardContainer = document.getElementById('card-container');
  const resultElement = document.getElementById('result');
  const changeNameButton = document.getElementById('change-name-btn');
  const leaderboardElement = document.getElementById('leaderboard');
  const timerElement = document.getElementById('timer');

  let operand1, operand2, operator, correctAnswer;
  let playerName = localStorage.getItem('addSubPlayerName') || 'Anonymous';
  let score = 0;
  let timer = 60;
  let interval;
  let isGameActive = false;

  let leaderboard = JSON.parse(localStorage.getItem('addSubLeaderboard')) || [];

  function startTimer() {
      interval = setInterval(function () {
          timer--;
          timerElement.textContent = timer;

          if (timer <= 0) {
              clearInterval(interval);
              endGame();
          }
      }, 1000);
  }

  function pauseTimer() {
      clearInterval(interval);
  }

  function generateQuestion() {
      do {
          operand1 = Math.floor(Math.random() * 11);
          operand2 = Math.floor(Math.random() * 11);
          operator = Math.random() < 0.5 ? '+' : '-';
          if (operator === '+') {
              correctAnswer = operand1 + operand2;
          } else {
              correctAnswer = operand1 - operand2;
          }
      } while (correctAnswer > 10 || operand1 < operand2);

      questionElement.textContent = `${operand1} ${operator} ${operand2} = ?`;
  }

  function checkAnswer(selectedCard) {
      if (isGameActive) {
          const userAnswer = parseInt(selectedCard.textContent);
          if (userAnswer === correctAnswer) {
              score++;
              resultElement.textContent = 'Correct!';
              resultElement.style.color = 'green';
          } else {
              resultElement.textContent = 'Incorrect!';
              resultElement.style.color = 'red';
          }
          isGameActive = false;
          endGame();
      }
  }

  function endGame() {
      pauseTimer();
      updateLeaderboard(playerName, score);
      renderLeaderboard();
      alert(`Game Over! Your final score is: ${score}`);
      score = 0;
      resultElement.textContent = '';
      timer = 60;
      timerElement.textContent = timer;
      startTimer();
      generateQuestion();
  }

  function updateLeaderboard(playerName, score) {
      const playerIndex = leaderboard.findIndex(entry => entry.name === playerName);
      if (playerIndex !== -1) {
          leaderboard[playerIndex].score = score;
      } else {
          leaderboard.push({ name: playerName, score });
      }

      leaderboard.sort((a, b) => b.score - a.score);
      localStorage.setItem('addSubLeaderboard', JSON.stringify(leaderboard));
  }

  function renderLeaderboard() {
      leaderboardElement.innerHTML = '';
      leaderboard.forEach((entry, index) => {
          const listItem = document.createElement('li');
          listItem.textContent = `${index + 1}. ${entry.name} - Score: ${entry.score}`;
          leaderboardElement.appendChild(listItem);
      });
  }

  function createCards() {
      cardContainer.innerHTML = '';
      const options = [correctAnswer, correctAnswer + 1, correctAnswer - 1];
      shuffleArray(options);
      options.forEach(option => {
          const card = document.createElement('div');
          card.textContent = option;
          card.classList.add('card');
          card.addEventListener('click', function () {
              checkAnswer(card);
          });
          cardContainer.appendChild(card);
      });
  }

  function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
  }

  changeNameButton.addEventListener('click', function () {
      pauseTimer();
      const newName = prompt('Enter your name:', playerName) || 'Anonymous';
      if (newName !== playerName) {
          playerName = newName;
          localStorage.setItem('addSubPlayerName', playerName);
      }
      startTimer();
  });

  renderLeaderboard();
  generateQuestion();
  createCards();
  startTimer();
});
