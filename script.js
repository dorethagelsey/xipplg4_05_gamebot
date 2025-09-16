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
  const hintBtn = document.getElementById("hint-btn");

  hintBtn.addEventListener("click", () => {
    if (hintUsed) {
      showNotification("📢 Kamu sudah pakai hint!", "error");
      return;
    }

    const q = questions[currentQ];
    const answer = q.answers[0].toLowerCase(); // Ambil jawaban pertama sebagai acuan

    // Pilih jenis hint secara acak atau tentukan sendiri
    let hintMessage = "";

    // Contoh variasi hint
    const hintType = Math.floor(Math.random() * 3);

    if (hintType === 0) {
      hintMessage = `Jawabannya punya ${answer.length} huruf.`;
    } else if (hintType === 1) {
      hintMessage = `Dimulai dengan huruf "${answer[0].toUpperCase()}"`;
    } else {
      hintMessage = `"${q.clue}" — coba pikir lebih dalam! 😉`;
    }

    showNotification(hintMessage, "error");
    hintUsed = true;

    // Nonaktifkan tombol setelah digunakan
    hintBtn.disabled = true;
    hintBtn.style.opacity = "0.6";
    hintBtn.style.cursor = "not-allowed";
  });

  // Variabel game
  let allQuestions = []; // Semua pertanyaan dari JSON
  let questions = []; // Pertanyaan yang akan dimainkan (subset acak)
  let leaderboard = [];
  let currentQ = 0;
  let score = 0;
  let currentPlayer = "";
  let timerInterval;
  let timeLeft = 10;
  let gameStartTime = 0;
  let hintUsed = false; // Cek apakah hint sudah dipakai

  const saved = localStorage.getItem("leaderboard");
  if (saved) {
    leaderboard = JSON.parse(saved);
  } else {
    leaderboard = [];
  }

  // Konfigurasi: jumlah soal per permainan
  const QUESTIONS_PER_GAME = 5;

  // Load JSON
  fetch("questions.json")
    .then(res => res.json())
    .then(data => {
      allQuestions = Array.isArray(data.questions) ? data.questions : [];
    if (leaderboard.length === 0) {
      const jsonLeaderboard = data.leaderboard || [];
      if (jsonLeaderboard.length > 0) {
        leaderboard = jsonLeaderboard;
      }
    }

    if (leaderboard.length === 0 && data.leaderboard && data.leaderboard.length > 0) {
      leaderboard = [...leaderboard, ...data.leaderboard];
      leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);
      leaderboard = leaderboard.slice(0, 10);

      localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    }

      // Jangan set totalEl di sini - nanti akan diset saat game dimulai
      showWelcome();
    })
    .catch(err => {
      console.error("Gagal load questions.json:", err);
      allQuestions = [];
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
    // Update total soal yang terlihat di UI (opsional)
    totalEl.textContent = allQuestions.length || 0;
  }

  function showLeaderboard() {
    showScreen("leaderboard");
    displayLeaderboard();
  }

  // Fungsi untuk mengacak array (Fisher-Yates shuffle)
  function shuffleArray(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
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

    // 🔀 Acak pertanyaan lalu ambil subset (QUESTIONS_PER_GAME)
    questions = shuffleArray(allQuestions).slice(0, QUESTIONS_PER_GAME);

    // Update total UI sesuai jumlah soal yang dipakai
    totalEl.textContent = questions.length;

    showScreen("game");
    loadQuestion();
  }

  // Load soal
  function loadQuestion() {
    if (!questions || currentQ >= questions.length) {
      return endGame();
    }

    const q = questions[currentQ];
    imageEl.src = q.image || "https://via.placeholder.com/250?text=No+Image";
    clueEl.textContent = q.clue || "";
    answerInput.value = "";
    answerInput.focus();
    currentEl.textContent = currentQ + 1;

    hintUsed = false;
    hintBtn.disabled = false;
    hintBtn.style.opacity = "1";
    hintBtn.style.cursor = "pointer";

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
        try { soundWrong.play(); } catch (e) {}
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

    const q = questions[currentQ];
    const correctAnswers = Array.isArray(q.answers) ? q.answers.map(a => a.toLowerCase()) : [];
    if (correctAnswers.includes(userAnswer)) {
      showNotification("✅ Benar!", "success");
      score++;
      try { soundCorrect.play(); } catch (e) {}
      clearInterval(timerInterval);
      setTimeout(nextQuestion, 800);
    } else {
      showNotification("❌ Salah! -1 poin", "error");
      score = Math.max(0, score - 1);
      try { soundWrong.play(); } catch (e) {}
      clearInterval(timerInterval);
      setTimeout(nextQuestion, 800);
    }
      imageEl.classList.add("shake");
      setTimeout(() => imageEl.classList.remove("shake"), 500);
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
    // Jika mau langsung main lagi tanpa ketik nama, pastikan input masih ada
    startGame();
  }

  // Leaderboard
  function addToLeaderboard(name, score, time) {
    leaderboard.push({ name, score, time });
    leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);
    leaderboard = leaderboard.slice(0, 10);

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  }

  function displayLeaderboard() {
    if (!leaderboard || leaderboard.length === 0) {
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