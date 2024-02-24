/* eslint-disable linebreak-style */
/* eslint-disable no-lonely-if */
/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
/* eslint-disable linebreak-style */
/* eslint-disable default-case */
/* eslint-disable no-restricted-properties */
/* eslint-disable linebreak-style */
const startGame = document.getElementById('startGame');
const startGameInput = document.getElementById('startGameInput');
const buttonStart = document.getElementById('buttonStart');
const crDeck = document.getElementById('deck');
const timeOver = document.getElementById('timeover');

let numberOfColumns = startGameInput.value;
let numberOfCards = Math.pow(numberOfColumns, 2);
let labelFlexBasis = '20%';
let labelHight = '100px';
let labelFontSize = '50px';

startGameInput.addEventListener('input', () => {
  if (startGameInput.value !== 0) {
    numberOfColumns = startGameInput.value;
    numberOfCards = Math.pow(numberOfColumns, 2);
    // set the card size
    switch (numberOfColumns) {
      case '2':
      case '4':
        labelFlexBasis = '20%';
        labelHight = '100px';
        labelFontSize = '50px';
        break;
      case '6':
        labelFlexBasis = '15%';
        labelHight = '60px';
        labelFontSize = '40px';
        break;
      case '8':
        labelFlexBasis = '11%';
        labelHight = '45px';
        labelFontSize = '30px';
        break;
      case '10':
        labelFlexBasis = '9%';
        labelHight = '35px';
        labelFontSize = '25px';
        break;
    }
  }
});

// press start
buttonStart.addEventListener('click', () => {
  startGame.style.display = 'none';
  // open the game field
  crDeck.style.display = 'flex';
  openPairsGame();
  // if time is over
  setTimeout(() => {
    crDeck.style.display = 'none';
    timeOver.style.display = 'block';
    buttonMore.style.display = 'block';
    buttonMore.addEventListener('click', () => {
      location.reload();
      buttonMore.style.display = 'none';
    });
  }, 300000);
});

function openPairsGame() {
  // initial deck
  const initDeck = [];
  for (let i = 1; i <= numberOfCards / 2; i++) {
    initDeck.push(i); initDeck.push(i);
  }

  let numberOfOpenedCards = 0;

  // shuffle the deck
  const shuffledDeck = [];
  for (let i = 0; i < numberOfCards; i++) {
    shuffledDeck.push(initDeck[i]);
  }

  for (let i = numberOfCards - 1; i > 0; i--) {
    const j = Math.round(Math.random() * i);
    const temp = shuffledDeck[i];
    shuffledDeck[i] = shuffledDeck[j];
    shuffledDeck[j] = temp;
  }

  // laying cards
  let firstPress = true; // open the first out of two
  let firstCardPressed = null; // the number of the first opened
  const openedCard = []; // the open card prop
  let clickAllowed = true;

  // let crDeck = document.getElementById("deck");
  const buttonMore = document.getElementById('buttonMore');
  const labelDeck = [];
  const inputLabel = [];
  const cardLabel = [];
  const frontCard = [];
  const backCard = [];

  // turn back unmatching cards
  function turnBack(i, j) {
    cardLabel[i].style.transform = 'rotateX(0deg)';
    cardLabel[j].style.transform = 'rotateX(0deg)';
    labelDeck[i].style.cursor = 'pointer';
    labelDeck[j].style.cursor = 'pointer';
    clickAllowed = true;
  }

  for (let i = 0; i < numberOfCards; i++) {
    openedCard.push(false);

    labelDeck.push(document.createElement('label'));
    inputLabel.push(document.createElement('input'));
    cardLabel.push(document.createElement('div'));
    frontCard.push(document.createElement('div'));
    backCard.push(document.createElement('div'));

    labelDeck[i].style.flexBasis = labelFlexBasis;
    labelDeck[i].style.height = labelHight;
    labelDeck[i].style.fontSize = labelFontSize;
    frontCard[i].style.lineHeight = labelHight;
    backCard[i].style.lineHeight = labelHight;

    inputLabel[i].type = 'checkbox';
    cardLabel[i].classList.add('card');
    frontCard[i].classList.add('front');
    backCard[i].classList.add('back');

    frontCard[i].textContent = '~~~~~~';
    backCard[i].textContent = shuffledDeck[i];
    backCard[i].style.transform = 'rotateX(180deg)';

    labelDeck[i].append(inputLabel[i]);
    cardLabel[i].append(frontCard[i]);
    cardLabel[i].append(backCard[i]);
    labelDeck[i].append(cardLabel[i]);

    labelDeck[i].addEventListener('click', (e) => {
      e.preventDefault();

      if (!openedCard[i] && clickAllowed) {
        cardLabel[i].style.transform = 'rotateX(180deg)';
        labelDeck[i].style.cursor = 'not-allowed';

        if (firstPress) {
          // remember the first opened card
          firstPress = false;
          firstCardPressed = i;
        } else {
          // look at the second opened card
          if (i !== firstCardPressed) {
            firstPress = true;
            if (shuffledDeck[i] !== shuffledDeck[firstCardPressed]) {
              // turn back unmatching cards
              clickAllowed = false;
              setTimeout(turnBack, 1200, i, firstCardPressed);
            } else {
              // leave matching cards open
              openedCard[i] = true; openedCard[firstCardPressed] = true;
              labelDeck[i].style.cursor = 'not-allowed';
              labelDeck[firstCardPressed].style.cursor = 'not-allowed';
              numberOfOpenedCards += 2;
              // if all cards are opened
              if (numberOfOpenedCards === numberOfCards) {
                setTimeout(() => {
                  buttonMore.style.display = 'block';
                  buttonMore.addEventListener('click', () => {
                    location.reload();
                    buttonMore.style.display = 'none';
                  });
                }, 1000);
              }
            }
          }
        }
      }
    });

    crDeck.append(labelDeck[i]);
  }
}
