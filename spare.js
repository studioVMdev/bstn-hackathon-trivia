let state = {
	maxGames: 0,
	questions: [],
	currentGame: 0,
	score1: 0,
	score2: 0,
	submitted: 0,
};

const startBtn = select(".start__button");

startBtn.addEventListener("click", (e) => {
	const categoryVal = select(".select__wrapper").value;
	const limitVal = select(".input__limit").value;
	//Number of games
	state.maxGames = Number(limitVal);

	const URL = `https://api.trivia.willfry.co.uk/questions?categories=${categoryVal}&limit=${limitVal}`;

	const startMenuEl = select(".start");
	startMenuEl.style.visibility = "hidden";

	axios.get(URL).then((response) => {
		state.questions = response.data;
		console.log(state.questions);
		round();
	});
});

//! Round
//! Round
//! Round
const round = () => {
	const infoContainer = select(".info__container");
	infoContainer.classList.add("info__container--show");
	const infoBtn = select(".info__button");
	infoBtn.innerText = "Next Question";
	// Format DATA
	// console.log(state.currentGame)
	const currentQuestionObj = state.questions[state.currentGame];
	// console.log(currentQuestionObj)
	const answerPool = [];
	const currQuestionText = currentQuestionObj.question;
	const correctA = currentQuestionObj.correctAnswer;
	const incorrectAs = currentQuestionObj.incorrectAnswers;
	answerPool.push(correctA);
	answerPool.push(...incorrectAs);
	// console.log(answerPool);
	const randomisePool = () => {
		return answerPool.sort(() => (Math.random() > 0.5 ? 1 : -1));
	};

	//Dispatch data
	const card1Html = createHtmlCard(
		1,
		currQuestionText,
		randomisePool(),
		correctA
	);
	const player1Html = select(".player1");
	console.log(player1Html);
	console.log(card1Html);

	player1Html.appendChild(card1Html);

	console.log(player1Html);

	const card2Html = createHtmlCard(
		2,
		currQuestionText,
		randomisePool(),
		correctA
	);

	const player2Html = select(".player2");
	player2Html.appendChild(card2Html);
};

//! Select item toggle
const selectItem = (e) => {
	console.log("clicked");
	const answerEls = e.target.parentElement.children;
	console.log(e);
	console.log(e.target.parentElement);
	console.log(e.target.parentElement.children);
	Array.from(answerEls).forEach((answerEl) => {
		if (answerEl.classList.contains("trivia__answer--selected")) {
			answerEl.classList.remove("trivia__answer--selected");
		}
	});
	e.target.classList.add("trivia__answer--selected");
};

//! Create HTML card
const createHtmlCard = (
	playerNumber,
	currQuestionText,
	randomPool,
	correctA
) => {
	//! Container
	const triviaContainerEl = create("div", ".trivia__container");
	triviaContainerEl.classList.add();

	const playerLabel = create("h4", "trivia__player", triviaContainerEl);
	playerLabel.innerText = "Player " + playerNumber;

	const scoreLabel = create("h4", "trivia__score", triviaContainerEl);
	scoreLabel.innerText = "Score: " + state[`score${playerNumber}`];

	//! Question
	const triviaQuestionEl = create("h3", "trivia__question", triviaContainerEl);
	triviaQuestionEl.innerText = currQuestionText;

	//! 4 answers
	const answersWrapper = create("div", "trivia__answers-wrapper");
	randomPool.forEach((answer, i) => {
		const answerEl = create("p", ".trivia__answer");
		answerEl.innerText = answer;
		answer == correctA
			? (answerEl.dataset.status = "correct")
			: (answerEl.dataset.status = "incorrect");
		answerEl.dataset.id = answer;
		answerEl.addEventListener("click", (e) => selectItem(e));

		answersWrapper.appendChild(answerEl);
	});

	triviaContainerEl.appendChild(answersWrapper);
	//! Button

	const triviaSubmitBtn = create(
		"button",
		"trivia__submit",
		triviaContainerEl
	);

	triviaSubmitBtn.innerText = "Submit Answer";

	triviaSubmitBtn.addEventListener("click", (e) => {
		state.submitted += 1;
		if (checkAnswer(e)) {
			console.log(state.submitted, "submitted state");

			triviaSubmitBtn.innerText = "Correct";
			triviaSubmitBtn.style.backgroundColor = "green";
			if (e.target.parentElement.classList.contains("player1")) {
				state.score1 += 1;
				const scoreLabel = e.target.parentElement.children[1];
				scoreLabel.innerText = "Score: " + state[`score${1}`];
			} else {
				state.score2 += 1;
				const scoreLabel = e.target.parentElement.children[1];
				scoreLabel.innerText = "Score: " + state[`score${2}`];
			}

			console.log("currect");
		} else {
			triviaSubmitBtn.innerText = "InCorrect";
			triviaSubmitBtn.style.backgroundColor = "red";
			console.log("InCorrect");
		}
		console.log("Player 1 score", state.score1);
		console.log(state.submitted);
		console.log("Player 1 score", state.score1);
		console.log(state.submitted);

		if (state.submitted == 2) {
			console.log("round over");
			const infoBtn = select(".info__button");
			infoBtn.addEventListener("click", () => {
				state.submitted = 0;
				Array.from(select(".player1").children).forEach((child) =>
					child.remove()
				);
				Array.from(select(".player2").children).forEach((child) =>
					child.remove()
				);
				state.currentGame += 1;
				console.log(state.currentGame);
				console.log(state.maxGames);
				state.currentGame == state.maxGames ? gameOver() : round();

				// state.currentGame == state.maxGames ? gameOver() : round();
			});
		}
	});
	triviaContainerEl.appendChild(triviaSubmitBtn);
	//! return complete html card
	return triviaContainerEl;
};

