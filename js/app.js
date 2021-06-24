//Global scope
const rollEl = document.getElementById("roll");
const selectEl = document.querySelectorAll("select");
let bonusArray = [];
let attPriority = [];
let characterArray = [];

function rollDice(diceType, diceNumber) {
  // Rolling the dice, pushing it to array & sorting
  let rollArray = [];
  for (let i = 0; i < diceNumber; i++) {
    let roll = Math.floor(Math.random() * diceType) + 1;
    rollArray.push(roll);
  }
  rollArray.sort(numberCompare);

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
}

function returnAttPriorityArray() {
  attPriority = [];
  for (let i = 0; i < selectEl.length; i++) {
    attValue = selectEl[i].value;
    attPriority.push(attValue);
  }
}

function numberCompare(a, b) {
  return b - a;
}

//Event Listeners
rollEl.addEventListener("click", () => {
  rollDice(20, 6);
  returnAttPriorityArray();
  let characterObject = new Character();
  console.log(bonusArray);
  console.log(attPriority);
  console.log(characterObject);
  characterArray.push(characterObject);
  console.log(characterArray);
});

class Character {
  constructor() {
    this.strength = bonusArray[attPriority.indexOf("strength")];
    this.dexterity = bonusArray[attPriority.indexOf("dexterity")];
    this.constitution = bonusArray[attPriority.indexOf("constitution")];
    this.intelligence = bonusArray[attPriority.indexOf("intelligence")];
    this.wisdom = bonusArray[attPriority.indexOf("wisdom")];
    this.charisma = bonusArray[attPriority.indexOf("charisma")];
  }
}
