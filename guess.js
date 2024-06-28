//Setting game name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector(
  ".footer"
).innerHTML = `${gameName} Game Created By <span> Mostafa Osama </span>`;

//Setting game options
let numberOfTries = 6,
  numberOfLetters = 6,
  currentTry = 1,
  numberOfHints = 2;

// Manage Words
let wordToGuess = "";
const words = [
  "Create",
  "Update",
  "Delete",
  "Master",
  "Branch",
  "Mainly",
  "Elzero",
  "School",
];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");

// Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

function generateInput() {
  let inputsContainer = document.querySelector(".inputs");

  //Create main try div
  for (i = 1; i <= numberOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;

    if (i !== 1) tryDiv.classList.add("disabled-input");

    //Create inputs
    for (j = 1; j <= numberOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess${i}-letter${j}`;

      input.maxLength = 1;
      tryDiv.appendChild(input);
    }

    inputsContainer.appendChild(tryDiv);
  }

  //Focus on first input in first try
  inputsContainer.children[0].children[1].focus();

  //Disabled all inputs expect first one
  const inputsDisabledDiv = document.querySelectorAll(".disabled-input input");
  inputsDisabledDiv.forEach((input) => {
    input.disabled = true;
  });

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    //Convert input to uppercase
    input.addEventListener("input", () => {
      input.value = input.value.toUpperCase();

      //Focus on next input
      if (input.nextElementSibling) input.nextElementSibling.focus();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        if (input.nextElementSibling) input.nextElementSibling.focus();
      } else if (e.key === "ArrowLeft") {
        if (input.previousElementSibling) input.previousElementSibling.focus();
      }
    });
  });
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

console.log(wordToGuess);
function handleGuesses() {
  let successGuess = true;
  for (let i = 1; i <= numberOfLetters; i++) {
    const inputField = document.querySelector(`#guess${currentTry}-letter${i}`);
    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];

    // Game Logic
    if (letter === actualLetter) {
      // Letter Is Correct And In Place
      inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      // Letter Is Correct And Not In Place
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      // Letter Is Wrong
      inputField.classList.add("no");
      successGuess = false;
    }
  }

  // Check if the user win or lose
  if (successGuess) {
    messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;
    if (numberOfHints === 2) {
      messageArea.innerHTML = `Congratulations You Didn't Use Hints`;
    }

    // Add Disabled Class On All Try Divs
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-input"));

    // Disable Guess Button
    guessButton.disabled = true;
    getHintButton.disabled = true;
  } else {
    let currentDiv = document.querySelector(`.try-${currentTry}`);
    currentDiv.classList.add("disabled-input");
    Array.from(currentDiv.children).forEach((input) => {
      input.disabled = true;
    });
    currentTry++;

    let nextDiv = document.querySelector(`.try-${currentTry}`);
    Array.from(nextDiv.children).forEach((input) => {
      input.disabled = false;
    });
    if (nextDiv) {
      nextDiv.classList.remove("disabled-input");
      nextDiv.children[1].focus();
    } else {
      // Disabled guess button
      guessButton.disabled = true;
      getHintButton.disabled = true;
      messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
    }
  }
}

function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector(".hint span").innerHTML = numberOfHints;
  }
  if (numberOfHints === 0) {
    getHintButton.disabled = true;
  }

  const enabledInputs = document.querySelectorAll("input:not([disabled])"),
    emptyEnabledInputs = Array.from(enabledInputs).filter(
      (input) => input.value === ""
    );

  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);

    if (indexToFill !== -1) {
      randomInput.value = [...wordToGuess][indexToFill].toUpperCase();
    }
  }
}

function handleBackspace(event) {
  if (event.key === "Backspace") {
    let currentInput = document.querySelector("input:focus");
    if (currentInput.value !== "") {
      currentInput.value = "";
    } else {
      const enabledInputs = Array.from(
        document.querySelectorAll("input:not([disabled])")
      );
      for (i = enabledInputs.indexOf(currentInput); i >= 0; i--) {
        if (!enabledInputs[i - 1]) {
          enabledInputs[0].focus();
          break;
        }
        if (enabledInputs[i - 1].value !== "") {
          enabledInputs[i - 1].focus();
          enabledInputs[i - 1].value = "";
          break;
        } else continue;
      }
    }
  }
}

document.addEventListener("keydown", handleBackspace);

window.onload = () => {
  generateInput();
};
