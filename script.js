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
      answers: ["alok"],
      clue: "karakter Free Fire"
    },
    {
      image: "delima.jpg.jpg",
      answers: ["delima"],
      clue: "Inisial D"
    },
    {
      image: "gitar.jpg.jpg",
      answers: ["gitar"],
      clue: "Alat Musik yang di petik"
    },
    {
      image: "jam.jpg.jpeg",
      answers: ["jam"],
      clue: "Aku adalah mesin waktu"
    },
    {
      image: "lampu.jpg.jpeg",
      answers: ["lampu"],
      clue: "Jika tidak aku maka akan gelap"
    },
    {
      image: "monas.jpg.jpg",
      answers: ["monas"],
      clue: "Aku berada di Ibu Kota"
    },
    {
      image: "perahu.jpg.jpg",
      answers: ["perahu", "kapal"],
      clue: "Alat transportasi laut"
    },
    {
      image: "pesawat.jpg.jpg",
      answers: ["pesawat"],
      clue: "Transportasi Udara"
    },
    {
      image: "sapi.jpg.jpg",
      answers: ["sapi"],
      clue: "Aku berkaki 4"
    },
    {
      image: "tikus.jpg.jpg",
      answers: ["tikus"],
      clue: "Aku sering diibaratkan dengan seseorang yang korupsi"
    },
    {
      image: "https://www.google.com/imgres?q=monyet&imgurl=https%3A%2F%2Fwww.itb.ac.id%2Ffiles%2Fdokumentasi%2F1709884585-Macaca-fascicularis_.jpg&imgrefurl=https%3A%2F%2Fitb.ac.id%2Fberita%2Fkemunculan-monyet-ekor-panjang-di-kota-bandung-tanda-habitatnya-rusak%2F60422&docid=azq8l5IMiVbN9M&tbnid=e2ZSJ0DPypaiGM&vet=12ahUKEwjyhOP7tKePAxUaxDgGHQyTMMgQM3oECBEQAA..i&w=700&h=466&hcb=2&ved=2ahUKEwjyhOP7tKePAxUaxDgGHQyTMMgQM3oECBEQAA",
      answers: ["monyet"],
      clue: "Suka melompat di hutan"
    },
    {
      image: "https://www.google.com/imgres?q=panda&imgurl=https%3A%2F%2Fmedia.istockphoto.com%2Fid%2F523761634%2Fid%2Ffoto%2Flucu-beruang-panda-memanjat-di-pohon.jpg%3Fs%3D612x612%26w%3D0%26k%3D20%26c%3Dtg0izGKZALoV4Cfv47N2-rqCzVQCEL0hk5_3C3JNtgA%3D&imgrefurl=https%3A%2F%2Fwww.istockphoto.com%2Fid%2Ffoto-foto%2Fpanda&docid=-NbKAnqntXv8CM&tbnid=l0n4DI05VUm2NM&vet=12ahUKEwisyM6p3KePAxUAUWwGHTdMJDQQM3oECBoQAA..i&w=612&h=612&hcb=2&ved=2ahUKEwisyM6p3KePAxUAUWwGHTdMJDQQM3oECBoQAA",
      answers: ["panda"],
      clue: "Hewan dari Tiongkok, suka bambu"
    },
    {
      image: "https://www.google.com/imgres?q=sepatu&imgurl=https%3A%2F%2Fimg.lazcdn.com%2Fg%2Fp%2F510e478898cf2016e513f027abf258ff.jpg_720x720q80.jpg&imgrefurl=https%3A%2F%2Fwww.lazada.co.id%2Fproducts%2Fsepatu-sneakers-triumph-sepatu-kets-kulit-sepatu-casual-pria-kasual-sepatu-pria-tali-pakalolo-i5643186873.html&docid=PE-O4r9_yy7H_M&tbnid=hd1zt_0RObQzzM&vet=12ahUKEwink-3g3KePAxUzSmwGHYuZL6AQM3oECD8QAA..i&w=720&h=720&hcb=2&ved=2ahUKEwink-3g3KePAxUzSmwGHYuZL6AQM3oECD8QAA",
      answers: ["sepatu"],
      clue: "Dipakai di kaki, untuk berjalan"
    },
    {
      image: "https://www.google.com/imgres?q=kunci&imgurl=https%3A%2F%2Fkenaridjaja.co.id%2Fuploadeditor%2Fkenaridjaja.co.id%2Fimages%2Fkunci-silinder-cylinder-KEND-08610-18%2540.jpg&imgrefurl=https%3A%2F%2Fkenaridjaja.co.id%2Finspirasi%2Ftips-dan-trick%2Fketahui-apa-saja-model-tiap-tipe-kunci-cylinder-untuk-pintunya%2F8126&docid=NeOM7JUJqp-HmM&tbnid=I8ns_7_x3Q-syM&vet=12ahUKEwjn_piJ3aePAxVU3TgGHajXNokQM3oECBsQAA..i&w=1200&h=1200&hcb=2&ved=2ahUKEwjn_piJ3aePAxVU3TgGHajXNokQM3oECBsQAA",
      answers: ["kunci"],
      clue: "Kecil, tapi bisa membuka pintu"
    },
    {
      image: "https://www.google.com/imgres?q=payung&imgurl=https%3A%2F%2Fcdn.ruparupa.io%2Ffit-in%2F400x400%2Ffilters%3Aformat(webp)%2Ffilters%3Aquality(90)%2Fruparupa-com%2Fimage%2Fupload%2FProducts%2F10518508_1.jpg&imgrefurl=https%3A%2F%2Fwww.ruparupa.com%2Fp%2Fataru-payung-lipat-otomatis-hitam.html&docid=XcLZRaQVaOpJeM&tbnid=GRwAlGg1MB9AoM&vet=12ahUKEwj6_tW93aePAxUV7TgGHU9pIHsQM3oECEwQAA..i&w=400&h=400&hcb=2&ved=2ahUKEwj6_tW93aePAxUV7TgGHU9pIHsQM3oECEwQAA",
      answers: ["payung"],
      clue: "Melindungi dari hujan dan panas"
    },
  ];

  // Variabel game
  let currentQ = 0;
  let score = 0;
  let currentPlayer = "";
  let gameStartTime = 0;
  let gameEndTime = 0;
  let timer;           // Untuk menyimpan interval timer
  let timeLeft = 10;   // Waktu per soal: 10 detik

  // Leaderboard data
  let leaderboard = [];

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