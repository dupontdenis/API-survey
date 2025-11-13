/**
 * Structure d'une question du Lifestyle Survey :
 * {
 *   id: number // string (UUID),
 *   question: string,
 *   choices: string[],
 *   score: number[] // même longueur que choices, score caché à l'utilisateur
 * }
 * Le score est utilisé pour le calcul interne, il n'est jamais exposé dans l'API.
 */
export const Survey = {
  name: "Lifestyle Survey",
  questions: [
    {
      id: 1,
      question: "How often do you exercise?",
      choices: ["Never", "Sometimes", "Often"],
      score: [0, 2, 4],
    },
    {
      id: 2,
      question: "How many hours do you sleep on average per night?",
      choices: ["Less than 6h", "6 to 8h", "More than 8h"],
      score: [1, 3, 5],
    },
    {
      id: 3,
      question: "Do you eat fruits and vegetables every day?",
      choices: ["Never", "Sometimes", "Every day"],
      score: [0, 2, 6],
    },
    {
      id: 4,
      question: "Do you smoke?",
      choices: ["Yes", "Sometimes", "No"],
      score: [2, 1, 5],
    },
    {
      id: 5,
      question: "How often do you eat fast food?",
      choices: ["Never", "Sometimes", "Often"],
      score: [5, 2, 0],
    },
  ],
  finalAnswers: [
    "Make an effort to improve your lifestyle.",
    "You have good habits, keep it up!",
    "Perfect, you are a model athlete!",
  ],
};

export function findAll() {
  return Survey.questions;
}

export function findById(id) {
  return Survey.questions.find((q) => q.id === id);
}

export function create({ question, choices, score }) {
  // Generate next numeric id
  const id =
    Survey.questions.length > 0
      ? Math.max(...Survey.questions.map((q) => q.id)) + 1
      : 1;
  // Ensure choices and score arrays are at least length 3 and match
  if (!Array.isArray(choices) || choices.length < 3) {
    throw new Error("Chaque question doit avoir au moins 3 choix.");
  }
  if (!Array.isArray(score) || score.length !== choices.length) {
    throw new Error(
      "Le tableau score doit avoir la même longueur que choices."
    );
  }
  const newQuestion = { id, question, choices, score };
  Survey.questions.push(newQuestion);
  return newQuestion;
}

export function update(id, data) {
  const idx = Survey.questions.findIndex((q) => q.id === id);
  if (idx === -1) return null;
  // Validate choices and score if provided
  if (
    data.choices &&
    (!Array.isArray(data.choices) || data.choices.length < 3)
  ) {
    throw new Error("Chaque question doit avoir au moins 3 choix.");
  }
  if (
    data.score &&
    (!Array.isArray(data.score) ||
      (data.choices
        ? data.score.length !== data.choices.length
        : data.score.length !== Survey.questions[idx].choices.length))
  ) {
    throw new Error(
      "Le tableau score doit avoir la même longueur que choices."
    );
  }
  Survey.questions[idx] = { ...Survey.questions[idx], ...data, id };
  return Survey.questions[idx];
}

export function remove(id) {
  const idx = Survey.questions.findIndex((q) => q.id === id);
  if (idx === -1) return false;
  Survey.questions.splice(idx, 1);
  return true;
}

export function score(responses) {
  // Use a single reduce to compute both score and max
  const result = Survey.questions.reduce(
    (acc, q) => {
      // Find user response for this question
      const userResp = responses.find((r) => r.id === q.id);
      if (userResp) {
        const idx = q.choices.indexOf(userResp.response);
        if (idx !== -1) {
          acc.score += q.score[idx];
        }
      }
      acc.max += Math.max(...q.score);
      return acc;
    },
    { score: 0, max: 0 }
  );
  return result;
}

// returns the final answer based on the score
export function finalAnswer(totalScore, maxScore) {
  const percentage = (totalScore / maxScore) * 100;
  if (percentage < 40) {
    return Survey.finalAnswers[0];
  } else if (percentage < 70) {
    return Survey.finalAnswers[1];
  } else {
    return Survey.finalAnswers[2];
  }
}
