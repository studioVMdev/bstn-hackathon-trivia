import Game from "./Game.mjs";
import Round from "./Round.mjs";
import Card from "./Card.mjs";
import UI from "./UI.mjs";
import MyDOM from "./MyDOM.mjs";
//^===================================
class MyDOM {
	//! 1. Create Element (element, classnames, parent, atrivbutes)
	static create = (element, classNames, parentEl, attributesObj) => {
		let htmlElement = document.createElement(element);

		typeof classNames == "string"
			? htmlElement.classList.add(classNames)
			: classNames.map((className) => {
					htmlElement.classList.add(className);
			  });

		parentEl && parentEl.appendChild(htmlElement);

		if (attributesObj) {
			for (const [attr, val] of Object.entries(attributesObj)) {
				const htmlAttribute = document.createAttribute(attr);
				htmlAttribute.value = val;
				htmlElement.setAttributeNode(htmlAttribute);
			}
		}
		return htmlElement;
	};

	//! 2. Select Elements
	static select = (element, all = false) => {
		if (all) {
			return [...document.querySelectorAll(element)];
		} else {
			return document.querySelector(element);
		}
	};
}

//^===================================
class Game {
	constructor(questions) {
		this.questions = null;
		this.totalRounds = 0;
		this.currentRoundIndex = 0;
		this.score1 = 0;
		this.score2 = 0;
		this.submittedAnswers = 0;
	}

	getQuestions = (URL) => {
		return axios.get(URL).then((response) => {
			this.questions = response.data;
			this.totalRounds = response.data.length;
			this.newRound(response.data);
		});
	};

	getState = () => {
		return {
			questions: this.questions,
			totalRounds: this.totalRounds,
			currentRoundIndex: this.currentRoundIndex,
			score1: this.score1,
			score2: this.score2,
			submittedAnswers: this.submittedAnswers,
		};
	};

	newRound = () => {
		UI.clearCards();
		UI.hideInfoBtn();
		console.log(
			this.totalRounds + " total rounds",
			this.currentRoundIndex + " current round"
		);
		game.submittedAnswers = 0;

		if (this.totalRounds > this.currentRoundIndex) {
			UI.showBoard();
			console.log(this.getState(), "state before new round");
			new Round(this.getState()).createCards();
		}
	};

	increment = (property) => {
		this[property]++;
	};

	getWinner = () => {
		if (this.score1 > this.score2) {
			return "Player 1 won!";
		} else if (this.score1 < this.score2) {
			return "Player 2 won!";
		} else {
			return "It was a draw!";
		}
	};
}

//^===================================
class Round {
	constructor(props) {
		this.props = props;
	}

	createCards = () => {
		console.log("current round index is " + game.currentRoundIndex);
		new Card(
			this.props,
			this.props.questions[this.props.currentRoundIndex],
			1
		).render();
		new Card(
			this.props,
			this.props.questions[this.props.currentRoundIndex],
			2
		).render();
	};
}
//^===================================

