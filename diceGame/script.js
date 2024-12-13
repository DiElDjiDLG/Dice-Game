const listOfAllDice = document.querySelectorAll(".die");
const scoreInputs = document.querySelectorAll("#score-options input");
const scoreSpans = document.querySelectorAll("#score-options span");
const roundElement = document.getElementById("current-round");
const rollsElement = document.getElementById("current-round-rolls");
const totalScoreElement = document.getElementById("total-score");
const scoreHistory = document.getElementById("score-history");
const rollDiceBtn = document.getElementById("roll-dice-btn");
const keepScoreBtn = document.getElementById("keep-score-btn");
const rulesContainer = document.querySelector(".rules-container");
const rulesBtn = document.getElementById("rules-btn");

let diceValuesArr = [];
let isModalShowing = false;
let score = 0;
let round = 1;
let rolls = 0;

const rollDice = () => {
  diceValuesArr = [];

  for (let i = 0; i < 5; i++) {
    const randomDice = Math.floor(Math.random() * 6) + 1;
    diceValuesArr.push(randomDice);
  };

  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });
};

const updateStats = () => {
  rollsElement.textContent = rolls;
  roundElement.textContent = round;
};

const updateRadioOption = (index, score) => {
  scoreInputs[index].disabled = false;
  scoreInputs[index].value = score;
  scoreSpans[index].textContent = `, score = ${score}`;
};
const updateScore = (selectedValue, achieved) => {
  const intScore = parseInt(selectedValue, 10)
  score += intScore;
  totalScoreElement.textContent = `${score}`;
  scoreHistory.innerHTML += `<li>${achieved} : ${selectedValue}</li>`
  } 

  //resets the game scores and everything so it's ready to start a new game
  const resetGame = () => {
    listOfAllDice.forEach((dice) => dice.textContent = 0);
    score = 0;
    rolls = 0;
    round = 1;
    totalScoreElement.textContent = score;
    scoreHistory.textContent = "";
    rollsElement.textContent = rolls;
    roundElement.textContent = round;
    resetRadioOptions();
  }

//counts what item appears the most
const getHighestDuplicates = () => {
  let count = diceValuesArr.reduce((count, curr) => {
    if (count[curr]){
      count[curr] += 1;
    } else {
      count[curr] = 1;
    }
    return count;
  }, {});

//returns how many time the most appearing item appears
  let maxCount = 0;

  for (let item in count) {
    if (count[item] > maxCount) {
      maxCount = count[item];
    }
  }

  //calculates the sum of all dice
  const sumOfAllDice = diceValuesArr.reduce((total, rest) => total + rest, 0);

  if (maxCount >= 3){
    updateRadioOption(0, sumOfAllDice);
  }
  if (maxCount >= 4){
    updateRadioOption(1, sumOfAllDice);
  } if (maxCount < 3){
      updateRadioOption(5, 0)
    }
}

//full house
const detectFullHouse = (arr) => {
  const counts = {};
  for (const num of arr) {
    if (counts[num]) {
      counts[num]++;
    } else {
      counts[num] = 1;
    }
  }
  const values = Object.values(counts);

  if (values.includes(2) && values.includes(3)){
    updateRadioOption(2, 25);
  } else {
    updateRadioOption(5, 0);
  
}
}

//reset radio options
const resetRadioOptions = () => {
  scoreInputs.forEach((e) => {
    e.disabled = true;
    e.checked = false;
  })
  scoreSpans.forEach((e) => {
    e.textContent = "";
  })
}

rollDiceBtn.addEventListener("click", () => {
  if (rolls === 3) {
    alert("You have made three rolls this round. Please select a score.");
    rollDiceBtn.disabled = true;
  } else {
    rolls++;
    resetRadioOptions();
    rollDice();
    updateStats();
    getHighestDuplicates();
    detectFullHouse(diceValuesArr);
    checkForStraights(diceValuesArr);
  }
});

rulesBtn.addEventListener("click", () => {
  isModalShowing = !isModalShowing;

  if (isModalShowing) {
    rulesBtn.textContent = "Hide rules";
    rulesContainer.style.display = "block";
  } else {
    rulesBtn.textContent = "Show rules";
    rulesContainer.style.display = "none";
  }
});

//Small and large straight
const checkForStraights = (arr) => {
  arr.sort((a, b) => a - b);
  let b = 0;
  for (let i = 1; i < arr.length; i++){
    if (arr[i] === arr[i - 1] + 1){
      b++
        } 
    }
    if (b === 3){
      updateRadioOption(3, 30);
    } if (b === 4){
      updateRadioOption(3, 30)
      updateRadioOption(4, 40);
    } else {
      updateRadioOption(5, 0);
    }
}

//adds function to the keepScoreBtn, keeps the score of 3 and 4 of a kind
keepScoreBtn.addEventListener("click", () => {
  let selectedValue;
  let achieved;

  for (const radioButton of scoreInputs) {
    if (radioButton.checked) {
      selectedValue = radioButton.value;
      achieved = radioButton.id;
      break;
    }
  }

  if (selectedValue) {
    rolls = 0;
    round++;
    updateStats();
    resetRadioOptions();
    updateScore(selectedValue, achieved);
    detectFullHouse(diceValuesArr);
  } else {
    alert("Please select an option or roll the dice");
  }
  //ends the game after 6 rounds
if (round > 6){
  setTimeout(() => {
    alert(`This round is over bruv, your score is: ${totalScoreElement.textContent}`);
  }, 500);
  resetGame();
}    
});

