//Global scope
const rollEl = document.getElementById("roll");
const selectEl = document.querySelectorAll("select");
let bonusArray = [];
// selectEl.values;

function rollDice(diceType, diceNumber) {
  // Rolling the dice, pushing it to array & sorting
  let rollArray = [];
  for (let i = 0; i < diceNumber; i++) {
    let roll = Math.floor(Math.random() * diceType) + 1;
    rollArray.push(roll);
  }
  rollArray.sort(numberCompare);
  console.log(rollArray);

  //Creating an array of real stats
  bonusArray = [];
  for (let i = 0; i < rollArray.length; i++) {
    let statValue = rollArray[i] - 10;
    if (statValue < 0) {
      statValue = Math.ceil(statValue / 2);
    } else {
      statValue = Math.floor(statValue / 2);
    }
    if (statValue === -0) {
      statValue = 0;
    } //This accounts for 9 returning -0
    bonusArray.push(statValue);
  }
  console.log(bonusArray);
}

function numberCompare(a, b) {
  return b - a;
}

//Event Listeners
rollEl.addEventListener("click", () => {
  rollDice(20, 6);
});
