//^===================================
export default class Round {
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
