class QuizApp {
  constructor() {
    this.questions = {
      science: [
        {
          question: "What is the chemical symbol for gold?",
          answers: ["Au", "Ag", "Fe", "Cu"],
          correct: 0,
          difficulty: "easy",
          explanation: "Gold's chemical symbol 'Au' comes from the Latin word 'aurum', meaning gold.",
        },
        {
          question: "Which planet is known as the Red Planet?",
          answers: ["Venus", "Mars", "Jupiter", "Saturn"],
          correct: 1,
          difficulty: "easy",
          explanation: "Mars appears red due to iron oxide (rust) on its surface.",
        },
        {
          question: "What is the speed of light in vacuum?",
          answers: ["299,792,458 m/s", "300,000,000 m/s", "299,000,000 m/s", "301,000,000 m/s"],
          correct: 0,
          difficulty: "hard",
          explanation: "The speed of light in vacuum is exactly 299,792,458 meters per second.",
        },
      ],
      history: [
        {
          question: "In which year did World War II end?",
          answers: ["1944", "1945", "1946", "1947"],
          correct: 1,
          difficulty: "easy",
          explanation: "World War II ended in 1945 with the surrender of Japan in September.",
        },
        {
          question: "Who was the first person to walk on the moon?",
          answers: ["Buzz Aldrin", "Neil Armstrong", "John Glenn", "Alan Shepard"],
          correct: 1,
          difficulty: "medium",
          explanation: "Neil Armstrong was the first person to walk on the moon on July 20, 1969.",
        },
      ],
      geography: [
        {
          question: "What is the capital of Australia?",
          answers: ["Sydney", "Melbourne", "Canberra", "Perth"],
          correct: 2,
          difficulty: "medium",
          explanation: "Canberra is the capital city of Australia, not Sydney or Melbourne as commonly thought.",
        },
        {
          question: "Which is the longest river in the world?",
          answers: ["Amazon", "Nile", "Yangtze", "Mississippi"],
          correct: 1,
          difficulty: "easy",
          explanation: "The Nile River is generally considered the longest river in the world at about 6,650 km.",
        },
      ],
      technology: [
        {
          question: "What does 'HTTP' stand for?",
          answers: [
            "HyperText Transfer Protocol",
            "High Tech Transfer Protocol",
            "HyperText Transport Protocol",
            "High Transfer Text Protocol",
          ],
          correct: 0,
          difficulty: "medium",
          explanation: "HTTP stands for HyperText Transfer Protocol, the foundation of data communication on the web.",
        },
        {
          question: "Who founded Microsoft?",
          answers: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Larry Page"],
          correct: 1,
          difficulty: "easy",
          explanation: "Bill Gates co-founded Microsoft with Paul Allen in 1975.",
        },
      ],
    }

    this.currentQuiz = []
    this.currentQuestionIndex = 0
    this.score = 0
    this.userAnswers = []
    this.timeLeft = 30
    this.timer = null
    this.timerEnabled = true
    this.startTime = null
    this.endTime = null

    this.initializeElements()
    this.bindEvents()
    this.loadHighScore()
  }

  initializeElements() {
    // Screens
    this.startScreen = document.getElementById("start-screen")
    this.quizScreen = document.getElementById("quiz-screen")
    this.resultsScreen = document.getElementById("results-screen")
    this.reviewScreen = document.getElementById("review-screen")

    // Start screen elements
    this.categorySelect = document.getElementById("category-select")
    this.difficultySelect = document.getElementById("difficulty-select")
    this.timerToggle = document.getElementById("timer-toggle")
    this.startBtn = document.getElementById("start-btn")
    this.highScoreDisplay = document.getElementById("high-score-display")

    // Quiz screen elements
    this.progressFill = document.getElementById("progress-fill")
    this.questionCounter = document.getElementById("question-counter")
    this.currentScoreDisplay = document.getElementById("current-score")
    this.timerDisplay = document.getElementById("timer-display")
    this.timerElement = document.getElementById("timer")
    this.questionCategory = document.getElementById("question-category")
    this.questionText = document.getElementById("question-text")
    this.difficultyBadge = document.getElementById("difficulty-badge")
    this.answersContainer = document.getElementById("answers-container")
    this.nextBtn = document.getElementById("next-btn")
    this.skipBtn = document.getElementById("skip-btn")

    // Results screen elements
    this.finalScore = document.getElementById("final-score")
    this.resultsTitle = document.getElementById("results-title")
    this.resultsMessage = document.getElementById("results-message")
    this.correctAnswers = document.getElementById("correct-answers")
    this.wrongAnswers = document.getElementById("wrong-answers")
    this.skippedAnswers = document.getElementById("skipped-answers")
    this.timeTaken = document.getElementById("time-taken")
    this.playAgainBtn = document.getElementById("play-again-btn")
    this.reviewBtn = document.getElementById("review-btn")

    // Review screen elements
    this.backToResultsBtn = document.getElementById("back-to-results")
    this.reviewContent = document.getElementById("review-content")
  }

