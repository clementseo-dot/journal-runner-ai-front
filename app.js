const API_URL =
  "https://journal-runner-ai.onrender.com";

const questionInput =
  document.getElementById("question");

const askButton =
  document.getElementById("askButton");

const buttonText =
  document.getElementById("buttonText");

const loading =
  document.getElementById("loading");

const result =
  document.getElementById("result");

const answer =
  document.getElementById("answer");

const errorBox =
  document.getElementById("error");

const sources =
  document.getElementById("sources");

const sourcesList =
  document.getElementById("sourcesList");


function showLoading(show) {
  loading.classList.toggle(
    "hidden",
    !show
  );

  askButton.disabled = show;

  buttonText.textContent =
    show
      ? "Recherche..."
      : "Demander au Coach";
}


function resetUI() {
  result.classList.add("hidden");
  errorBox.classList.add("hidden");
  sources.classList.add("hidden");

  answer.textContent = "";
  sourcesList.innerHTML = "";
}


function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}


function displaySources(items) {

  if (!items || items.length === 0) {
    return;
  }

  items.forEach((source) => {

    const card =
      document.createElement("a");

    card.className =
      "source-card";

    card.href =
      source.url;

    card.target =
      "_blank";

    card.rel =
      "noopener noreferrer";


    const label =
      document.createElement("div");

    label.className =
      "source-label";

    label.textContent =
      "JOURNAL DU RUNNER";


    const title =
      document.createElement("div");

    title.className =
      "source-title";

    title.textContent =
      source.title;


    card.appendChild(label);
    card.appendChild(title);

    sourcesList.appendChild(card);
  });

  sources.classList.remove("hidden");
}


async function askCoach() {

  const question =
    questionInput.value.trim();

  if (!question) {
    showError(
      "Pose une question au Coach avant de continuer."
    );

    return;
  }

  resetUI();
  showLoading(true);

  try {

    const response =
      await fetch(
        API_URL + "/ask",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            question
          })
        }
      );


    const data =
      await response.json();


    if (!response.ok) {
      throw new Error(
        data.error ||
        "Impossible d'obtenir une réponse."
      );
    }


    answer.textContent =
      data.answer;

    displaySources(
      data.sources
    );

    result.classList.remove(
      "hidden"
    );


    result.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });


  } catch (error) {

    console.error(error);

    showError(
      "Le Coach rencontre un problème. Réessaie dans quelques instants."
    );

  } finally {

    showLoading(false);
  }
}


askButton.addEventListener(
  "click",
  askCoach
);


questionInput.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();
      askCoach();
    }
  }
);


document
  .querySelectorAll(
    ".suggestion"
  )
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        questionInput.value =
          button.dataset.question;

        questionInput.focus();
      }
    );
  });
