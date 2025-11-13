// Minimal QCM frontend using fetch and modular JS
const API_BASE = "/API/survey/questions";

// Helper to get element by id
const el = (id) => document.getElementById(id);

// Render QCM questions using Bootstrap cards
function renderQuestions(questions) {
  const container = el("qcm-container");
  if (!questions || questions.length === 0) {
    container.innerHTML = '<p class="muted">No questions available.</p>';
    return;
  }
  const row = document.createElement("div");
  row.className = "row g-4";
  questions.forEach((q, idx) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4 d-flex";

    const card = document.createElement("div");
    card.className = "card flex-fill";
    card.style.width = "18rem";

    // Optionally add an image here if desired
    // const img = document.createElement("img");
    // img.className = "card-img-top";
    // img.src = "...";
    // img.alt = "...";
    // card.appendChild(img);

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = q.question;
    cardBody.appendChild(title);

    if (Array.isArray(q.choices) && q.choices.length > 0) {
      q.choices.forEach((choice, cidx) => {
        const formCheck = document.createElement("div");
        formCheck.className = "form-check";

        const input = document.createElement("input");
        input.className = "form-check-input";
        input.type = "radio";
        input.name = `qcm-${q.id}`;
        input.value = choice;
        input.id = `qcm-${q.id}-choice-${cidx}`;

        const label = document.createElement("label");
        label.className = "form-check-label";
        label.setAttribute("for", input.id);
        label.textContent = choice;

        formCheck.appendChild(input);
        formCheck.appendChild(label);
        cardBody.appendChild(formCheck);
      });
    }

    card.appendChild(cardBody);
    col.appendChild(card);
    row.appendChild(col);
  });
  container.innerHTML = "";
  container.appendChild(row);
}

// Handle QCM form submission: collect answers, POST to API, show score
async function handleQcmSubmit(event) {
  event.preventDefault();
  const form = event.target;
  // Find all unique question names (qcm-<id>)
  const questionInputs = form.querySelectorAll('input[type="radio"]');
  const questionNames = Array.from(
    new Set(Array.from(questionInputs).map((i) => i.name))
  );
  const responses = [];
  questionNames.forEach((name) => {
    const checked = form.querySelector(`input[name='${name}']:checked`);
    if (checked) {
      const id = parseInt(name.replace("qcm-", ""));
      responses.push({ id, response: checked.value });
    }
  });
  // POST to /API/survey/submit (the correct endpoint)
  try {
    const res = await fetch("/API/survey/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        responses,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();
    // Show the final answer sentence (not numbers)
    el("survey-result").textContent =
      result.finalAnswer || "Thank you for completing the survey!";
  } catch (err) {
    el("survey-result").textContent = `Error: ${err.message}`;
  }
}

// Fetch questions from API and render
async function fetchQuestions() {
  const container = el("qcm-container");
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const questions = await res.json();
    renderQuestions(questions);
  } catch (err) {
    container.innerHTML = `<p class="error">Failed to load questions: ${err.message}</p>`;
  }
}

// On page load, fetch and display questions, categories, and wire up events
document.addEventListener("DOMContentLoaded", () => {
  fetchQuestions();
  const form = el("qcm-form");
  if (form) {
    form.addEventListener("submit", handleQcmSubmit);
  }
});
