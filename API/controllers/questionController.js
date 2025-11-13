import {
  findAll,
  findById,
  create,
  update,
  remove,
  score,
  finalAnswer,
} from "../models/questionModel.js";

export const getQuestions = (req, res) => {
  const filtered = findAll();
  res.json(filtered.map(({ score, ...q }) => q)); // Hide answers
};

export const getQuestionById = (req, res) => {
  const question = findById(parseInt(req.params.id));
  if (!question) return res.status(404).json({ error: "Question not found" });
  const { score, ...q } = question;
  res.json(q);
};

export const addQuestion = (req, res) => {
  const { question, choices, score } = req.body;
  if (
    !question ||
    !Array.isArray(choices) ||
    choices.length === 0 ||
    !Array.isArray(score) ||
    score.length !== choices.length
  ) {
    return res.status(400).json({
      error:
        "Invalid question payload. Expect { question, choices: [], score: [] } (score array must match choices)",
    });
  }
  const newQuestion = create({
    question,
    choices,
    score,
  });
  res.status(201).json(newQuestion);
};

export const updateQuestion = (req, res) => {
  const id = parseInt(req.params.id);
  const { question, choices, score } = req.body;
  const updated = update(id, { question, choices, score });
  if (!updated) return res.status(404).json({ error: "Question not found" });
  res.json(updated);
};

export const deleteQuestion = (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = remove(id);
  if (!deleted) return res.status(404).json({ error: "Question not found" });
  res.json({ success: true });
};

export const submitAnswers = (req, res) => {
  const { responses } = req.body;
  // Compute score and maxScore from responses
  const { score: userScore, max } = score(responses || []);
  const final = finalAnswer(userScore, max);
  res.json({ finalAnswer: final });
};
