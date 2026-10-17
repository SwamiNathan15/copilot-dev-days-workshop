# Copilot instructions

## Project shape

- This repository is both a workshop guide and its starter quiz app. The three guides share the same project and workflow; keep shared setup, commands, and chapter content consistent across [README.md](../README.md), [VS Code](../workshops/vscode.md), [CLI](../workshops/cli.md), and [Copilot app](../workshops/copilot-app.md).
- The app is plain HTML, CSS, and JavaScript with no build step or declared dependencies. The root [index.html](../index.html) redirects GitHub Pages visitors to `src/`.
- In `src/`, `index.html` loads `questions.js`, `quiz.js`, then `app.js` as classic scripts. Preserve this order and the browser globals: `questions.js` owns quiz data, `quiz.js` owns DOM-independent logic, and `app.js` owns DOM access and event handling.
- `quiz.js` also exports its pure functions through `module.exports` for Node tests. Keep browser logic free of DOM dependencies so it remains directly testable.

## Build and test

- `npm test` runs both test files with Node's built-in test runner. No install step is required.
- Run one test file with `node --test tests/quiz.test.js` (or `tests/questions.test.js`).
- Run one named test with `node --test --test-name-pattern="test name" tests/quiz.test.js`.
- `npm start` serves `src/` at `http://localhost:8080`.

## Project conventions

- Tests use `node:test` and `node:assert/strict`; test exported logic and quiz data, not browser DOM code.
- Quiz entries have `{ question, options, answer }`; `answer` is the zero-based index of the correct option. Keep four options per question and unique question text, as checked by `tests/questions.test.js`; verify the factual answer as well.
- Keep colors in the `:root` CSS variables in `src/style.css`. Use buttons for actions, retain visible keyboard focus, and use `aria-live` for changing messages.
- The untouched starter intentionally has one failing test for `getGrade(90)`; the workshop fixes the planted boundary bug in Chapter 4.
