let index = 0;
const flashcard = document.getElementById('flashcard');
const prevBtn = document.getElementById('prevBtn');
const flipBtn = document.getElementById('flipBtn');
const nextBtn = document.getElementById('nextBtn');

function renderCard() {
  const { question, answer } = cards[index];
  flashcard.querySelector('.front').textContent = question;
  flashcard.querySelector('.back').textContent = answer;
  flashcard.classList.remove('flipped');
}

flashcard.addEventListener('click', () => {
  flashcard.classList.toggle('flipped');
});

flipBtn.addEventListener('click', () => {
  flashcard.classList.toggle('flipped');
});

prevBtn.addEventListener('click', () => {
  index = (index - 1 + cards.length) % cards.length;
  renderCard();
});

nextBtn.addEventListener('click', () => {
  index = (index + 1) % cards.length;
  renderCard();
});

// Initialize
renderCard();
