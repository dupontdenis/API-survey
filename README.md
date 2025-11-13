# How the Frontend Works & Score Computation

The frontend is a minimal web app that interacts with the API using JavaScript (see `public/js/app.mjs`).

**How it works:**

- On page load, it fetches all questions from `/API/survey/questions` and displays them as a form with radio buttons for each choice.
- When the user submits the form, it collects the selected answers and sends them as an array of `{ id, response }` objects to `/API/survey/submit`.
- The backend computes the score and returns a final lifestyle message, which is displayed to the user.

**How the score is computed:**

1. Each question has a hidden `score` array, with a score for each possible answer.
2. When a user submits their responses, the backend receives an array of `{ id, response }` objects.
3. For each question:

- The backend finds the user’s selected answer.
- It looks up the corresponding score for that answer.
- It adds this score to the total.
- It also adds the maximum possible score for that question to a running max.

4. The final score is the sum of the selected answers’ scores.
5. The backend then calculates the percentage: `(totalScore / maxScore) * 100`.
6. Based on the percentage, a final message is selected and returned to the user.

This logic is handled in the `score` and `finalAnswer` functions in your backend.

# Lifestyle Survey API

This project is a simple RESTful API for a "Lifestyle Survey" (QCM-like) application, built with Node.js and Express. It allows you to manage survey questions and submit user responses to receive a lifestyle assessment.

## Features

- List all survey questions (without exposing internal scoring)
- Get a single question by ID
- Add, update, and delete questions (admin endpoints)
- Submit answers and receive a lifestyle result (not a numeric score)
- All data is stored in-memory (no database)

## API Endpoints

### Questions

- `GET /API/survey/questions` — List all questions
- `GET /API/survey/questions/:id` — Get a question by ID
- `POST /API/survey/questions` — Add a new question
- `PUT /API/survey/questions/:id` — Update a question
- `DELETE /API/survey/questions/:id` — Delete a question

### Survey Submission

- `POST /API/survey/submit` — Submit user responses and get a lifestyle result
  - Request body: `{ responses: [{ id: number, response: string }, ...] }`
  - Response: `{ finalAnswer: string }`

## Why So Many Methods in `models/questionModel.js`?

The model file defines several methods to keep the logic organized and maintainable:

- `findAll()` — Returns all questions (for listing)
- `findById(id)` — Returns a single question by its ID
- `create({ question, choices, score })` — Adds a new question, ensuring valid structure
- `update(id, data)` — Updates an existing question, with validation
- `remove(id)` — Deletes a question by ID
- `score(responses)` — Calculates the user's total score and the maximum possible score, based on their answers
- `finalAnswer(totalScore, maxScore)` — Maps the user's score to a lifestyle result (returns a sentence, not a number)

**Reason for this structure:**

- Each method has a single responsibility, making the code easier to test and extend.
- Validation is centralized in the model, so the API always enforces correct data.
- The scoring and result logic is hidden from the user, but easy to update in one place.
- This separation keeps the controller code clean and focused on HTTP logic.

## How to Run

1. Install dependencies: `npm install`
2. Start the server: `npm run dev` or `node app.js`
3. Open `http://localhost:3000` in your browser to use the survey app.

## License

MIT copirate SuperDupont

## Advice for Students

If you are using this project as part of your coursework or exam preparation, it is strongly recommended that you read, understand, and experiment with the code. Understanding how the filtering, scoring, and API logic work will help you succeed in exams and deepen your practical knowledge of JavaScript, Node.js, and RESTful APIs.

> **Tip:** Try modifying the code, adding new features, or debugging issues to reinforce your learning!