  bindEvents() {
    this.startBtn.addEventListener("click", () => this.startQuiz())
    this.nextBtn.addEventListener("click", () => this.nextQuestion())
    this.skipBtn.addEventListener("click", () => this.skipQuestion())
    this.playAgainBtn.addEventListener("click", () => this.resetQuiz())
    this.reviewBtn.addEventListener("click", () => this.showReview())
    this.backToResultsBtn.addEventListener("click", () => this.showResults())
    this.timerToggle.addEventListener("change", (e) => {
      this.timerEnabled = e.target.checked
      this.timerDisplay.style.display = this.timerEnabled ? "block" : "none"
    })
  }

  generateQuiz() {
    const category = this.categorySelect.value
    const difficulty = this.difficultySelect.value
    let questionPool = []

    if (category === "mixed") {
      questionPool = Object.values(this.questions).flat()
    } else {
      questionPool = this.questions[category] || []
    }

    if (difficulty !== "mixed") {
      questionPool = questionPool.filter((q) => q.difficulty === difficulty)
    }

    // Shuffle and select 10 questions
    this.currentQuiz = this.shuffleArray(questionPool).slice(0, Math.min(10, questionPool.length))

    if (this.currentQuiz.length === 0) {
      alert("No questions available for the selected criteria. Please choose different options.")
      return false
    }

    return true
  }

  shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  startQuiz() {
    if (!this.generateQuiz()) return

    this.currentQuestionIndex = 0
    this.score = 0
    this.userAnswers = []
    this.startTime = new Date()

    this.showScreen("quiz-screen")
    this.showQuestion()
  }

  showQuestion() {
    const question = this.currentQuiz[this.currentQuestionIndex]
    const questionNumber = this.currentQuestionIndex + 1
    const totalQuestions = this.currentQuiz.length

    // Update progress
    this.progressFill.style.width = `${(questionNumber / totalQuestions) * 100}%`
    this.questionCounter.textContent = `${questionNumber} / ${totalQuestions}`

    // Update question content
    this.questionCategory.textContent = this.getCategoryName(question)
    this.questionText.textContent = question.question
    this.difficultyBadge.textContent = question.difficulty
    this.difficultyBadge.className = `difficulty-badge ${question.difficulty}`

    // Generate answer buttons
    this.answersContainer.innerHTML = ""
    question.answers.forEach((answer, index) => {
      const button = document.createElement("button")
      button.className = "answer-btn"
      button.textContent = answer
      button.addEventListener("click", () => this.selectAnswer(index))
      this.answersContainer.appendChild(button)
    })

    // Reset controls
    this.nextBtn.style.display = "none"
    this.skipBtn.style.display = "block"

    // Start timer
    if (this.timerEnabled) {
      this.startTimer()
    }
  }

  getCategoryName(question) {
    for (const [category, questions] of Object.entries(this.questions)) {
      if (questions.includes(question)) {
        return category.charAt(0).toUpperCase() + category.slice(1)
      }
    }
    return "Mixed"
  }

  startTimer() {
    this.timeLeft = 30
    this.timerElement.textContent = this.timeLeft
    this.timerElement.parentElement.classList.remove("timer-warning")

    this.timer = setInterval(() => {
      this.timeLeft--
      this.timerElement.textContent = this.timeLeft

      if (this.timeLeft <= 10) {
        this.timerElement.parentElement.classList.add("timer-warning")
      }

      if (this.timeLeft <= 0) {
        this.timeUp()
      }
    }, 1000)
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.timerElement.parentElement.classList.remove("timer-warning")
  }

  timeUp() {
    this.stopTimer()
    this.skipQuestion()
  }

  selectAnswer(selectedIndex) {
    this.stopTimer()

    const question = this.currentQuiz[this.currentQuestionIndex]
    const isCorrect = selectedIndex === question.correct

    // Record answer
    this.userAnswers.push({
      questionIndex: this.currentQuestionIndex,
      selectedAnswer: selectedIndex,
      isCorrect: isCorrect,
      skipped: false,
    })

    if (isCorrect) {
      this.score++
      this.updateScore()
    }

    // Disable all buttons and show correct answer
    const buttons = this.answersContainer.querySelectorAll(".answer-btn")
    buttons.forEach((button, index) => {
      button.disabled = true
      if (index === question.correct) {
        button.classList.add("correct")
      } else if (index === selectedIndex && !isCorrect) {
        button.classList.add("incorrect")
      }
    })

    this.nextBtn.style.display = "block"
    this.skipBtn.style.display = "none"
  }

