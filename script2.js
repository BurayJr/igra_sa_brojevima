document.addEventListener('DOMContentLoaded', function () {
  const questionElement = document.getElementById('question');
  const answerInput = document.getElementById('answer');
  const submitButton = document.getElementById('submit-btn');
  const resultElement = document.getElementById('result');
  const changeNameButton = document.getElementById('change-name-btn');
  const leaderboardElement = document.getElementById('leaderboard');
  const timerElement = document.getElementById('timer');

  let operand1, operand2, operator, correctAnswer;
  let playerName = localStorage.getItem('addSubPlayerName') || 'Anonymous'; // Load player's name from local storage or set to 'Anonymous'
  let score = 0; // Initialize score
  let timer = 60; // Initialize timer
  let interval; // Timer interval

  // Load leaderboard from local storage or initialize an empty array for this game
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
      operand1 = Math.floor(Math.random() * 11); // Random number between 0 and 10
      operand2 = Math.floor(Math.random() * 11);
      operator = Math.random() < 0.5 ? '+' : '-'; // Randomly choose between addition and subtraction

      if (operator === '+') {
        correctAnswer = operand1 + operand2;
      } else {
        correctAnswer = operand1 - operand2;
      }
    } while (correctAnswer > 10 || operand1 < operand2);

    questionElement.textContent = `${operand1} ${operator} ${operand2} = `;
  }

  function checkAnswer() {
    const userAnswer = parseInt(answerInput.value);

    if (isNaN(userAnswer)) {
      resultElement.textContent = 'Molimo Vas da unesete važeći broj!';
      resultElement.style.color = 'red';
    } else if (userAnswer === correctAnswer) {
      resultElement.textContent = 'Tačno!';
      resultElement.style.color = 'green';
      score++; // Increment score for correct answer
      answerInput.value = ''; // Clear the answer input
      generateQuestion(); // Generate the next question
    } else {
      resultElement.textContent = 'Netačno!';
      resultElement.style.color = 'red';
      endGame();
    }
  }

  function endGame() {
    pauseTimer();
    updateLeaderboard(playerName, score); // Update leaderboard with final score
    renderLeaderboard(); // Refresh leaderboard

    // Display final score and reset game
    alert(`Kraj igre! Vaš konačni rezultat je: ${score}`);
    score = 0;
    resultElement.textContent = ''; // Clear result message
    answerInput.value = ''; // Clear the answer input
    generateQuestion();
    timer = 60; // Reset timer
    timerElement.textContent = timer;
    startTimer(); // Restart timer
  }

  function updateLeaderboard(playerName, score) {
    // Check if the player's name already exists in the leaderboard
    const playerIndex = leaderboard.findIndex(entry => entry.name === playerName);
    if (playerIndex !== -1) {
      // If the player's name exists, update the score
      leaderboard[playerIndex].score = score;
    } else {
      // If the player's name does not exist, add a new entry
      leaderboard.push({ name: playerName, score });
    }

    // Sort leaderboard by score in descending order
    leaderboard.sort((a, b) => b.score - a.score);
    // Save updated leaderboard to local storage for this game
    localStorage.setItem('addSubLeaderboard', JSON.stringify(leaderboard));
  }

  function renderLeaderboard() {
    // Clear previous leaderboard entries
    leaderboardElement.innerHTML = '';

    // Render new leaderboard entries
    leaderboard.forEach((entry, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${index + 1}. ${entry.name} - Rezultat: ${entry.score}`;
      leaderboardElement.appendChild(listItem);
    });
  }

  submitButton.addEventListener('click', checkAnswer);

  // Display current name in change name prompt
  changeNameButton.addEventListener('click', function () {
    pauseTimer();
    const newName = prompt('Upiši svoje ime:', playerName) || 'Anonymous'; // Prompt returns null if cancelled
    if (newName !== playerName) {
      playerName = newName;
      localStorage.setItem('addSubPlayerName', playerName); // Save updated name to local storage
    }
    startTimer();
  });

  // Render initial leaderboard
  renderLeaderboard();

  // Initial question generation
  generateQuestion();

  // Start the timer
  startTimer();
});
