var startButton = document.getElementById("start-btn");
var continueButton = document.getElementById("continue");
var infoBox = document.getElementById("info-box");
var questionContainer = document.getElementById("question-container");
var resultBox = document.getElementById("result-container");
var questionImage = document.getElementById("question-image");
var questionHeader = document.getElementById("question");
var answersContainer = document.getElementById("answers-container");
var timeCount = document.getElementById("time-count");
var username = document.getElementById("username");
var saveButton = document.getElementById("saveScoreBtn");
var restartButton = document.getElementById("restart");
var savedUsernamesContainer = document.getElementById(
  "saved-usernames-container"
);
var viewSavedDataBtn = document.getElementById("viewSavedDataBtn");
var savedUsernamesList = document.getElementById("saved-usernames-list");

var questionIndex = 0;
var count = 60;
var interval;
var questions = [];

// Fisher-Yates algorithm that works
function shuffleArray(array) {
  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var fetchQuestions = function () {
  // limit 898 = all pokes up to Gen 1-8,
  fetch("https://pokeapi.co/api/v2/pokemon?limit=898")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var allPokemon = data.results;

      var selectedPokemonIndexes = getRandomIndexes(allPokemon.length, 20);

      var pokemonPromises = selectedPokemonIndexes.map(function (index) {
        var pokemon = allPokemon[index];
        return fetch(pokemon.url).then(function (response) {
          return response.json();
        });
      });

      Promise.all(pokemonPromises)
        .then(function (pokemonDataArray) {
          pokemonDataArray.forEach(function (pokemonData) {
            var question = {
              question: "Who's That Pokémon?",
              image: pokemonData.sprites.front_default,
              options: [],
              correctAnswer: 0,
            };

            question.options.push(pokemonData.name);

            var allPokemonNames = allPokemon
              .filter(function (pokemon, index) {
                return selectedPokemonIndexes.includes(index);
              })
              .map(function (p) {
                return p.name;
              });

            allPokemonNames.splice(
              allPokemonNames.indexOf(pokemonData.name),
              1
            );

            for (var i = 0; i < 3; i++) {
              var randomIndex = Math.floor(
                Math.random() * allPokemonNames.length
              );
              question.options.push(allPokemonNames[randomIndex]);
              allPokemonNames.splice(randomIndex, 1);
            }

            question.options = shuffleArray(question.options);
            question.correctAnswer = question.options.indexOf(pokemonData.name);

            questions.push(question);

            if (questions.length === pokemonDataArray.length) {
              startQuiz();
            }
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
};

// Function to get unique random indexes
function getRandomIndexes(maxIndex, count) {
  var indexes = [];
  for (var i = 0; i < count; i++) {
    var randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * maxIndex);
    } while (indexes.includes(randomIndex));
    indexes.push(randomIndex);
  }
  return indexes;
}

// Function to get random elements from an array
function getRandomElements(array, count) {
  var shuffled = array.slice();
  var random = [];
  var index = -1;

  while (random.length < count && ++index < shuffled.length) {
    var rand = Math.floor(Math.random() * (index + 1));
    if (rand !== index) {
      random.push(random[rand]);
      random[rand] = shuffled[index];
    } else {
      random.push(shuffled[index]);
    }
  }

  return random.slice(0, count);
}

var timer = function () {
  count--;
  timeCount.textContent = count;
  if (count <= 0) {
    clearInterval(interval);
    alert("You're out of time!");
    endQuiz();
  }
};

var renderQuestions = function () {
  if (questionIndex >= questions.length) {
    endQuiz();
    return;
  }
  questionHeader.innerText = questions[questionIndex].question;

  var image = new Image();
  image.src = questions[questionIndex].image;
  image.onload = function () {
    questionImage.innerHTML = "";
    questionImage.appendChild(image);
  };

  var optionsArray = questions[questionIndex].options;

  answersContainer.innerHTML = "";

  for (let index = 0; index < optionsArray.length; index++) {
    var answerButton = document.createElement("button");
    answerButton.innerText = optionsArray[index];
    answerButton.classList.add("answer");

    answersContainer.appendChild(answerButton);

    answerButton.addEventListener("click", function () {
      isAnswerCorrect(questions[questionIndex].correctAnswer, index);
    });
  }
};

// Check if the answer is correct
function isAnswerCorrect(correctAnswer, answer) {
  if (answer === correctAnswer) {
    questionIndex++;
    renderQuestions();
    // Show thumbs up emoji for correct answer
    var emojiElement = document.createElement("span");
    emojiElement.innerHTML = "&#128077;"; // thumbs up emoji
    emojiElement.classList.add("emoji");
    timeCount.insertAdjacentElement("afterend", emojiElement);
  } else {
    count -= 5;
    console.log("Wrong answer!");
    // Show -5 for wrong answer
    var penaltyElement = document.createElement("span");
    penaltyElement.textContent = "-5";
    penaltyElement.classList.add("penalty");
    timeCount.insertAdjacentElement("afterend", penaltyElement);
  }
}

var endQuiz = function () {
  clearInterval(interval);
  questionContainer.classList.add("hide");
  resultBox.classList.remove("hide");
  console.log("End of quiz");
};

var startQuiz = function () {
  infoBox.classList.add("hide");
  questionContainer.classList.remove("hide");
  renderQuestions();
  interval = setInterval(timer, 1000);
};
function resetQuiz() {
  clearInterval(interval);
  questionIndex = 0;
  count = 60;
  questions = [];
  timeCount.textContent = count;
  clearPenaltyElements();
  clearEmojiElement();
  clearUserAnswers();
}

function clearPenaltyElements() {
  var penaltyElements = document.getElementsByClassName("penalty");
  while (penaltyElements.length > 0) {
    penaltyElements[0].parentNode.removeChild(penaltyElements[0]);
  }
}

function clearEmojiElement() {
  var emojiElement = document.getElementsByClassName("emoji");
  if (emojiElement.length > 0) {
    emojiElement[0].parentNode.removeChild(emojiElement[0]);
  }
}

function clearUserAnswers() {
  // Clear any data structures or variables storing user's previous answers
}

startButton.addEventListener("click", function () {
  startButton.classList.add("hide");
  fetchQuestions();
});

saveButton.addEventListener("click", function (event) {
  event.preventDefault();
  localStorage.setItem(username.value, count);
});

continueButton.addEventListener("click", function () {
  resetQuiz();
  infoBox.classList.add("hide");
  questionContainer.classList.remove("hide");
  renderQuestions();
  interval = setInterval(timer, 1000);
});

restartButton.addEventListener("click", function () {
  resetQuiz();
  resultBox.classList.add("hide");
  startButton.classList.remove("hide");
});

var savedUsernamesContainer = document.getElementById(
  "saved-usernames-container"
);
var viewSavedDataBtn = document.getElementById("viewSavedDataBtn");
var savedUsernamesList = document.getElementById("saved-usernames-list");

saveButton.addEventListener("click", function (event) {
  event.preventDefault();
  var savedUsername = username.value;

  // Save the username to local storage
  localStorage.setItem(savedUsername, count);

  // Create a button to represent the saved username
  var savedUsernameBtn = document.createElement("button");
  savedUsernameBtn.textContent = savedUsername;
  savedUsernameBtn.classList.add("saved-username-btn");

  // Add an event listener to the saved username button
  savedUsernameBtn.addEventListener("click", function () {
    alert(
      "Username: " +
        savedUsername +
        "\nScore: " +
        localStorage.getItem(savedUsername)
    );
  });

  savedUsernamesList.appendChild(savedUsernameBtn);
});

viewSavedDataBtn.addEventListener("click", function () {
  savedUsernamesContainer.classList.toggle("show-saved-usernames");
});

window.addEventListener("load", function () {
  var savedUsernames = Object.keys(localStorage);

  savedUsernames.forEach(function (username) {
    var savedUsernameBtn = document.createElement("button");
    savedUsernameBtn.textContent = username;
    savedUsernameBtn.classList.add("saved-username-btn");

    savedUsernameBtn.addEventListener("click", function () {
      alert(
        "Username: " + username + "\nScore: " + localStorage.getItem(username)
      );
    });

    savedUsernamesList.appendChild(savedUsernameBtn);
  });
});

// Initialize the quiz
resetQuiz();
