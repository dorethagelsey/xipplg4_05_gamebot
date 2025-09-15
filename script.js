document.addEventListener("DOMContentLoaded", function () {
  // Elemen
  const welcomeScreen = document.getElementById("welcome-screen");
  const gameArea = document.getElementById("game-area");
  const endScreen = document.getElementById("end-screen");
  const leaderboardScreen = document.getElementById("leaderboard-screen");

  const playerNameInput = document.getElementById("player-name");
  const startGameBtn = document.getElementById("start-game-btn");
  const viewLeaderboardBtn = document.getElementById("view-leaderboard-btn");
  const viewLeaderboardEndBtn = document.getElementById("view-leaderboard-end-btn");
  const backToWelcomeBtn = document.getElementById("back-to-welcome-btn");
  const restartBtn = document.getElementById("restart-btn");

  const currentPlayerEl = document.getElementById("current-player");
  const imageEl = document.getElementById("image");
  const clueEl = document.getElementById("clue");
  const answerInput = document.getElementById("answer-input");
  const checkBtn = document.getElementById("check-btn");
  const notification = document.getElementById("notification");
  const currentEl = document.getElementById("current");
  const totalEl = document.getElementById("total");
  const scoreEl = document.getElementById("score");
  const feedbackEl = document.getElementById("feedback");
  const leaderboardContent = document.getElementById("leaderboard-content");
  const timerEl = document.getElementById("timer");

  const soundCorrect = document.getElementById("sound-correct");
  const soundWrong = document.getElementById("sound-wrong");

  // Variabel game
  let questions = [];
  let leaderboard = [];
  let currentQ = 0;
  let score = 0;
  let currentPlayer = "";
  let timerInterval;
  let timeLeft = 10;
  let gameStartTime = 0;

  // Load JSON
  fetch("questions.json")
    .then(res => res.json())
    .then(data => {
      questions = data.questions;
      leaderboard = data.leaderboard || [];
      totalEl.textContent = questions.length;
      showWelcome();
    });

  // Event
  startGameBtn.addEventListener("click", startGame);
  viewLeaderboardBtn.addEventListener("click", showLeaderboard);
  viewLeaderboardEndBtn.addEventListener("click", showLeaderboard);
  backToWelcomeBtn.addEventListener("click", showWelcome);
  restartBtn.addEventListener("click", restartGame);
  checkBtn.addEventListener("click", checkAnswer);

  answerInput.addEventListener("keypress", e => {
    if (e.key === "Enter") checkAnswer();
  });

  // Fungsi screen
  function showScreen(screen) {
    welcomeScreen.style.display = screen === "welcome" ? "block" : "none";
    gameArea.style.display = screen === "game" ? "block" : "none";
    endScreen.style.display = screen === "end" ? "block" : "none";
    leaderboardScreen.style.display = screen === "leaderboard" ? "block" : "none";
  }

  function showWelcome() {
    clearInterval(timerInterval);
    showScreen("welcome");
  }

  function showLeaderboard() {
    showScreen("leaderboard");
    displayLeaderboard();
  }

  // Mulai game
  function startGame() {
    const name = playerNameInput.value.trim();
    if (!name) {
      alert("Masukkan nama dulu!");
      return;
    }
    currentPlayer = name;
    currentPlayerEl.textContent = name;
    currentQ = 0;
    score = 0;
    gameStartTime = Date.now();
    showScreen("game");
    loadQuestion();
  }

  // Load soal
  function loadQuestion() {
    if (currentQ >= questions.length) {
      return endGame();
    }

    const q = questions[currentQ];
    imageEl.src = q.image;
    clueEl.textContent = q.clue;
    answerInput.value = "";
    answerInput.focus();
    currentEl.textContent = currentQ + 1;

    startTimer();
  }

  // Timer
  function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 10;
    updateTimer();

    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimer();
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        // kalau habis waktu, dianggap salah
        showNotification("⏰ Waktu habis! -1 poin", "error");
        score = Math.max(0, score - 1);
        soundWrong.play(); // ✅ bunyi salah saat waktu habis
        setTimeout(nextQuestion, 1000);
      }
    }, 1000);
  }

  function updateTimer() {
    timerEl.textContent = `⏱️ ${timeLeft}s`;
    timerEl.className = "timer-display";
    if (timeLeft <= 3) timerEl.classList.add("warning");
  }

  // Cek jawaban
  function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    if (!userAnswer) return;

    const correctAnswers = questions[currentQ].answers.map(a => a.toLowerCase());
    if (correctAnswers.includes(userAnswer)) {
      showNotification("✅ Benar!", "success");
      score++;
      soundCorrect.play();
      clearInterval(timerInterval);
      setTimeout(nextQuestion, 1000);
    } else {
      showNotification("❌ Salah! -1 poin", "error");
      score = Math.max(0, score - 1);
      soundWrong.play();
      clearInterval(timerInterval);
      setTimeout(nextQuestion, 1000);
    }
  }

  // Next soal
  function nextQuestion() {
    currentQ++;
    if (currentQ >= questions.length) {
      endGame();
    } else {
      loadQuestion();
    }
  }

  // End game
  function endGame() {
    clearInterval(timerInterval);
    showScreen("end");
    scoreEl.textContent = score;

    const timeSpent = Math.round((Date.now() - gameStartTime) / 1000);
    addToLeaderboard(currentPlayer, score, timeSpent);

    if (score === questions.length) {
      feedbackEl.textContent = "🎯 Sempurna!";
    } else if (score >= questions.length / 2) {
      feedbackEl.textContent = "👍 Bagus!";
    } else {
      feedbackEl.textContent = "😅 Jangan menyerah, coba lagi!";
    }
  }

  function restartGame() {
    startGame();
  }

  // Leaderboard
  function addToLeaderboard(name, score, time) {
    leaderboard.push({ name, score, time });
    leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);
    leaderboard = leaderboard.slice(0, 10);
  }

  function displayLeaderboard() {
    if (leaderboard.length === 0) {
      leaderboardContent.innerHTML = `
        <div class="empty-leaderboard">
          <p>📝 Belum ada yang main</p>
        </div>
      `;
      return;
    }

    leaderboardContent.innerHTML = leaderboard.map((e, i) => `
      <div class="leaderboard-item">
        <span class="rank">${i + 1}</span>
        <div class="player-details">
          <div class="player-name">${e.name}</div>
          <div class="player-score">${e.score} poin • ${e.time}s</div>
        </div>
      </div>
    `).join("");
  }

  // Notifikasi
  function showNotification(msg, type) {
    notification.textContent = msg;
    notification.className = "notification " + type + " show";
    setTimeout(() => notification.classList.remove("show"), 2000);
  }

  showWelcome();
});
