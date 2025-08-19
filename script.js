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
      loadQuestion();
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
    loadQuestion();
  });

  // Mulai game
  loadQuestion();
});