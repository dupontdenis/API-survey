// API/middleware/validateQuestion.js
export function validateQuestion(req, res, next) {
  const { question, choices, score } = req.body;
  if (
    !question ||
    !Array.isArray(choices) ||
    choices.length < 3 ||
    !Array.isArray(score) ||
    score.length !== choices.length
  ) {
    return res.status(400).json({
      success: false,
      error:
        "Invalid question payload. Expect { question, choices: [min 3], score: [same length as choices] }",
    });
  }
  next();
}
