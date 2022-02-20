import Game from "./Game.mjs";
import Round from "./Round.mjs";
import Card from "./Card.mjs";
import UI from "./UI.mjs";
import MyDOM from "./MyDOM.mjs";

const startBtn = MyDOM.select(".start__button");
// MyDOM.on("click", startBtn, console.log("clickedddd"))

startBtn.addEventListener("click", () => handleStart());

let game = new Game();
console.log(game);

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
