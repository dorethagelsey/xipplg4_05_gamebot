document.addEventListener("DOMContentLoaded", function () {
  // Selektor elemen
  const welcomeScreen = document.getElementById("welcome-screen");
  const gameArea = document.getElementById("game-area");
  const endScreen = document.getElementById("end-screen");
  const leaderboardScreen = document.getElementById("leaderboard-screen");
  
  const playerNameInput = document.getElementById("player-name");
  const startGameBtn = document.getElementById("start-game-btn");
  const viewLeaderboardBtn = document.getElementById("view-leaderboard-btn");
  const viewLeaderboardEndBtn = document.getElementById("view-leaderboard-end-btn");
  const backToWelcomeBtn = document.getElementById("back-to-welcome-btn");
  
  const currentPlayerEl = document.getElementById("current-player");
  const imageEl = document.getElementById("image");
  const clueEl = document.getElementById("clue");
  const answerInput = document.getElementById("answer-input");
  const checkBtn = document.getElementById("check-btn");
  const notification = document.getElementById("notification");
  const currentEl = document.getElementById("current");
  const scoreEl = document.getElementById("score");
  const feedbackEl = document.getElementById("feedback");
  const restartBtn = document.getElementById("restart-btn");
  const leaderboardContent = document.getElementById("leaderboard-content");
  const timerEl = document.getElementById("timer"); // Elemen timer

  // Suara (opsional)
  const soundCorrect = document.getElementById("sound-correct");
  const soundWrong = document.getElementById("sound-wrong");

  // Data permainan - 14 soal
let questions = [];
let leaderboard = [];

fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data.questions;
    leaderboard = data.leaderboard || [];
    showWelcome();
  })
  .catch(err => {
    console.error("Gagal load data.json:", err);
    showWelcome();
  });


  // Variabel game
  let currentQ = 0;
  let score = 0;
  let currentPlayer = "";
  let gameStartTime = 0;
  let gameEndTime = 0;
  let timer;           // Untuk menyimpan interval timer
  let timeLeft = 10;   // Waktu per soal: 10 detik

  // Leaderboard data

  // Event listeners
  startGameBtn.addEventListener("click", startGame);
  viewLeaderboardBtn.addEventListener("click", showLeaderboard);
  viewLeaderboardEndBtn.addEventListener("click", showLeaderboard);
  backToWelcomeBtn.addEventListener("click", showWelcome);
  restartBtn.addEventListener("click", restartGame);
  checkBtn.addEventListener("click", checkAnswer);
  
  answerInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkAnswer();
  });

  playerNameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && playerNameInput.value.trim()) startGame();
  });

  // Fungsi untuk memulai game
  function startGame() {
    const name = playerNameInput.value.trim();
    if (!name) {
      alert("😊 Masukkan nama kamu dulu ya!");
      playerNameInput.focus();
      return;
    }
    
    currentPlayer = name;
    currentPlayerEl.textContent = currentPlayer;
    currentQ = 0;
    score = 0;
    gameStartTime = Date.now();
    
    showScreen("game");
    loadQuestion();
  }

  // Navigasi screen
  function showWelcome() {
    clearInterval(timer);
    showScreen("welcome");
    playerNameInput.focus();
  }

  function showLeaderboard() {
    showScreen("leaderboard");
    displayLeaderboard();
  }

  function showScreen(screen) {
    welcomeScreen.style.display = screen === "welcome" ? "block" : "none";
    gameArea.style.display = screen === "game" ? "block" : "none";
    endScreen.style.display = screen === "end" ? "block" : "none";
    leaderboardScreen.style.display = screen === "leaderboard" ? "block" : "none";
  }

  // Fungsi untuk load pertanyaan + mulai timer
  function loadQuestion() {
    const q = questions[currentQ];
    imageEl.src = q.image;
    imageEl.alt = `Teka-teki gambar ${currentQ + 1}`;
    clueEl.textContent = q.clue;
    answerInput.value = "";
    answerInput.focus();
    currentEl.textContent = currentQ + 1;
    hideNotification();

    // Reset timer
    timeLeft = 10;
    updateTimerDisplay();

    // Hentikan timer sebelumnya
    clearInterval(timer);

    // Mulai timer baru
    timer = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();

      if (timeLeft <= 0) {
        clearInterval(timer);
        showNotification("⏰ Waktu habis!", "error");
        setTimeout(nextQuestion, 1500); // Lanjut ke soal berikutnya
      }
    }, 1000);
  }

  // Update tampilan timer
  function updateTimerDisplay() {
    if (timerEl) {
      timerEl.textContent = `⏱️ ${timeLeft}s`;
      timerEl.className = "timer-display";
      if (timeLeft <= 3) {
        timerEl.classList.add("warning");
      }
    }
  }

  // Fungsi notifikasi
  function showNotification(message, type) {
    notification.textContent = message;
    notification.className = "notification";
    notification.classList.add(type, "show");

    try {
      if (type === "success" && soundCorrect) {
        soundCorrect.play().catch(e => console.warn("Gagal mainkan suara benar:", e));
      } else if (type === "error" && soundWrong) {
        soundWrong.play().catch(e => console.warn("Gagal mainkan suara salah:", e));
      }
    } catch (e) {
      console.warn("Error playing sound:", e);
    }

    setTimeout(hideNotification, 2000);
  }

  function hideNotification() {
    notification.classList.remove("show");
  }

  // Cek jawaban
  function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    if (!userAnswer) {
      showNotification("💡 Masukkan jawaban dulu!", "error");
      return;
    }

    const correctAnswers = questions[currentQ].answers.map(ans => ans.toLowerCase());
    const isCorrect = correctAnswers.some(
      ans => userAnswer.includes(ans) || ans.includes(userAnswer)
    );

    if (isCorrect) {
      showNotification("✅ Benar! Hebat! 👏", "success");
      score++;
      clearInterval(timer); // Hentikan timer
      setTimeout(nextQuestion, 1800);
    } else {
      showNotification("❌ Belum tepat, coba lagi!", "error");
    }
  }

  // Lanjut ke soal berikutnya
  function nextQuestion() {
    clearInterval(timer);
    currentQ++;
    if (currentQ >= questions.length) {
      endGame();
    } else {
      loadQuestion();
    }
  }

  // Akhiri game
  function endGame() {
    clearInterval(timer);
    gameEndTime = Date.now();
    const timeSpent = Math.round((gameEndTime - gameStartTime) / 1000);
    
    showScreen("end");
    scoreEl.textContent = score;

    addToLeaderboard(currentPlayer, score, timeSpent);

    if (score === 14) {
      feedbackEl.textContent = "🧠 Luar biasa! Skor sempurna! 🎯";
    } else if (score >= 10) {
      feedbackEl.textContent = "👏 Hampir sempurna! Kamu jenius!";
    } else if (score >= 5) {
      feedbackEl.textContent = "💡 Bagus! Tapi masih bisa lebih!";
    } else {
      feedbackEl.textContent = "😅 Jangan menyerah! Coba lagi, pasti bisa!";
    }
  }

  // Restart game
  function restartGame() {
    currentQ = 0;
    score = 0;
    gameStartTime = Date.now();
    showScreen("game");
    loadQuestion();
  }

  // Tambah ke leaderboard
  function addToLeaderboard(name, score, timeSpent) {
    const newEntry = {
      name,
      score,
      time: timeSpent,
      date: new Date().toLocaleDateString('id-ID'),
      timestamp: Date.now()
    };

    leaderboard.push(newEntry);
    leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.time - b.time;
    });
    leaderboard = leaderboard.slice(0, 10);
  }

  // Tampilkan leaderboard
  function displayLeaderboard() {
    if (leaderboard.length === 0) {
      leaderboardContent.innerHTML = `
        <div class="empty-leaderboard">
          <p>📝 Belum ada yang main nih...</p>
          <p>Jadilah yang pertama!</p>
        </div>
      `;
      return;
    }

    const leaderboardHTML = leaderboard.map((entry, index) => {
      const medal = ['🥇', '🥈', '🥉'][index];
      const rankDisplay = index < 3 
        ? `<span class="rank-medal">${medal}</span>` 
        : `<span class="rank">${index + 1}</span>`;
      
      return `
        <div class="leaderboard-item">
          ${rankDisplay}
          <div class="player-details">
            <div class="player-name">${entry.name}</div>
            <div class="player-score">
              ${entry.date} • ${entry.time}s • ${entry.score}/14
            </div>
          </div>
          <div class="score-badge">${entry.score}/14</div>
        </div>
      `;
    }).join('');

    leaderboardContent.innerHTML = `<div class="leaderboard-list">${leaderboardHTML}</div>`;
  }

  // Inisialisasi
  showWelcome();
});