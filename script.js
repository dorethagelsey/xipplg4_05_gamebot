document.addEventListener("DOMContentLoaded", function () {
  // Selektor elemen
  const imageEl = document.getElementById("image");
  const clueEl = document.getElementById("clue");
  const answerInput = document.getElementById("answer-input");
  const checkBtn = document.getElementById("check-btn");
  const notification = document.getElementById("notification");
  const currentEl = document.getElementById("current");
  const gameArea = document.getElementById("game-area");
  const endScreen = document.getElementById("end-screen");
  const scoreEl = document.getElementById("score");
  const feedbackEl = document.getElementById("feedback");
  const restartBtn = document.getElementById("restart-btn");

  // Suara
  const soundCorrect = document.getElementById("sound-correct");
  const soundWrong = document.getElementById("sound-wrong");

  // Ganti ke gambar dari layanan eksternal yang stabil
  const questions = [
    {
      image: "anjing.jpeg",
      answers: ["anjing", "dog"]
    },
    {
      image: "sepeda motor.jpg",
      answers: ["Motor", "motor"]
    },
    {
      image: "komputer.jpg",
      answers: ["komputer", "pc", "laptop"]
    },
    {
      image: "obeng.jpg",
      answers: ["obeng", "screwdriver"]
    },
    {
      image: "buku.jpg",
      answers: ["buku", "book"]
    }
  ];

  let currentQ = 0;
  let score = 0;
  let timer; // Tambahkan variabel timer

  // === 🔔 TAMBAHAN: Timer 15 detik ===
  function startTimer() {
    clearTimeout(timer); // Hentikan timer sebelumnya
    let timeLeft = 10;

    function updateTimer() {
      // Cek apakah elemen timer sudah ada, jika belum buat
      let timerEl = document.getElementById("countdown");
      if (!timerEl) {
        timerEl = document.createElement("div");
        timerEl.id = "countdown";
        timerEl.style.fontSize = "1.3rem";
        timerEl.style.fontWeight = "bold";
        timerEl.style.color = "#D32F2F";
        timerEl.style.marginTop = "10px";
        document.querySelector(".puzzle-box").appendChild(timerEl);
      }

      timerEl.textContent = `⏰ Waktu: ${timeLeft} detik`;

      if (timeLeft <= 5) {
        timerEl.style.color = "#C62828";
        timerEl.style.animation = "pulse 1s infinite";
      } else {
        timerEl.style.color = "#D32F2F";
        timerEl.style.animation = "none";
      }

      if (timeLeft <= 0) {
        // Waktu habis! Langsung ke soal berikutnya
        clearTimeout(timer);
        showNotification("⏳ Waktu habis!", "error");
        soundWrong.play().catch(e => console.warn("Suara gagal:", e));
        setTimeout(nextQuestion, 1500);
      } else {
        timeLeft--;
        timer = setTimeout(updateTimer, 1000);
      }
    }

    updateTimer(); // Mulai timer
  }

  function loadQuestion() {
    const q = questions[currentQ];
    imageEl.src = q.image;
    imageEl.alt = `Teka-teki gambar ${currentQ + 1}`;
    clueEl.textContent = q.clue || ""; // Jika tidak ada clue, kosong
    answerInput.value = "";
    answerInput.focus();
    currentEl.textContent = currentQ + 1;
    hideNotification();

    // === 🔔 Mulai timer saat soal dimuat ===
    startTimer();
  }

  function showNotification(message, type) {
    notification.textContent = message;
    notification.className = "notification"; // reset
    notification.classList.add(type, "show");

    // Mainkan suara
    const sound = type === "success" ? soundCorrect : soundWrong;
    sound.play().catch(e => {
      console.warn("Gagal memainkan suara:", e);
    });

    setTimeout(hideNotification, 2000);
  }

  function hideNotification() {
    notification.classList.remove("show");
  }

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
      clearTimeout(timer); // Hentikan timer
      setTimeout(nextQuestion, 1800);
    } else {
      showNotification("❌ Belum tepat, coba lagi!", "error");
    }
  }

  function nextQuestion() {
    currentQ++;
    if (currentQ >= questions.length) {
      endGame();
    } else {
      loadQuestion(); // Di sini timer akan dimulai ulang
    }
  }

  checkBtn.addEventListener("click", checkAnswer);

  answerInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkAnswer();
  });

  function endGame() {
    gameArea.style.display = "none";
    endScreen.style.display = "block";
    scoreEl.textContent = score;

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

  restartBtn.addEventListener("click", () => {
    currentQ = 0;
    score = 0;
    gameArea.style.display = "block";
    endScreen.style.display = "none";
    loadQuestion(); // Timer akan dimulai di sini
  });

  // Mulai game
  loadQuestion();

  // === Animasi pulse untuk timer (opsional, tambahkan ke <head>)
  const style = document.createElement("style");
  style.textContent = `
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.08); }
    }
  `;
  document.head.appendChild(style);
});