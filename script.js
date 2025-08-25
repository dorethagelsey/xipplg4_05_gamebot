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

  // Suara (opsional)
  const soundCorrect = document.getElementById("sound-correct");
  const soundWrong = document.getElementById("sound-wrong");

  // Data permainan - gambar menggunakan Unsplash untuk stabilitas
  const questions = [
    {
      image: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=200&h=200&fit=crop&crop=center",
      answers: ["anjing", "dog", "puppy"],
      clue: "🐕 Hewan peliharaan yang setia dan suka menggonggong"
    },
    {
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center",
      answers: ["motor", "sepeda motor", "motorcycle"],
      clue: "🏍️ Kendaraan beroda dua yang pakai bensin"
    },
    {
      image: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=200&h=200&fit=crop&crop=center",
      answers: ["laptop", "komputer", "computer", "pc"],
      clue: "💻 Alat elektronik untuk bekerja dan main game"
    },
    {
      image: "buku.jpg",
      answers: ["buku", "book"],
      clue: "📚 Kumpulan halaman berisi tulisan untuk dibaca"
    },
    {
      image: "alok.jpg.jpg",
      answers: ["alok", ],
      clue: "karakter Free Fire"
    },
  {
      image: "delima.jpg.jpg",
      answers: ["delima", ],
      clue: "Inisial D"
  },
  {
      image: "gitar.jpg.jpg",
      answers: ["gitar", ],
      clue: "Alat Musik yang di petik"
    },
    {
      image: "jam.jpg.jpeg",
      answers: ["jam", ],
      clue: "Aku adalah mesin waktu"
    },
    {
      image: "lampu.jpg.jpeg",
      answers: ["lampu", ],
      clue: "Jika tidak aku maka akan gelap"
    },
    {
      image: "monas.jpg.jpg",
      answers: ["monas", ],
      clue: "Aku berada di Ibu Kota"
    },
    {
      image: "perahu.jpg.jpg",
      answers: ["perahu,kapal", ],
      clue: "Alat transportasi laut"
    },
    {
      image: "pesawat.jpg.jpg",
      answers: ["pesawat", ],
      clue: "Transportasi Udara"
    },
    {
      image: "sapi.jpg.jpg",
      answers: ["sapi", ],
      clue: "Aku berkaki 4"
    },
    {
      image: "tikus.jpg.jpg",
      answers: ["tikus", ],
      clue: "Aku sering diibaratkan dengan seseorang yang korupsi"
    }
  
  
  
  
  
  ];


  // Variabel game
  let currentQ = 0;
  let score = 0;
  let currentPlayer = "";
  let gameStartTime = 0;
  let gameEndTime = 0;

  // Leaderboard data (disimpan di memory)
  let leaderboard = [];

  // Event listeners untuk navigasi
  startGameBtn.addEventListener("click", startGame);
  viewLeaderboardBtn.addEventListener("click", showLeaderboard);
  viewLeaderboardEndBtn.addEventListener("click", showLeaderboard);
  backToWelcomeBtn.addEventListener("click", showWelcome);
  restartBtn.addEventListener("click", restartGame);

  // Event listeners untuk game
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

  // Fungsi navigasi screen
  function showWelcome() {
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

  // Fungsi untuk load pertanyaan
  function loadQuestion() {
    const q = questions[currentQ];
    imageEl.src = q.image;
    imageEl.alt = `Teka-teki gambar ${currentQ + 1}`;
    clueEl.textContent = q.clue;
    answerInput.value = "";
    answerInput.focus();
    currentEl.textContent = currentQ + 1;
    hideNotification();
  }

  // Fungsi notifikasi
  function showNotification(message, type) {
    notification.textContent = message;
    notification.className = "notification";
    notification.classList.add(type, "show");

    // Mainkan suara jika tersedia
    try {
      if (type === "success" && soundCorrect) {
        soundCorrect.play().catch(e => console.warn("Gagal memainkan suara benar:", e));
      } else if (type === "error" && soundWrong) {
        soundWrong.play().catch(e => console.warn("Gagal memainkan suara salah:", e));
      }
    } catch (e) {
      console.warn("Error playing sound:", e);
    }

    setTimeout(hideNotification, 2000);
  }

  function hideNotification() {
    notification.classList.remove("show");
  }

  // Fungsi untuk cek jawaban
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
      setTimeout(nextQuestion, 1800);
    } else {
      showNotification("❌ Belum tepat, coba lagi!", "error");
    }
  }

  // Fungsi untuk ke pertanyaan berikutnya
  function nextQuestion() {
    currentQ++;
    if (currentQ >= questions.length) {
      endGame();
    } else {
      loadQuestion();
    }
  }

  // Fungsi untuk mengakhiri game
  function endGame() {
    gameEndTime = Date.now();
    const timeSpent = Math.round((gameEndTime - gameStartTime) / 1000);
    
    showScreen("end");
    scoreEl.textContent = score;

    // Tambahkan ke leaderboard
    addToLeaderboard(currentPlayer, score, timeSpent);

    // Set feedback berdasarkan skor
    if (score === 5) {
      feedbackEl.textContent = "🧠 Luar biasa! Otakmu level pro!";
    } else if (score === 4) {
      feedbackEl.textContent = "👏 Hampir sempurna! Kamu jenius!";
    } else if (score >= 2) {
      feedbackEl.textContent = "💡 Bagus! Tapi masih bisa lebih!";
    } else {
      feedbackEl.textContent = "😅 Jangan menyerah! Coba lagi, pasti bisa!";
    }
  }

  // Fungsi untuk restart game
  function restartGame() {
    currentQ = 0;
    score = 0;
    gameStartTime = Date.now();
    showScreen("game");
    loadQuestion();
  }

  // Fungsi untuk menambahkan ke leaderboard
  function addToLeaderboard(name, score, timeSpent) {
    const newEntry = {
      name: name,
      score: score,
      time: timeSpent,
      date: new Date().toLocaleDateString('id-ID'),
      timestamp: Date.now()
    };

    leaderboard.push(newEntry);
    
    // Sort berdasarkan skor (tertinggi dulu), lalu waktu (tercepat dulu)
    leaderboard.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.time - b.time;
    });

    // Simpan hanya 10 teratas
    leaderboard = leaderboard.slice(0, 10);
  }

  // Fungsi untuk menampilkan leaderboard
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
      const rankDisplay = index < 3 ? 
        `<span class="rank-medal">${['🥇', '🥈', '🥉'][index]}</span>` :
        `<span class="rank">${index + 1}</span>`;
      
      return `
        <div class="leaderboard-item">
          ${rankDisplay}
          <div class="player-details">
            <div class="player-name">${entry.name}</div>
            <div class="player-score">
              ${entry.date} • ${entry.time}s • ${entry.score === 5 ? 'Perfect! 🎯' : entry.score + '/5'}
            </div>
          </div>
          <div class="score-badge">${entry.score}/5</div>
        </div>
      `;
    }).join('');

    leaderboardContent.innerHTML = `<div class="leaderboard-list">${leaderboardHTML}</div>`;
  }

  // Initialize - Mulai dengan welcome screen
  showWelcome();
});