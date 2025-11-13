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

MIT
