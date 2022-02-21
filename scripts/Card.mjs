// import Game from "./Game.mjs";
// import Round from "./Round.mjs";
// import UI from "./UI.mjs";
// import MyDOM from "./MyDOM.mjs";

// export default class Card {
// 	constructor(state, questionObj, playerId) {
// 		this.state = state;
// 		this.currQObj = questionObj;
// 		this.playerId = playerId;
// 		console.log(this.currQObj);
// 		this.answers = [];
// 		this.currQuestionText = this.currQObj.question;
// 		this.correctA = this.currQObj.correctAnswer;
// 		this.incorrectAs = this.currQObj.incorrectAnswers;
// 	}

// 	render() {
// 		const randomizeAnswers = () => {
// 			return this.answers.sort(() => (Math.random() > 0.5 ? 1 : -1));
// 		};
// 		this.answers.push(this.correctA);
// 		this.answers.push(...this.incorrectAs);

// 		const cardHtml = this.createHtmlCard();
// 		const cardEl = MyDOM.select(`.card-${this.playerId}`);
// 		console.log(cardEl);
// 		cardEl.appendChild(cardHtml);
// 	}

// 	createHtmlCard() {
// 		//! Container
// 		const triviaContainerEl = MyDOM.create("div", ".trivia__container");
// 		const playerLabel = MyDOM.create(
// 			"h4",
// 			"trivia__player",
// 			triviaContainerEl
// 		);
// 		playerLabel.innerText = "Player " + this.playerId;

// 		const scoreLabel = MyDOM.create("h4", "trivia__score", triviaContainerEl);
// 		console.log("🚀 ~ file: Card.mjs ~ line 42 ~ scoreLabel", scoreLabel);
// 		scoreLabel.innerText = `Score: ${
// 			this.playerId === 1 ? this.state.score1 : this.state.score2
// 		}`;

// 		//! Question
// 		const triviaQuestionEl = MyDOM.create(
// 			"h3",
// 			"trivia__question",
// 			triviaContainerEl
// 		);
// 		triviaQuestionEl.innerText = this.currQuestionText;

// 		//! 4 answers
// 		const answersWrapper = MyDOM.create("div", "trivia__answers-wrapper");
// 		this.answers.forEach((answer, i) => {
// 			const answerEl = MyDOM.create("p", ".trivia__answer");
// 			answerEl.innerText = answer;
// 			answer == this.correctA
// 				? (answerEl.dataset.status = "correct")
// 				: (answerEl.dataset.status = "incorrect");
// 			answerEl.dataset.id = answer;
// 			answerEl.addEventListener("click", (e) => this.handleSelect(e));

// 			answersWrapper.appendChild(answerEl);
// 		});

// 		triviaContainerEl.appendChild(answersWrapper);

// 		const triviaSubmitBtn = MyDOM.create(
// 			"button",
// 			"trivia__submit",
// 			triviaContainerEl
// 		);

// 		triviaSubmitBtn.innerText = "Submit Answer";
// 		triviaSubmitBtn.addEventListener("click", this.handleSubmit);

// 		return triviaContainerEl;
// 	}

// 	handleSelect(e) {
// 		console.log("selected");
// 		const answerEls = e.target.parentElement.children;
// 		Array.from(answerEls).forEach((answerEl) => {
// 			if (answerEl.classList.contains("trivia__answer--selected")) {
// 				answerEl.classList.remove("trivia__answer--selected");
// 			}
// 		});
// 		e.target.classList.add("trivia__answer--selected");
// 	}

// 	handleSubmit() {
// 		game.increment("submittedAnswers");
// 	}
// }
