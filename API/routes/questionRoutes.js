// API/routes/questionRoutes.js
import { Router } from "express";
import {
  getQuestions,
  getQuestionById,
  addQuestion,
  submitAnswers,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";
import { validateQuestion } from "../middleware/validateQuestion.js";

const router = Router();

router
  .route("/questions")
  .get(getQuestions)
  .post(validateQuestion, addQuestion);

router
  .route("/questions/:id")
  .get(getQuestionById)
  .put(validateQuestion, updateQuestion)
  .delete(deleteQuestion);

router.post("/submit", submitAnswers);

export default router;