class Card {
	constructor(state, questionObj, playerId) {
		this.state = state;
		this.currQObj = questionObj;
		this.playerId = playerId;
		console.log(this.currQObj);
		this.currQuestionText = this.currQObj.question;
		this.correctA = this.currQObj.correctAnswer;
		this.incorrectAs = this.currQObj.incorrectAnswers.slice(0, 3);
		this.answers = [];
	}
	//!===================================
	render = () => {
		const cardHtml = this.createHtmlCard();
		const cardEl = MyDOM.select(`.card-${this.playerId}`);
		cardEl.appendChild(cardHtml);
	};
	//!===================================
	createHtmlCard = () => {
		//* Randomize answers
		this.answers.push(this.correctA);
		this.answers.push(...this.incorrectAs);
		this.answers.sort(() => (Math.random() > 0.5 ? 1 : -1));

		//* Container
		const triviaContainerEl = MyDOM.create("div", ".trivia__container");

		const statsWrapper = MyDOM.create(
			"div",
			"stats__wrapper",
			triviaContainerEl
		);

		const playerLabel = MyDOM.create(
			"h4",
			["trivia__player", "player__info"],
			statsWrapper
		);
		playerLabel.innerText = "Player " + this.playerId;

		const scoreLabel = MyDOM.create(
			"h4",
			["trivia__score", "player__info"],
			statsWrapper
		);
		scoreLabel.innerText = `Score: ${
			this.playerId === 1 ? game.score1 : game.score2
		}`;

		//* Question
		const triviaQuestionEl = MyDOM.create(
			"h3",
			"trivia__question",
			triviaContainerEl
		);
		triviaQuestionEl.innerText = this.currQuestionText;

		//* 4 answers
		const answersWrapper = MyDOM.create("div", "trivia__answers-wrapper");
		this.answers.map((answer) => {
			const answerEl = MyDOM.create("p", ".trivia__answer");
			answerEl.innerText = answer;
			answer == this.correctA
				? (answerEl.dataset.status = "correct")
				: (answerEl.dataset.status = "incorrect");
			answerEl.dataset.id = answer;
			answerEl.addEventListener("click", (e) => this.handleSelect(e));
			answersWrapper.appendChild(answerEl);
		});
		triviaContainerEl.appendChild(answersWrapper);

		//* Button
		const triviaSubmitBtn = MyDOM.create(
			"button",
			["trivia__submit", "btn"],
			triviaContainerEl
		);
		triviaSubmitBtn.innerText = "Submit Answer";
		triviaSubmitBtn.addEventListener("click", this.handleSubmit);

		return triviaContainerEl;
	};
	//!===================================
	handleSelect = (e) => {
		console.log("selected", this.playerId);
		const answerEls = e.target.parentElement.children;
		console.log(answerEls);
		Array.from(answerEls).map((answerEl) => {
			if (answerEl.classList.contains("trivia__answer--selected")) {
				answerEl.classList.remove("trivia__answer--selected");
			}
		});
		e.target.classList.add("trivia__answer--selected");
	};