const checkAnswer = (e) => {
	console.log("submitted");
	console.log(e.target.previousElementSibling);
	const answersParent = e.target.previousElementSibling.children;

	let status = false;

	Array.from(answersParent).forEach((answer) => {
		answer.classList.add("trivia__answer--incorrect");
		if (
			answer.dataset.status == "correct" &&
			answer.classList.contains("trivia__answer--selected")
		) {
			answer.classList.remove("trivia__answer--incorrect");
			answer.classList.add("trivia__answer--correct");
			status = true;
		}
	});

	//! Reset cards
	return status;
};

const gameOver = () => {
	// location.reload();
	select(".info__container").classList.add("info__container--show");

	// const winningMsg = () => {
	// 	if (state.score1 == state.score2) {
	// 		return "It was a tie";
	// 	} else if (state.score1 < state.score2) {
	// 		return "Player 2 won";
	// 	} else {
	// 		return "Player 1 won";
	// 	}
	// };

	// select(".info__message").innerText = winningMsg();
	const infoBtn = select(".info__button");
	infoBtn.innerText = "Start New Game";

	infoBtn.addEventListener("click", () => {
		const startMenuEl = select(".start");
		startMenuEl.style.visibility = "visible";

		select(".info__container").classList.remove("info__container--show");
	});

	state = {
		maxGames: 0,
		questions: [],
		currentGame: 0,
		score1: 0,
		score2: 0,
		submitted: 0,
	};
};

const game = () => {
  let { limit, currentGame, gameQuestions } = state;
  console.log(limit, currentGame);

  if (limit >= currentGame) {

    displayQuestion(gameQuestions[currentGame])
    state.currentGame += 1;
  } else {
    // gameOver();
  }

  console.log(currentGame);

}

const gameOver = () => {
  console.log('game - over')
}

const displayQuestion = (currQuestion) => {
  const answerPool = []
  const correctA = currQuestion.correctAnswer;
  const incorrectAs = currQuestion.incorrectAnswers;
  answerPool.push(correctA);
  answerPool.push(...incorrectAs);
  console.log(answerPool);
  answerPool.sort(() => (Math.random() > .5) ? 1 : -1);
  console.log(answerPool);

  const triviaContainerEl = create('div','.trivia__container')

  const triviaQuestionEl = create('h3', 'trivia__question', triviaContainerEl);
  triviaQuestionEl.innerText = currQuestion.question;

  const answersWrapper = create('div', '.trivia__answers-wrapper', triviaQuestionEl);

  answerPool.forEach((answer, i) => {
    const answerEl = create('p', '.trivia__answer');
    answerEl.innerText = answer;
    answer == correctA ? answerEl.dataset.status = 'correct' : answerEl.dataset.status = 'incorrect';
    answerEl.dataset.id = answer;
    answerEl.addEventListener('click', (e) => {
      const answersParent = e.target.parentElement.children;
      console.log(answersParent);
      Array.from(answersParent).forEach(answer => {
        if (answer.classList.contains('trivia__answer--selected')) {
          answer.classList.remove('trivia__answer--selected')
        }
      })
      e.target.classList.add('trivia__answer--selected')
    })
    answersWrapper.appendChild(answerEl);
  })

  triviaContainerEl.appendChild(answersWrapper)
  const triviaEl = select('.trivia')
  triviaEl.appendChild(triviaContainerEl);

  const triviaSubmitBtn = create('button', 'trivia__submit', triviaContainerEl);
  triviaSubmitBtn.innerText = 'Submit Answer'

}
