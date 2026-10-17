// UI code: connects the quiz logic (quiz.js) to the page (index.html).

let state = createQuiz([]);
const QUESTION_TIME_LIMIT = 15;
const BEST_SCORE_KEY = "dev-days-quiz-best-score";
let timerInterval;
let timeLeft = QUESTION_TIME_LIMIT;
let questionComplete = false;

function loadBestScore() {
  try {
    const storedScore = localStorage.getItem(BEST_SCORE_KEY);
    if (storedScore === null) return null;
    const score = Number(storedScore);
    if (!Number.isInteger(score) || score < 0) {
      console.warn("Ignoring an invalid saved best score.");
      return null;
    }
    return score;
  } catch (error) {
    console.warn("Unable to read the saved best score.", error);
    return null;
  }
}

function saveBestScore(score) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
    return true;
  } catch (error) {
    console.warn("Unable to save the best score.", error);
    return false;
  }
}

let bestScore = loadBestScore();

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const progressText = document.getElementById("progress");
const timerText = document.getElementById("timer");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options");
const feedbackText = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const scoreText = document.getElementById("score-text");
const gradeText = document.getElementById("grade-text");
const resultFeedbackText = document.getElementById("feedback-message");
const bestScoreText = document.getElementById("best-score-text");

function showScreen(screenToShow) {
  [startScreen, quizScreen, resultScreen].forEach((screen) => {
    screen.hidden = screen !== screenToShow;
  });
}

function startQuiz() {
  clearInterval(timerInterval);
  state = createQuiz(shuffle(QUESTIONS));
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  clearInterval(timerInterval);
  timeLeft = QUESTION_TIME_LIMIT;
  questionComplete = false;
  const question = state.questions[state.current];
  progressText.textContent = `Question ${state.current + 1} of ${state.questions.length}`;
  updateTimerDisplay();
  questionText.textContent = question.question;
  feedbackText.textContent = "";
  nextButton.hidden = true;
  optionsList.innerHTML = "";

  question.options.forEach((option, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(index, button));
    item.appendChild(button);
    optionsList.appendChild(item);
  });

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft === 0) completeQuestion(null, true);
  }, 1000);
}

function selectAnswer(selectedIndex, selectedButton) {
  completeQuestion(selectedIndex, false, selectedButton);
}

function completeQuestion(selectedIndex, timedOut, selectedButton) {
  if (questionComplete) return;
  questionComplete = true;
  clearInterval(timerInterval);

  const question = state.questions[state.current];
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));

  if (timedOut) {
    buttons[question.answer].classList.add("correct");
    feedbackText.textContent = "Time's up!";
  } else {
    const result = answerQuestion(state, selectedIndex);
    state = result.state;
    if (result.correct) {
      selectedButton.classList.add("correct");
      feedbackText.textContent = "Correct!";
    } else {
      selectedButton.classList.add("wrong");
      buttons[question.answer].classList.add("correct");
      feedbackText.textContent = "Not quite. The correct answer is highlighted.";
    }
  }

  nextButton.hidden = false;
  nextButton.focus();
}

function updateTimerDisplay() {
  timerText.textContent = formatTimeLeft(timeLeft);
  timerText.classList.toggle("timer--urgent", timeLeft <= 5);
}

function nextQuestion() {
  clearInterval(timerInterval);
  state = advanceQuiz(state);
  if (!isQuizFinished(state)) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  const total = state.questions.length;
  const percentage = calculatePercentage(state.score, total);
  const grade = getGrade(percentage);
  if (isNewBestScore(state.score, bestScore)) {
    bestScore = state.score;
    const saved = saveBestScore(bestScore);
    const note = saved ? " (new best!)" : " (this session)";
    bestScoreText.textContent = `Best score: ${bestScore} out of ${total}${note}`;
  } else {
    bestScoreText.textContent = `Best score: ${bestScore} out of ${total}`;
  }
  scoreText.textContent = `You scored ${state.score} out of ${total} (${percentage}%)`;
  gradeText.textContent = `Grade: ${grade}`;
  resultFeedbackText.textContent = getFeedbackMessage(grade);
  showScreen(resultScreen);
}

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("restart-btn").addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