	//!===================================
	handleSubmit = (e) => {
		//* if current player submitted their answer, remove Ev Listener

		console.log(game.getState());
		if (!this.answerIsSelected(e)) {
			console.log("nothing is selected");
			return;
		}
		e.target.removeEventListener("click", this.handleSubmit);
		game.increment("submittedAnswers");

		const triviaSubmitBtn = e.target;
		if (this.isCorrect(e)) {
			triviaSubmitBtn.innerText = "Correct";
			triviaSubmitBtn.style.backgroundColor = "lightseagreen";
			if (
				e.target.parentElement.parentElement.classList.contains("card-1")
			) {
				game.increment("score1");
				const scoreLabel = e.target.parentElement.children[0].children[1];
				scoreLabel.innerText = "Score: " + game[`score${1}`];
			} else {
				game.increment("score2");
				const scoreLabel = e.target.parentElement.children[0].children[1];
				scoreLabel.innerText = "Score: " + game[`score${2}`];
			}
			console.log("correct");
		} else {
			triviaSubmitBtn.innerText = "InCorrect";
			triviaSubmitBtn.style.backgroundColor = "lightcoral";
		}

		//* check if both players have submitted their answer
		if (game.submittedAnswers === 2) {
			console.log("both players submitted answers");
			// if (game.totalRounds === game.currentRoundIndex) {
			//   console.log("gameOver");
			//   UI.gameOver();
			// }
			game.increment("currentRoundIndex");
			UI.showInfoBtn();
		}
	};
	//!===================================
	answerIsSelected = (e) => {
		console.log("checking if an answer is selected");
		//* check if any answers are selected.
		const answerEls = e.target.previousElementSibling.children;
		let somethingSelected = false;
		Array.from(answerEls).map((answerEl) => {
			if (answerEl.classList.contains("trivia__answer--selected")) {
				somethingSelected = true;
			}
		});
		return somethingSelected;
	};
	//!===================================
	isCorrect = (e) => {
		console.log("checking if correct");
		console.log(e.target.previousElementSibling);
		const answersParent = e.target.previousElementSibling.children;

		let status = false;
		Array.from(answersParent).map((answer) => {
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
		console.log(status);
		return status;
	};
}

//^===================================
class UI {
	static clearCards = () => {
		const card1 = MyDOM.select(".card-1");
		console.log("container selected");
		card1.textContent = "";
		const card2 = MyDOM.select(".card-2");
		console.log("container selected");
		card2.textContent = "";
		// const infoContainer = MyDOM.select(".info__container");
		// infoContainer.style.display = "none";
		// infoContainer.classList.remove("info__container--show");
	};

	static handleStart = () => {
		game = new Game();
		//Category
		const categoryVal = MyDOM.select(".select__wrapper").value;
		//Number of rounds
		const rounds = MyDOM.select(".input__limit").value;
		//URL
		const URL = `https://api.trivia.willfry.co.uk/questions?categories=${categoryVal}&limit=${rounds}`;
		UI.hideStartMenu();
		game.getQuestions(URL);
	};

	static playAgain = () => {
		UI.hideBoard();
		UI.hideInfoBtn();
		UI.showStartMenu();

		const selectedOption = MyDOM.select(".selected-option");
		selectedOption.setAttribute("selected", "selected");
		const minNumber = MyDOM.select(".input__limit");
		minNumber.value = "1";
		// UI.resetStartValues();
	};

	static hideStartMenu = () => {
		const startMenuEl = MyDOM.select(".start");
		startMenuEl.style.visibility = "hidden";
	};

	static showStartMenu = () => {
		const startMenuEl = MyDOM.select(".start");
		startMenuEl.style.visibility = "visible";
	};

	static showInfoBtn = () => {
		const infoBtn = MyDOM.select(".info__button");
		infoBtn.style.visibility = "visible";
		const infoContainer = MyDOM.select(".info__container");

		if (game.totalRounds === game.currentRoundIndex) {
			const infoMessage = MyDOM.select(".info__message");
			infoMessage.innerText = game.getWinner();
			infoMessage.innerText = "test";
			infoContainer.classList.add("card-style");
			infoBtn.innerText = "Play Again";
			infoBtn.addEventListener("click", UI.playAgain);
		} else {
			infoContainer.classList.remove("card-style");
			infoBtn.innerText = "Next Question";
			infoBtn.addEventListener("click", game.newRound);
		}
	};
	static hideInfoBtn = () => {
		const infoBtn = MyDOM.select(".info__button");
		infoBtn.style.visibility = "hidden";
	};

	static showBoard = () => {
		const triviaBoardEl = MyDOM.select(".trivia__board");
		triviaBoardEl.style.visibility = "visible";
	};

	static hideBoard = () => {
		const triviaBoardEl = MyDOM.select(".trivia__board");
		triviaBoardEl.style.visibility = "hidden";
	};

	static resetStartValues = () => {};
}

//*===================================
const startBtn = MyDOM.select(".start__button");
startBtn.addEventListener("click", () => UI.handleStart());

let game = null;
// console.log(game);

// let state = {
// 	maxGames: 0,
// 	questions: [],
// 	currentGame: 0,
// 	score1: 0,
// 	score2: 0,
// 	submitted: 0,
// };

// const startBtn = select(".start__button");

// startBtn.addEventListener("click", (e) => {
// 	const categoryVal = select(".select__wrapper").value;
// 	const limitVal = select(".input__limit").value;
// 	//Number of games
// 	state.maxGames = Number(limitVal);

// 	const URL = `https://api.trivia.willfry.co.uk/questions?categories=${categoryVal}&limit=${limitVal}`;

// 	const startMenuEl = select(".start");
// 	startMenuEl.style.visibility = "hidden";

// 	axios.get(URL).then((response) => {
// 		state.questions = response.data;
// 		console.log(state.questions);
// 		round();
// 	});
// });

// //! Round
// //! Round
// //! Round
// const round = () => {
// 	const infoContainer = select(".info__container");
// 	infoContainer.classList.add("info__container--show");
// 	const infoBtn = select(".info__button");
// 	infoBtn.innerText = "Next Question";
// 	// Format DATA
// 	// console.log(state.currentGame)
// 	const currentQuestionObj = state.questions[state.currentGame];
// 	// console.log(currentQuestionObj)
// 	const answerPool = [];
// 	const currQuestionText = currentQuestionObj.question;
// 	const correctA = currentQuestionObj.correctAnswer;
// 	const incorrectAs = currentQuestionObj.incorrectAnswers;
// 	answerPool.push(correctA);
// 	answerPool.push(...incorrectAs);
// 	// console.log(answerPool);
// 	const randomisePool = () => {
// 		return answerPool.sort(() => (Math.random() > 0.5 ? 1 : -1));
// 	};

// 	//Dispatch data
// 	const card1Html = createHtmlCard(
// 		1,
// 		currQuestionText,
// 		randomisePool(),
// 		correctA
// 	);
// 	const player1Html = select(".player1");
// 	console.log(player1Html);
// 	console.log(card1Html);

// 	player1Html.appendChild(card1Html);

// 	console.log(player1Html);

// 	const card2Html = createHtmlCard(
// 		2,
// 		currQuestionText,
// 		randomisePool(),
// 		correctA
// 	);

// 	const player2Html = select(".player2");
// 	player2Html.appendChild(card2Html);
// };

// //! Select item toggle
// const selectItem = (e) => {
// 	console.log("clicked");
// 	const answerEls = e.target.parentElement.children;
// 	console.log(e);
// 	console.log(e.target.parentElement);
// 	console.log(e.target.parentElement.children);
// 	Array.from(answerEls).forEach((answerEl) => {
// 		if (answerEl.classList.contains("trivia__answer--selected")) {
// 			answerEl.classList.remove("trivia__answer--selected");
// 		}
// 	});
// 	e.target.classList.add("trivia__answer--selected");
// };

// //! Create HTML card
// const createHtmlCard = (
// 	playerNumber,
// 	currQuestionText,
// 	randomPool,
// 	correctA
// ) => {
// 	//! Container
// 	const triviaContainerEl = create("div", ".trivia__container");
// 	triviaContainerEl.classList.add();

// 	const playerLabel = create("h4", "trivia__player", triviaContainerEl);
// 	playerLabel.innerText = "Player " + playerNumber;

// 	const scoreLabel = create("h4", "trivia__score", triviaContainerEl);
// 	scoreLabel.innerText = "Score: " + state[`score${playerNumber}`];

// 	//! Question
// 	const triviaQuestionEl = create("h3", "trivia__question", triviaContainerEl);
// 	triviaQuestionEl.innerText = currQuestionText;

// 	//! 4 answers
// 	const answersWrapper = create("div", "trivia__answers-wrapper");
// 	randomPool.forEach((answer, i) => {
// 		const answerEl = create("p", ".trivia__answer");
// 		answerEl.innerText = answer;
// 		answer == correctA
// 			? (answerEl.dataset.status = "correct")
// 			: (answerEl.dataset.status = "incorrect");
// 		answerEl.dataset.id = answer;
// 		answerEl.addEventListener("click", (e) => selectItem(e));

// 		answersWrapper.appendChild(answerEl);
// 	});

// 	triviaContainerEl.appendChild(answersWrapper);
// 	//! Button

// 	const triviaSubmitBtn = create(
// 		"button",
// 		"trivia__submit",
// 		triviaContainerEl
// 	);

// 	triviaSubmitBtn.innerText = "Submit Answer";

// 	triviaSubmitBtn.addEventListener("click", (e) => {
// 		state.submitted += 1;
// 		if (checkAnswer(e)) {
// 			console.log(state.submitted, "submitted state");

// 			triviaSubmitBtn.innerText = "Correct";
// 			triviaSubmitBtn.style.backgroundColor = "green";
// 			if (e.target.parentElement.classList.contains("player1")) {
// 				state.score1 += 1;
// 				const scoreLabel = e.target.parentElement.children[1];
// 				scoreLabel.innerText = "Score: " + state[`score${1}`];
// 			} else {
// 				state.score2 += 1;
// 				const scoreLabel = e.target.parentElement.children[1];
// 				scoreLabel.innerText = "Score: " + state[`score${2}`];
// 			}

// 			console.log("currect");
// 		} else {
// 			triviaSubmitBtn.innerText = "InCorrect";
// 			triviaSubmitBtn.style.backgroundColor = "red";
// 			console.log("InCorrect");
// 		}
// 		console.log("Player 1 score", state.score1);
// 		console.log(state.submitted);
// 		console.log("Player 1 score", state.score1);
// 		console.log(state.submitted);

// 		if (state.submitted == 2) {
// 			console.log("round over");
// 			const infoBtn = select(".info__button");
// 			infoBtn.addEventListener("click", () => {
// 				state.submitted = 0;
// 				Array.from(select(".player1").children).forEach((child) =>
// 					child.remove()
// 				);
// 				Array.from(select(".player2").children).forEach((child) =>
// 					child.remove()
// 				);
// 				state.currentGame += 1;
// 				console.log(state.currentGame);
// 				console.log(state.maxGames);
// 				state.currentGame == state.maxGames ? gameOver() : round();

// 				// state.currentGame == state.maxGames ? gameOver() : round();
// 			});
// 		}
// 	});
// 	triviaContainerEl.appendChild(triviaSubmitBtn);
// 	//! return complete html card
// 	return triviaContainerEl;
// };

// const checkAnswer = (e) => {
// 	console.log("submitted");
// 	console.log(e.target.previousElementSibling);
// 	const answersParent = e.target.previousElementSibling.children;

// 	let status = false;

// 	Array.from(answersParent).forEach((answer) => {
// 		answer.classList.add("trivia__answer--incorrect");
// 		if (
// 			answer.dataset.status == "correct" &&
// 			answer.classList.contains("trivia__answer--selected")
// 		) {
// 			answer.classList.remove("trivia__answer--incorrect");
// 			answer.classList.add("trivia__answer--correct");
// 			status = true;
// 		}
// 	});

// 	//! Reset cards
// 	return status;
// };

// const gameOver = () => {
// 	// location.reload();
// 	select(".info__container").classList.add("info__container--show");

// 	// const winningMsg = () => {
// 	// 	if (state.score1 == state.score2) {
// 	// 		return "It was a tie";
// 	// 	} else if (state.score1 < state.score2) {
// 	// 		return "Player 2 won";
// 	// 	} else {
// 	// 		return "Player 1 won";
// 	// 	}
// 	// };

// 	// select(".info__message").innerText = winningMsg();
// 	const infoBtn = select(".info__button");
// 	infoBtn.innerText = "Start New Game";

// 	infoBtn.addEventListener("click", () => {
// 		const startMenuEl = select(".start");
// 		startMenuEl.style.visibility = "visible";

// 		select(".info__container").classList.remove("info__container--show");
// 	});

// 	state = {
// 		maxGames: 0,
// 		questions: [],
// 		currentGame: 0,
// 		score1: 0,
// 		score2: 0,
// 		submitted: 0,
// 	};
// };

// const game = () => {
//   let { limit, currentGame, gameQuestions } = state;
//   console.log(limit, currentGame);

//   if (limit >= currentGame) {

//     displayQuestion(gameQuestions[currentGame])
//     state.currentGame += 1;
//   } else {
//     // gameOver();
//   }

//   console.log(currentGame);

// }

// const gameOver = () => {
//   console.log('game - over')
// }

// const displayQuestion = (currQuestion) => {
//   const answerPool = []
//   const correctA = currQuestion.correctAnswer;
//   const incorrectAs = currQuestion.incorrectAnswers;
//   answerPool.push(correctA);
//   answerPool.push(...incorrectAs);
//   console.log(answerPool);
//   answerPool.sort(() => (Math.random() > .5) ? 1 : -1);
//   console.log(answerPool);

//   const triviaContainerEl = create('div','.trivia__container')

//   const triviaQuestionEl = create('h3', 'trivia__question', triviaContainerEl);
//   triviaQuestionEl.innerText = currQuestion.question;

//   const answersWrapper = create('div', '.trivia__answers-wrapper', triviaQuestionEl);

//   answerPool.forEach((answer, i) => {
//     const answerEl = create('p', '.trivia__answer');
//     answerEl.innerText = answer;
//     answer == correctA ? answerEl.dataset.status = 'correct' : answerEl.dataset.status = 'incorrect';
//     answerEl.dataset.id = answer;
//     answerEl.addEventListener('click', (e) => {
//       const answersParent = e.target.parentElement.children;
//       console.log(answersParent);
//       Array.from(answersParent).forEach(answer => {
//         if (answer.classList.contains('trivia__answer--selected')) {
//           answer.classList.remove('trivia__answer--selected')
//         }
//       })
//       e.target.classList.add('trivia__answer--selected')
//     })
//     answersWrapper.appendChild(answerEl);
//   })

//   triviaContainerEl.appendChild(answersWrapper)
//   const triviaEl = select('.trivia')
//   triviaEl.appendChild(triviaContainerEl);

//   const triviaSubmitBtn = create('button', 'trivia__submit', triviaContainerEl);
//   triviaSubmitBtn.innerText = 'Submit Answer'

// }
