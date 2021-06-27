//Global scope
const rollEl = document.getElementById("roll");
const bonusArray = [];
const attPriority = [];
const characterInfo = [];
const characterArray = [];

//Draggable attribute priority
const draggableEl = document.querySelectorAll(".draggable-element");
const dropzone = document.querySelector(".select-wrapper ul");

draggableEl.forEach((dragEl) => {
  dragEl.addEventListener("mousedown", () => {
    dragEl.classList.add("being-dragged");
  });
  dragEl.addEventListener("touchstart", () => {
    dragEl.classList.add("being-dragged");
  });

  dragEl.addEventListener("dragend", () => {
    dragEl.classList.remove("being-dragged");
  });
});

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(dropzone, e.clientY);
  const dragEl = document.querySelector(".being-dragged");
  if (afterElement == null) {
    dropzone.appendChild(dragEl);
  } else {
    dropzone.insertBefore(dragEl, afterElement);
  }
});

function getDragAfterElement(dropzone, y) {
  const dragEl = Array.from(
    dropzone.querySelectorAll(".draggable-element:not(.being-dragged)")
  );

  return dragEl.reduce(
    (closest, child) => {
      const attBox = child.getBoundingClientRect();
      const offset = y - attBox.top - attBox.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

//Dice & Object Function
function rollDice(diceType, diceNumber) {
  // Rolling the dice, pushing it to array & sorting
  let rollArray = [];
  for (let i = 0; i < diceNumber; i++) {
    let roll = Math.floor(Math.random() * diceType) + 1;
    rollArray.push(roll);
  }
  rollArray.sort(numberCompare);

  //Creating an array of real stats
  bonusArray.splice(0, bonusArray.length);
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
  attPriority.splice(0, attPriority.length);
  const selectEl = document.querySelectorAll(".draggable-element");
  for (let i = 0; i < selectEl.length; i++) {
    attValue = selectEl[i].dataset.value;
    attPriority.push(attValue);
  }
}

function numberCompare(a, b) {
  return b - a;
}

//Change the other variables/inputs for a class
const characterLevel = document.getElementById("level");

characterLevel.addEventListener("input", () => {
  let levelDisplay = document.querySelector(".level-display");
  levelDisplay.innerHTML = characterLevel.value;
});

function getName() {
  characterInfo.splice(0, characterInfo.length);
  let characterName = document.getElementById("name").value;
  if (characterName === "") {
    characterName = "No name";
  }
  characterInfo.push(`${characterName}`);
}

function getClass() {
  const characterClass = document.getElementById("class").value;
  characterInfo.push(characterClass);
}

function getRace() {
  const characterRace = document.getElementById('race').value;
  characterInfo.push(characterRace);
}

function getBackground() {
  const characterBackground = document.getElementById("background").value;
  characterInfo.push(characterBackground);
}

function getLevel() {
  characterInfo.push(characterLevel.value);
}

//Checking checkboxes for skill proficiencies
const profChecks = document.querySelectorAll(".check");
const maxChecks = 3;
const proficienciesEl = document.querySelector('.remaining-prof span');
let checksLeftGlobal = maxChecks;

for (let i = 0; i < profChecks.length; i++) {
  profChecks[i].onclick = checkLimiter;

  function checkLimiter() {
    const selectedChecks = document.querySelectorAll(".check:checked");
    let checksLeft = maxChecks - selectedChecks.length;

    const profUnchecked = document.querySelectorAll(".check:not(:checked)");

    for (let j = 0; j < profUnchecked.length; j++) {
      if (checksLeft === 0) {
        profUnchecked[j].disabled = true;
      } else {
        profUnchecked[j].disabled = false;
      }
      proficienciesEl.innerHTML = `${checksLeft}`;
      checksLeftGlobal = checksLeft;
    }
    console.log(checksLeft);
  }
}

//Update proficiencies left when race is selected.
const characterRaceContainer = document.querySelector('.race-selector');
const characterRace = document.querySelectorAll('.race-selector select');

characterRaceContainer.addEventListener("click", () => {
    proficienciesEl.innerHTML = `${checksLeftGlobal}`;
})

// for (let i = 0; i < characterRace.length; i++) {
//   characterRaceContainer.addEventListener("input", () => {
//     proficienciesEl.innerHTML = `${checksLeftGlobal}`;
//   })
// }

//Event Listeners
rollEl.addEventListener("click", () => {
  getName();
  getClass();
  getRace();
  getBackground();
  getLevel();
  returnAttPriorityArray();
  rollDice(20, 6);
  let characterObject = new Character();
  characterArray.push(characterObject);
  console.table(characterArray);
});

class Character {
  constructor() {
    this.name = characterInfo[0];
    this.class = characterInfo[1];
    this.race = characterInfo[2]
    this.background = characterInfo[3];
    this.level = characterInfo[4];
    this.strength = bonusArray[attPriority.indexOf("strength")];
    this.dexterity = bonusArray[attPriority.indexOf("dexterity")];
    this.constitution = bonusArray[attPriority.indexOf("constitution")];
    this.intelligence = bonusArray[attPriority.indexOf("intelligence")];
    this.wisdom = bonusArray[attPriority.indexOf("wisdom")];
    this.charisma = bonusArray[attPriority.indexOf("charisma")];
  }
}
