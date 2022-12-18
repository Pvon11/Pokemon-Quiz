var startButton = document.getElementById("start-btn");
var continueButton = document.getElementById("continue");
var infoBox = document.getElementById("info-box");
var questionContainer = document.getElementById("question-container");
var questionHeader = document.getElementById("question");
var answersContainer = document.getElementById("answers-container");

var questionIndex = 0;

var questions = [
  {
    question: "What type is the pokemon dugtrio",
    answers: ["Fire", "Ground", "Water", "Steel"],
    correctAnswer: 1,
  },
  {
    question: "Question 2",
    answers: ["answer 2-1", "answer 2-2", "answer 2-3", "answer 2-4"],
    correctAnswer: 3,
  },
  {
    question: "Question 2",
    answers: ["answer 3-1", "answer 2-2", "answer 2-3", "answer 2-4"],
    correctAnswer: 3,
  },
  {
    question: "Question 2",
    answers: ["answer 4-1", "answer 2-2", "answer 2-3", "answer 2-4"],
    correctAnswer: 3,
  },
  {
    question: "Question 2",
    answers: ["answer 5-1", "answer 2-2", "answer 2-3", "answer 2-4"],
    correctAnswer: 3,
  },
  {
    question: "Question 2",
    answers: ["answer 6-1", "answer 2-2", "answer 2-3", "answer 2-4"],
    correctAnswer: 3,
  },
];

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
});
