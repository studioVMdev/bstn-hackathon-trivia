//^===================================
export default class Game {
	constructor(questions) {
		// this.questions = null;
		// this.totalRounds = 0;
		// this.currentRoundIndex = 0;
		// this.score1 = 0;
		// this.score2 = 0;
		// this.submittedAnswers = 0;

		this.state = {
			questions: null,
			totalRounds: 0,
			currentRoundIndex: 0,
			score1: 0,
			score2: 0,
			submittedAnswers: 0,
		};
	}

	getQuestions = (URL) => {
		const { state } = this.state;

		return axios.get(URL).then((response) => {
			state.questions = response.data;
			state.totalRounds = response.data.length;
			state.newRound(response.data);
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
