// Tests use Node's built-in test runner, so nothing needs to be installed.
// Run them with:  npm test
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  createQuiz,
  answerQuestion,
  advanceQuiz,
  isQuizFinished,
  shuffle,
  isCorrect,
  calculatePercentage,
  formatTimeLeft,
  getGrade,
  getFeedbackMessage,
} = require("../src/quiz.js");

test("createQuiz creates fresh initial state from questions", () => {
  const questions = [{ answer: 1 }];
  const state = createQuiz(questions);

  assert.deepEqual(state, { questions, current: 0, score: 0 });
  assert.notEqual(state.questions, questions);
  assert.deepEqual(questions, [{ answer: 1 }]);
});

test("createQuiz creates a finished state for an empty question list", () => {
  const state = createQuiz([]);

  assert.deepEqual(state, { questions: [], current: 0, score: 0 });
  assert.equal(isQuizFinished(state), true);
});

test("createQuiz throws for null questions", () => {
  assert.throws(() => createQuiz(null), TypeError);
});

test("answerQuestion increments the score for a correct answer without mutation", () => {
  const state = { questions: [{ answer: 1 }], current: 0, score: 0 };
  const result = answerQuestion(state, 1);

  assert.deepEqual(result, {
    state: { questions: state.questions, current: 0, score: 1 },
    correct: true,
  });
  assert.deepEqual(state, { questions: [{ answer: 1 }], current: 0, score: 0 });
  assert.notEqual(result.state, state);
});

test("answerQuestion preserves the score for an incorrect answer", () => {
  const state = { questions: [{ answer: 1 }], current: 0, score: 2 };

  assert.deepEqual(answerQuestion(state, 0), {
    state: { questions: state.questions, current: 0, score: 2 },
    correct: false,
  });
});

test("answerQuestion throws for a null state", () => {
  assert.throws(() => answerQuestion(null, 0), TypeError);
});

test("advanceQuiz moves to the next question without mutation", () => {
  const state = { questions: [{}, {}], current: 0, score: 1 };
  const result = advanceQuiz(state);

  assert.deepEqual(result, { questions: state.questions, current: 1, score: 1 });
  assert.equal(state.current, 0);
  assert.notEqual(result, state);
});

test("advanceQuiz throws for a null state", () => {
  assert.throws(() => advanceQuiz(null), TypeError);
});

test("isQuizFinished returns false before the last question", () => {
  assert.equal(isQuizFinished({ questions: [{}, {}], current: 1 }), false);
});

test("isQuizFinished returns true at the end of the questions", () => {
  assert.equal(isQuizFinished({ questions: [{}, {}], current: 2 }), true);
});

test("isQuizFinished throws for a null state", () => {
  assert.throws(() => isQuizFinished(null), TypeError);
});

test("isCorrect returns true for the right answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 2), true);
});

test("isCorrect returns false for a wrong answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 0), false);
});

test("calculatePercentage rounds to a whole number", () => {
  assert.equal(calculatePercentage(2, 3), 67);
});

test("calculatePercentage returns 0 when there are no questions", () => {
  assert.equal(calculatePercentage(0, 0), 0);
});

test("formatTimeLeft displays the remaining seconds", () => {
  assert.equal(formatTimeLeft(12), "⏱ 12s");
});

test("formatTimeLeft displays zero seconds", () => {
  assert.equal(formatTimeLeft(0), "⏱ 0s");
});

test("shuffle keeps every item and does not change the original array", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle(original);
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
});

test("getGrade gives an A for exactly 90%", () => {
  assert.equal(getGrade(90), "A");
});

test("getGrade gives a B for exactly 75%", () => {
  assert.equal(getGrade(75), "B");
});

test("getGrade gives a C for exactly 50%", () => {
  assert.equal(getGrade(50), "C");
});

test("getFeedbackMessage returns feedback for an A grade", () => {
  assert.equal(getFeedbackMessage("A"), "Outstanding work!");
});

test("getFeedbackMessage returns feedback for a B grade", () => {
  assert.equal(getFeedbackMessage("B"), "Great job!");
});

test("getFeedbackMessage returns feedback for a C grade", () => {
  assert.equal(getFeedbackMessage("C"), "Nice work!");
});

test("getFeedbackMessage returns feedback for any other grade", () => {
  assert.equal(getFeedbackMessage("Keep practicing"), "Keep practicing—you'll get there!");
});
