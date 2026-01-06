const boardEl = document.getElementById('board');
const newGameBtn = document.getElementById('newGame');
const difficultySel = document.getElementById('difficulty');
const playAgainBtn = document.getElementById('playAgain');
const modal = document.getElementById('modal');

const movesEl = document.getElementById('moves');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const matchedEl = document.getElementById('matched');
const totalPairsEl = document.getElementById('totalPairs');

const finalTime = document.getElementById('finalTime');
const finalMoves = document.getElementById('finalMoves');
const finalScore = document.getElementById('finalScore');


let firstCard = null;
let secondCard = null;
let lockBoard = false;

let matchedPairs = 0;
let totalPairs = 0;

let moves = 0;
let elapsedSeconds = 0;
let timerInterval = null;

const EMOJIS = [
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯',
  '🦁','🐮','🐷','🐸','🐵','🐔','🦄','🐝','🐛','🐢',
  '🐬','🐙','🦖','🦋','🌵','🍎','🍌','🍇','🍓','🍕',
  '🍩','🍪'
];


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startTimer() {
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    updateTimer();
  }, 1000);
}

function updateTimer() {
  minutesEl.textContent = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
  secondsEl.textContent = String(elapsedSeconds % 60).padStart(2, "0");
}


function updateStatus() {
  movesEl.textContent = moves;
  matchedEl.textContent = matchedPairs;
  totalPairsEl.textContent = totalPairs;
}

function flipCard(card) {
  if (lockBoard) return;
  if (card === firstCard) return;
  if (card.classList.contains("flipped")) return;
  if (card.classList.contains("matched")) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    moves++;
    updateStatus();
    checkForMatch();
  }
}

function checkForMatch() {
  const match = firstCard.dataset.face === secondCard.dataset.face;

  if (match) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedPairs++;
    resetTurn();

    if (matchedPairs === totalPairs) {
      endGame();
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 900);
  }
}


function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function endGame() {
  clearInterval(timerInterval);

  finalTime.textContent =
    `${String(Math.floor(elapsedSeconds / 60)).padStart(2,'0')}:${String(elapsedSeconds % 60).padStart(2,'0')}`;

  finalMoves.textContent = moves;
  finalScore.textContent = calculateScore();

  modal.classList.remove("hidden");
}

function calculateScore() {
  const timeFactor = Math.max(1, Math.round((totalPairs * 5) / elapsedSeconds));
  const moveFactor = Math.max(1, Math.round((totalPairs * 3) / moves));
  return timeFactor * moveFactor * 10;
}

function init() {
  boardEl.innerHTML = "";
  modal.classList.add("hidden");

  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matchedPairs = 0;
  moves = 0;
  elapsedSeconds = 0;

  updateTimer();
  updateStatus();

  if (timerInterval) clearInterval(timerInterval);
  startTimer();

  const size = parseInt(difficultySel.value);
  totalPairs = (size * size) / 2;

  const selected = EMOJIS.slice(0, totalPairs);
  const gameSet = shuffleArray([...selected, ...selected]);

  boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  gameSet.forEach(face => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.face = face;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face front">❓</div>
        <div class="card-face back">${face}</div>
      </div>
    `;

    card.addEventListener("click", () => flipCard(card));
    boardEl.appendChild(card);
  });
}

newGameBtn.addEventListener("click", init);
playAgainBtn.addEventListener("click", init);
difficultySel.addEventListener("change", init);

init();
