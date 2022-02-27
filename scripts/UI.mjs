import "./app.js";
import Game from "./Game.mjs";
import MyDOM from "./MyDOM.mjs";
// import UI from "./UI.mjs";

let game = null;
export default class UI {
	// static clearCards = () => {
	// 	const card1 = MyDOM.select(".card-1");
	// 	console.log("container selected");
	// 	card1.textContent = "";
	// 	const card2 = MyDOM.select(".card-2");
	// 	console.log("container selected");
	// 	card2.textContent = "";
	// 	// const infoContainer = MyDOM.select(".info__container");
	// 	// infoContainer.style.display = "none";
	// 	// infoContainer.classList.remove("info__container--show");
	// };
	//!===================================
	static handleStart = () => {
		console.log("start game button pressed");
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
}