  skipQuestion() {
    this.stopTimer()

    // Record skipped answer
    this.userAnswers.push({
      questionIndex: this.currentQuestionIndex,
      selectedAnswer: null,
      isCorrect: false,
      skipped: true,
    })

    // Show correct answer
    const question = this.currentQuiz[this.currentQuestionIndex]
    const buttons = this.answersContainer.querySelectorAll(".answer-btn")
    buttons.forEach((button, index) => {
      button.disabled = true
      if (index === question.correct) {
        button.classList.add("correct")
      } else {
        button.classList.add("skipped")
      }
    })

    this.nextBtn.style.display = "block"
    this.skipBtn.style.display = "none"
  }

  nextQuestion() {
    this.currentQuestionIndex++

    if (this.currentQuestionIndex < this.currentQuiz.length) {
      this.showQuestion()
    } else {
      this.endQuiz()
    }
  }

  endQuiz() {
    this.endTime = new Date()
    this.updateHighScore()
    this.showResults()
  }

  showResults() {
    const totalQuestions = this.currentQuiz.length
    const correctCount = this.userAnswers.filter((a) => a.isCorrect).length
    const wrongCount = this.userAnswers.filter((a) => !a.isCorrect && !a.skipped).length
    const skippedCount = this.userAnswers.filter((a) => a.skipped).length
    const timeTakenSeconds = Math.floor((this.endTime - this.startTime) / 1000)

    // Update results display
    this.finalScore.textContent = correctCount
    this.correctAnswers.textContent = correctCount
    this.wrongAnswers.textContent = wrongCount
    this.skippedAnswers.textContent = skippedCount
    this.timeTaken.textContent = `${timeTakenSeconds}s`

    // Update results message
    const percentage = Math.round((correctCount / totalQuestions) * 100)
    if (percentage >= 90) {
      this.resultsTitle.textContent = "Excellent! 🎉"
      this.resultsMessage.textContent = "You're a quiz master!"
    } else if (percentage >= 70) {
      this.resultsTitle.textContent = "Great Job! 👏"
      this.resultsMessage.textContent = "You did really well!"
    } else if (percentage >= 50) {
      this.resultsTitle.textContent = "Good Effort! 👍"
      this.resultsMessage.textContent = "Keep practicing!"
    } else {
      this.resultsTitle.textContent = "Keep Learning! 📚"
      this.resultsMessage.textContent = "Practice makes perfect!"
    }

    this.showScreen("results-screen")
  }

  showReview() {
    this.reviewContent.innerHTML = ""

    this.currentQuiz.forEach((question, index) => {
      const userAnswer = this.userAnswers[index]
      const reviewItem = document.createElement("div")
      reviewItem.className = "review-item"

      let userAnswerHtml = ""
      let correctAnswerHtml = ""

      if (userAnswer.skipped) {
        userAnswerHtml = `
          <div class="answer-label">Your Answer:</div>
          <div class="review-answer skipped">Question Skipped</div>
        `
      } else {
        const userAnswerClass = userAnswer.isCorrect ? "user-correct" : "user-incorrect"
        userAnswerHtml = `
          <div class="answer-label">Your Answer:</div>
          <div class="review-answer ${userAnswerClass}">${question.answers[userAnswer.selectedAnswer]}</div>
        `
      }

      if (!userAnswer.isCorrect) {
        correctAnswerHtml = `
          <div class="answer-label">Correct Answer:</div>
          <div class="review-answer correct-answer">${question.answers[question.correct]}</div>
        `
      }

      reviewItem.innerHTML = `
        <div class="review-question">${index + 1}. ${question.question}</div>
        ${userAnswerHtml}
        ${correctAnswerHtml}
        <div class="explanation">
          <div class="explanation-title">💡 Explanation:</div>
          <div class="explanation-text">${question.explanation}</div>
        </div>
      `

      this.reviewContent.appendChild(reviewItem)
    })

    this.showScreen("review-screen")
  }

  updateScore() {
    this.currentScoreDisplay.textContent = this.score
  }

  updateHighScore() {
    const currentHighScore = Number.parseInt(localStorage.getItem("quizHighScore") || "0")
    if (this.score > currentHighScore) {
      localStorage.setItem("quizHighScore", this.score.toString())
      this.loadHighScore()
    }
  }

  loadHighScore() {
    const highScore = localStorage.getItem("quizHighScore") || "0"
    this.highScoreDisplay.textContent = highScore
  }

  resetQuiz() {
    this.stopTimer()
    this.showScreen("start-screen")
  }

  showScreen(screenId) {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("active")
    })
    document.getElementById(screenId).classList.add("active")
  }
}

// Initialize the quiz app when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new QuizApp()
})
