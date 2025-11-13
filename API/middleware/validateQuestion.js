// API/middleware/validateQuestion.js
export function validateQuestion(req, res, next) {
  const { question, choices, answer, category } = req.body;
  if (
    !question ||
    !Array.isArray(choices) ||
    choices.length === 0 ||
    !answer ||
    !category
  ) {
    return res.status(400).json({
      success: false,
      error:
        "Invalid question payload. Expect { question, choices: [], answer, category }",
    });
  }
  next();
}
