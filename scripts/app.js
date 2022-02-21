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
			: classNames.forEach((classs) => {
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
	static select(element, all = false) {
		if (all) {
			return [...document.querySelectorAll(element)];
		} else {
			return document.querySelector(element);
		}
	}
}

//^===================================
class Game {
	constructor(questions) {
		this.questions = null;
		this.totalRounds = 0;
		this.currentRound = 0;
		this.score1 = 0;
		this.score2 = 0;
		this.submittedAnswers = 0;
	}

	getQuestions(URL) {
		return axios.get(URL).then((response) => {
			this.questions = response.data;
			this.totalRounds = response.data.length;

			this.newRound(response.data);
		});
	}

	getState() {
		return {
			questions: this.questions,
			totalRounds: this.totalRounds,
			currentRound: this.currentRound,
			score1: this.score1,
			score2: this.score2,
			submittedAnswers: this.submittedAnswers,
		};
	}

	//! on next, create new round

	newRound() {
		if (this.totalRounds >= this.currentRound) {
			new Round(this.getState()).makeCards();
			this.currentRound++;
		} else {
			console.log("gameover");
		}
	}

	increment(property) {
		this[property]++;
		console.log(this[property]);
	}
}

const startBtn = MyDOM.select(".start__button");
startBtn.addEventListener("click", () => handleStart());

let game = new Game();
// console.log(game);

const handleStart = () => {
	//Category
	const categoryVal = MyDOM.select(".select__wrapper").value;
	//Number of rounds
	const rounds = MyDOM.select(".input__limit").value;
	//URL
	const URL = `https://api.trivia.willfry.co.uk/questions?categories=${categoryVal}&limit=${rounds}`;

	const startMenuEl = MyDOM.select(".start");
	startMenuEl.style.visibility = "hidden";

	game.getQuestions(URL);
};

//^===================================
class Round {
	constructor(props) {
		this.props = props;
		console.log(this.props);
	}

	makeCards() {
		new Card(
			this.props,
			this.props.questions[this.props.currentRound],
			1
		).render();
		new Card(
			this.props,
			this.props.questions[this.props.currentRound],
			2
		).render();
	}
}
//^===================================
class Card {
	constructor(state, questionObj, playerId) {
		this.state = state;
		this.currQObj = questionObj;
		this.playerId = playerId;
		console.log(this.currQObj);
		this.answers = [];
		this.currQuestionText = this.currQObj.question;
		this.correctA = this.currQObj.correctAnswer;
		this.incorrectAs = this.currQObj.incorrectAnswers;
	}
	//!===================================
	render() {
		const randomizeAnswers = () => {
			return this.answers.sort(() => (Math.random() > 0.5 ? 1 : -1));
		};
		this.answers.push(this.correctA);
		this.answers.push(...this.incorrectAs);

		const cardHtml = this.createHtmlCard();
		const cardEl = MyDOM.select(`.card-${this.playerId}`);
		// console.log(cardEl);
		cardEl.appendChild(cardHtml);
	}
	//!===================================
	createHtmlCard() {
		//! Container
		const triviaContainerEl = MyDOM.create("div", ".trivia__container");
		const playerLabel = MyDOM.create(
			"h4",
			"trivia__player",
			triviaContainerEl
		);
		playerLabel.innerText = "Player " + this.playerId;

		const scoreLabel = MyDOM.create("h4", "trivia__score", triviaContainerEl);
		console.log("🚀 ~ file: Card.mjs ~ line 42 ~ scoreLabel", scoreLabel);
		scoreLabel.innerText = `Score: ${
			this.playerId === 1 ? this.state.score1 : this.state.score2
		}`;

		//! Question
		const triviaQuestionEl = MyDOM.create(
			"h3",
			"trivia__question",
			triviaContainerEl
		);
		triviaQuestionEl.innerText = this.currQuestionText;

		//! 4 answers
		const answersWrapper = MyDOM.create("div", "trivia__answers-wrapper");
		this.answers.forEach((answer, i) => {
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

		const triviaSubmitBtn = MyDOM.create(
			"button",
			"trivia__submit",
			triviaContainerEl
		);

		//! Button
		triviaSubmitBtn.innerText = "Submit Answer";
		triviaSubmitBtn.addEventListener("click", this.handleSubmit);

		return triviaContainerEl;
	}
	//!===================================
	handleSelect(e) {
		console.log("selected", this.playerId);
		const answerEls = e.target.parentElement.children;
		Array.from(answerEls).forEach((answerEl) => {
			if (answerEl.classList.contains("trivia__answer--selected")) {
				answerEl.classList.remove("trivia__answer--selected");
			}
		});
		e.target.classList.add("trivia__answer--selected");
	}

	//!===================================
	handleSubmit(e) {
		console.log("handling comment submit");
		// console.log(game.submittedAnswers);
		game.increment("submittedAnswers");
		console.log(game.submittedAnswers);
		//
		const triviaSubmitBtn = MyDOM.select(".trivia__submit");
		if (this.isCorrect(e)) {
			triviaSubmitBtn.innerText = "Correct";
			triviaSubmitBtn.style.backgroundColor = "green";
			if (e.target.parentElement.classList.contains("player1")) {
				// state.score1 += 1;
				game.increment("score1");
				const scoreLabel = e.target.parentElement.children[1];
				scoreLabel.innerText = "Score: " + game[`score${1}`];
			} else {
				game.increment("score2");
				const scoreLabel = e.target.parentElement.children[1];
				scoreLabel.innerText = "Score: " + game[`score${2}`];
			}

			console.log("currect");
		} else {
			triviaSubmitBtn.innerText = "InCorrect";
			triviaSubmitBtn.style.backgroundColor = "red";
		}
		console.log("Player 1 score", game.score1);
		console.log("Player 2 score", game.score2);
	}
	//!===================================
	isCorrect = function (e) {
		console.log("checking if correct");
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
		return status;
	};
}
