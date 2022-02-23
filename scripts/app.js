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
