document.addEventListener('DOMContentLoaded', function () {
    const questionElement = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const submitButton = document.getElementById('submit-btn');
    const resultElement = document.getElementById('result');
    const changeNameButton = document.getElementById('change-name-btn');
    const leaderboardElement = document.getElementById('leaderboard');
  
    let operand1, operand2, operator, correctAnswer;
    let playerName = localStorage.getItem('addSubPlayerName') || ''; // Load player's name from local storage
    let score = 0; // Initialize score
  
    // Load leaderboard from local storage or initialize an empty array for this game
    let leaderboard = JSON.parse(localStorage.getItem('addSubLeaderboard')) || [];
  
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
      } else {
        resultElement.textContent = 'Netačno';
        resultElement.style.color = 'red';
        endGame();
      }
  
      answerInput.value = ''; // Clear the answer input
      generateQuestion(); // Generate the next question
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
        listItem.textContent = `${index + 1}. ${entry.name} - Poeni: ${entry.score}`;
        leaderboardElement.appendChild(listItem);
      });
    }
  
    submitButton.addEventListener('click', checkAnswer);
  
    // Display current name in change name prompt
    changeNameButton.addEventListener('click', function () {
      playerName = prompt('Napiši ime', playerName);
      localStorage.setItem('addSubPlayerName', playerName); // Save updated name to local storage
    });
  
    // Render initial leaderboard
    renderLeaderboard();
  
    // Initial question generation
    generateQuestion();

    function endGame() {
        // Refresh leaderboard
        renderLeaderboard();
      
        // Display final score and reset game
        alert(`Kraj igre! Vaš konačni rezultat je: ${score}`);
        updateLeaderboard(playerName, score); // Update leaderboard with final score
      
        // Wait for a short delay before refreshing the page
        setTimeout(function() {
          window.location.reload();
        }, 100);
      }
  });
  