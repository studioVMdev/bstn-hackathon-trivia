// import Game from "./Game.mjs";
// import Round from "./Round.mjs";
// import Card from "./Card.mjs";
// import UI from "./UI.mjs";
// import MyDOM from "./MyDOM.mjs";
//^===================================
class MyDOM {
	//! 1. Create Element (element, classnames, parent, atrivbutes)
	static create = (element, classNames, parentEl, attributesObj) => {
		let htmlElement = document.createElement(element);

		typeof classNames == "string"
			? htmlElement.classList.add(classNames)
			: classNames.map((classs) => {
					htmlElement.classList.add(classs);
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
	constructor() {
		this.state = {
			questions: null,
			totalRounds: 0,
			currentRoundIndex: 0,
			score1: 0,
			score2: 0,
			submittedAnswers: 0,
		};
	}
	incrementProperty = (property) => {
		this.state[property]++;
	};
	getState = () => {
		return this.state;
	};

	setState = (newState) => {
		this.state = { ...this.state, ...newState };
	};

	getQuestions = (URL) => {
		return axios.get(URL).then((response) => {
			this.setState({ questions: response.data });
			this.setState({ totalRounds: response.data.length });
			this.newRound(game.getState());
			console.log(
				`🚀 ~ file: app.js ~ line 76 ~ Game ~ returnaxios.get ~ game.getState()`,
				game.getState()
			);
		});
	};

	newRound = () => {
		this.setState({ submittedAnswers: 0 });
		UI.clearCards();
		UI.hideInfoBtn();
		const infoBtn = MyDOM.select(".info__button");
		infoBtn.removeEventListener("click", game.newRound);
		infoBtn.removeEventListener("click", UI.playAgain);
		console.log("cards cleared");
		const state = this.state;
		console.log(
			" totalRounds: " + state.totalRounds,
			" currentRoundIndex: " + state.currentRoundIndex
		);
		//todo
		if (state.totalRounds > state.currentRoundIndex) {
			UI.showBoard();
			console.log("state before new round: ", this.getState());
			new Round(state.questions[state.currentRoundIndex]).createCards();
		} else {
			return;
		}
	};

	getWinner = () => {
		if (this.state.score1 > this.state.score2) {
			return "Player 1 won!";
		} else if (this.state.score1 < this.state.score2) {
			return "Player 2 won!";
		} else {
			return "It was a draw!";
		}
	};
}

//^===================================
class Round {
	constructor(currentQuestion) {
		this.currentQuestion = currentQuestion;
	}

	createCards = () => {
		const currentQuestion = this.currentQuestion;
		//Player 1 card
		new Card(currentQuestion, 1).render();
		//Player 2 card
		new Card(currentQuestion, 2).render();
	};
}
//^===================================

class Card {
	constructor(currentQuestion, playerId) {
		this.currentQuestion = currentQuestion;
		this.playerId = playerId;
		this.currQuestionText = this.currentQuestion.question;
		this.correctA = this.currentQuestion.correctAnswer;
		this.incorrectAs = this.currentQuestion.incorrectAnswers.slice(0, 3);
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
		//* Randomize answers order for each card
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
			this.playerId === 1 ? game.state.score1 : game.state.score2
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
		console.log("Player", this.playerId, " has selected their answer");
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
		console.log("Player ", this.playerId, " submitted their answer");
		console.log(game.getState());
		if (!this.answerIsSelected(e)) {
			console.log("nothing is selected");
			return;
		}
		e.target.removeEventListener("click", this.handleSubmit);
		game.incrementProperty("submittedAnswers");
		const triviaSubmitBtn = e.target;
		if (this.isCorrect(e)) {
			triviaSubmitBtn.innerText = "Correct";
			triviaSubmitBtn.style.backgroundColor = "lightseagreen";
			if (
				e.target.parentElement.parentElement.classList.contains("card-1")
			) {
				game.incrementProperty("score1");
				const scoreLabel = e.target.parentElement.children[0].children[1];
				scoreLabel.innerText = "Score: " + game.state[`score${1}`];
			} else {
				game.incrementProperty("score2");
				const scoreLabel = e.target.parentElement.children[0].children[1];
				scoreLabel.innerText = "Score: " + game.state[`score${2}`];
			}
			console.log("correct");
		} else {
			triviaSubmitBtn.innerText = "InCorrect";
			triviaSubmitBtn.style.backgroundColor = "lightcoral";
		}

		//* check if both players have submitted their answer

		if (game.state.submittedAnswers === 2) {
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
		console.log("selected answer is correct: ", status);
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
	};

	static handleStart = () => {
		console.log(game);
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
		console.log("play again button clicked");
		UI.hideBoard();
		UI.hideInfoBtn();
		UI.showStartMenu();
		const infoContainer = MyDOM.select(".info__container");
		const infoMessage = MyDOM.select(".info__message");
		const infoBtn = MyDOM.select(".info__button");
		infoMessage.style.visibility = "hidden";
		infoContainer.style.visibility = "hidden";
		infoMessage.innerText = "";
	};

	static hideStartMenu = () => {
		const startMenuEl = MyDOM.select(".start");
		startMenuEl.style.visibility = "hidden";
		const selectedOption = MyDOM.select(".selected-option");
		selectedOption.setAttribute("selected", "selected");
		const minNumber = MyDOM.select(".input__limit");
		minNumber.value = "1";
	};

	static showStartMenu = () => {
		const startMenuEl = MyDOM.select(".start");
		startMenuEl.style.visibility = "visible";
	};

	static showInfoBtn = () => {
		const infoContainer = MyDOM.select(".info__container");
		const infoBtn = MyDOM.select(".info__button");
		infoBtn.style.visibility = "visible";
		//todo:

		if (game.state.totalRounds > game.state.currentRoundIndex + 1) {
			console.log("showing next question button");
			console.log(game.getState());
			infoBtn.innerText = "Next Question";
			game.incrementProperty("currentRoundIndex");
			infoBtn.addEventListener("click", game.newRound);
		} else {
			infoContainer.classList.remove("card-style");
			console.log("game over, showing play again button");
			const infoMessage = MyDOM.select(".info__message");
			infoMessage.style.visibility = "visible";
			infoContainer.style.visibility = "visible";
			infoMessage.innerText = game.getWinner();
			infoContainer.classList.add("card-style");
			infoBtn.innerText = "Play Again";
			infoBtn.addEventListener("click", UI.playAgain);
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
}

//*===================================
const startBtn = MyDOM.select(".start__button");
startBtn.addEventListener("click", () => UI.handleStart());

let game = null;
// console.log(game);
