const rollEl = document.getElementById("roll");

let bonusArray = [];

function rollDice(diceType, diceNumber) {
  // Rolling the dice, pushing it to array & sorting
  let rollArray = [];
  for (let i = 0; i < diceNumber; i++) {
    let roll = Math.floor(Math.random() * (diceType + 1));
    if (roll === 0) {
      roll = 1;
    }
    rollArray.push(roll);
  }
  rollArray.sort(numberCompare);
  console.log(rollArray);

  //Creating an array of real stats
  bonusArray = [];
  for (let i = 0; i < rollArray.length; i++) {
      let statValue = rollArray[i] - 10;
    //   statValue = Math.floor(statValue/2);
    //   console.log(statValue);
    if (statValue < 0) {
      statValue = Math.ceil(statValue/2);
    } else {
      statValue = Math.floor(statValue/2);
    }
    bonusArray.push(statValue);
  }
  console.log(bonusArray);
}

function numberCompare(a, b) {
  return a - b;
}
