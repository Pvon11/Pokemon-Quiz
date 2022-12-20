var startButton = document.getElementById("start-btn");
var continueButton = document.getElementById("continue");
var infoBox = document.getElementById("info-box");
var questionContainer = document.getElementById("question-container");
var resultBox = document.getElementById("");
var questionHeader = document.getElementById("question");
var answersContainer = document.getElementById("answers-container");
var timeCount = document.getElementById("time-count");

var questionIndex = 0;

var count = 60;

var interval;

var questions = [
  {
    question: "What type is the pokemon dugtrio",
    answers: ["Fire", "Ground", "Water", "Steel"],
    correctAnswer: 1,
  },
  {
    question: "The psychic type is supper effective aginst which type",
    answers: ["Normal", "Fairy", "Fighting", "Flying"],
    correctAnswer: 2,
  },
  {
    question: "How many gym badges do you need to challenge the Elite Four",
    answers: ["100", "4", "25", "8"],
    correctAnswer: 3,
  },
  {
    question: "Charmleon evolves into which Pokemon",
    answers: ["Blastoise", "Mewtwo", "Charizard", "Marowak"],
    correctAnswer: 2,
  },
  {
    question: "What is Eevee's evolution if you give it a water stone",
    answers: ["Vaporeon", "Jolteon", "Flareon", "Umbreon"],
    correctAnswer: 0,
  },
];

var timer = function () {
  count--;
  timeCount.textContent = count;
  if (count === 0) {
    clearInterval(interval);
    alert("You're out of time!");
  }
};

var renderQuestions = function () {
  if (questionIndex >= questions.length) {
    // you will want to handle your end fo quiz functionality ie
    // saving the score in the LS and giving the user the chance
    // to redo the game or simply check the highscores and also ending the timer
    endQuiz();
    return;
  }

  questionHeader.innerText = questions[questionIndex].question;
  var answersArray = questions[questionIndex].answers;

  for (let index = 0; index < answersArray.length; index++) {
    var answerButton = document.createElement("button");
    answerButton.innerText = answersArray[index];
    answerButton.classList.add("answer");

    answersContainer.appendChild(answerButton);

    answerButton.addEventListener("click", function () {
      isAnswerCorrect(questions[questionIndex].correctAnswer, index);
    });
  }
};

var isAnswerCorrect = function (correctAnswer, answer) {
  if (answer === correctAnswer) {
    questionIndex++;
    answersContainer.innerHTML = "";
    renderQuestions();
  } else {
    console.log("wrong!");
  }
};

var endQuiz = function () {
  clearInterval(interval);
  console.log("End of quiz");
};

// event listeners should be at the bottom
startButton.addEventListener("click", function () {
  startButton.classList.add("hide");
  infoBox.classList.remove("hide");
});

continueButton.addEventListener("click", function () {
  infoBox.classList.add("hide");
  questionContainer.classList.remove("hide");
  renderQuestions();
  // startTimer(60);

  interval = setInterval(timer, 1000);
});
