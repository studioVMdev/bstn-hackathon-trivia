export default class Card {
	// constructor(state, questionObj, playerId) {
	// 	this.state = state;
	// 	this.currQObj = questionObj;
	// 	this.playerId = playerId;
	// 	console.log(this.currQObj);
	// 	this.currQuestionText = this.currQObj.question;
	// 	this.correctA = this.currQObj.correctAnswer;
	// 	this.incorrectAs = this.currQObj.incorrectAnswers.slice(0, 3);
	// 	this.answers = [];
	// }
	// //!===================================
	// render = () => {
	// 	const cardHtml = this.createHtmlCard();
	// 	const cardEl = MyDOM.select(`.card-${this.playerId}`);
	// 	cardEl.appendChild(cardHtml);
	// };
	// //!===================================
	// createHtmlCard = () => {
	// 	//* Randomize answers
	// 	this.answers.push(this.correctA);
	// 	this.answers.push(...this.incorrectAs);
	// 	this.answers.sort(() => (Math.random() > 0.5 ? 1 : -1));
	// 	//* Container
	// 	const triviaContainerEl = MyDOM.create("div", ".trivia__container");
	// 	const statsWrapper = MyDOM.create(
	// 		"div",
	// 		"stats__wrapper",
	// 		triviaContainerEl
	// 	);
	// 	const playerLabel = MyDOM.create(
	// 		"h4",
	// 		["trivia__player", "player__info"],
	// 		statsWrapper
	// 	);
	// 	playerLabel.innerText = "Player " + this.playerId;
	// 	const scoreLabel = MyDOM.create(
	// 		"h4",
	// 		["trivia__score", "player__info"],
	// 		statsWrapper
	// 	);
	// 	scoreLabel.innerText = `Score: ${
	// 		this.playerId === 1 ? game.score1 : game.score2
	// 	}`;
	// 	//* Question
	// 	const triviaQuestionEl = MyDOM.create(
	// 		"h3",
	// 		"trivia__question",
	// 		triviaContainerEl
	// 	);
	// 	triviaQuestionEl.innerText = this.currQuestionText;
	// 	//* 4 answers
	// 	const answersWrapper = MyDOM.create("div", "trivia__answers-wrapper");
	// 	this.answers.map((answer) => {
	// 		const answerEl = MyDOM.create("p", ".trivia__answer");
	// 		answerEl.innerText = answer;
	// 		answer == this.correctA
	// 			? (answerEl.dataset.status = "correct")
	// 			: (answerEl.dataset.status = "incorrect");
	// 		answerEl.dataset.id = answer;
	// 		answerEl.addEventListener("click", (e) => this.handleSelect(e));
	// 		answersWrapper.appendChild(answerEl);
	// 	});
	// 	triviaContainerEl.appendChild(answersWrapper);
	// 	//* Button
	// 	const triviaSubmitBtn = MyDOM.create(
	// 		"button",
	// 		["trivia__submit", "btn"],
	// 		triviaContainerEl
	// 	);
	// 	triviaSubmitBtn.innerText = "Submit Answer";
	// 	triviaSubmitBtn.addEventListener("click", this.handleSubmit);
	// 	return triviaContainerEl;
	// };
	// //!===================================
	// handleSelect = (e) => {
	// 	console.log("selected", this.playerId);
	// 	const answerEls = e.target.parentElement.children;
	// 	console.log(answerEls);
	// 	Array.from(answerEls).map((answerEl) => {
	// 		if (answerEl.classList.contains("trivia__answer--selected")) {
	// 			answerEl.classList.remove("trivia__answer--selected");
	// 		}
	// 	});
	// 	e.target.classList.add("trivia__answer--selected");
	// };
	// //!===================================
	// handleSubmit = (e) => {
	// 	//* if current player submitted their answer, remove Ev Listener
	// 	console.log(game.getState());
	// 	if (!this.answerIsSelected(e)) {
	// 		console.log("nothing is selected");
	// 		return;
	// 	}
	// 	e.target.removeEventListener("click", this.handleSubmit);
	// 	game.increment("submittedAnswers");
	// 	const triviaSubmitBtn = e.target;
	// 	if (this.isCorrect(e)) {
	// 		triviaSubmitBtn.innerText = "Correct";
	// 		triviaSubmitBtn.style.backgroundColor = "lightseagreen";
	// 		if (
	// 			e.target.parentElement.parentElement.classList.contains("card-1")
	// 		) {
	// 			game.increment("score1");
	// 			const scoreLabel = e.target.parentElement.children[0].children[1];
	// 			scoreLabel.innerText = "Score: " + game[`score${1}`];
	// 		} else {
	// 			game.increment("score2");
	// 			const scoreLabel = e.target.parentElement.children[0].children[1];
	// 			scoreLabel.innerText = "Score: " + game[`score${2}`];
	// 		}
	// 		console.log("correct");
	// 	} else {
	// 		triviaSubmitBtn.innerText = "InCorrect";
	// 		triviaSubmitBtn.style.backgroundColor = "lightcoral";
	// 	}
	// 	//* check if both players have submitted their answer
	// 	if (game.submittedAnswers === 2) {
	// 		console.log("both players submitted answers");
	// 		// if (game.totalRounds === game.currentRoundIndex) {
	// 		//   console.log("gameOver");
	// 		//   UI.gameOver();
	// 		// }
	// 		game.increment("currentRoundIndex");
	// 		UI.showInfoBtn();
	// 	}
	// };
	// //!===================================
	// answerIsSelected = (e) => {
	// 	console.log("checking if an answer is selected");
	// 	//* check if any answers are selected.
	// 	const answerEls = e.target.previousElementSibling.children;
	// 	let somethingSelected = false;
	// 	Array.from(answerEls).map((answerEl) => {
	// 		if (answerEl.classList.contains("trivia__answer--selected")) {
	// 			somethingSelected = true;
	// 		}
	// 	});
	// 	return somethingSelected;
	// };
	// //!===================================
	// isCorrect = (e) => {
	// 	console.log("checking if correct");
	// 	console.log(e.target.previousElementSibling);
	// 	const answersParent = e.target.previousElementSibling.children;
	// 	let status = false;
	// 	Array.from(answersParent).map((answer) => {
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
	// 	console.log(status);
	// 	return status;
	// };
}
