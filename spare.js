const game = () => {
  let { limit, currentGame, gameQuestions } = state;
  console.log(limit, currentGame);

  if (limit >= currentGame) {

    displayQuestion(gameQuestions[currentGame])
    state.currentGame += 1;
  } else {
    // gameOver();
  }

  console.log(currentGame);

}

const gameOver = () => {
  console.log('game - over')
}

// const displayQuestion = (currQuestion) => {
//   const answerPool = []
//   const correctA = currQuestion.correctAnswer;
//   const incorrectAs = currQuestion.incorrectAnswers;
//   answerPool.push(correctA);
//   answerPool.push(...incorrectAs);
//   console.log(answerPool);
//   answerPool.sort(() => (Math.random() > .5) ? 1 : -1);
//   console.log(answerPool);

  const triviaContainerEl = create('div','.trivia__container')

  const triviaQuestionEl = create('h3', 'trivia__question', triviaContainerEl);
  triviaQuestionEl.innerText = currQuestion.question;

  const answersWrapper = create('div', '.trivia__answers-wrapper', triviaQuestionEl);





  answerPool.forEach((answer, i) => {
    const answerEl = create('p', '.trivia__answer');
    answerEl.innerText = answer;
    answer == correctA ? answerEl.dataset.status = 'correct' : answerEl.dataset.status = 'incorrect';
    answerEl.dataset.id = answer;
    answerEl.addEventListener('click', (e) => {
      const answersParent = e.target.parentElement.children;
      console.log(answersParent);
      Array.from(answersParent).forEach(answer => {
        if (answer.classList.contains('trivia__answer--selected')) {
          answer.classList.remove('trivia__answer--selected')
        }
      })
      e.target.classList.add('trivia__answer--selected')
    })
    answersWrapper.appendChild(answerEl);
  })




  triviaContainerEl.appendChild(answersWrapper)
  const triviaEl = select('.trivia')
  triviaEl.appendChild(triviaContainerEl);

  const triviaSubmitBtn = create('button', 'trivia__submit', triviaContainerEl);
  triviaSubmitBtn.innerText = 'Submit Answer'


}
