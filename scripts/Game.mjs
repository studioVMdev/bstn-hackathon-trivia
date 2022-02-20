import Round from "./Round.mjs";
// import Card from "./Card.mjs";
import UI from "./UI.mjs";
import MyDOM from "./MyDOM.mjs";

export default class Game {
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
		console.log(property);
		this[property]++;
	}
}
