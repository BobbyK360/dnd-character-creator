//Global scope
const rollEl = document.getElementById("roll");
const rollArray = [];
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

//======================
//Dice & Object Function
//======================

//Roll four d6
//Take the sum of the best 3 -> that's your number for a single stat.
//This makes it so you can get a max of 18, but a min of 3.
//Do that 6 times to fill a full array.
function rollDice(diceType, diceNumber) {
  // Rolling the dice, pushing it to array & sorting
  rollArray.splice(0, rollArray.length);
  for (let i = 0; i < diceNumber; i++) {
    const tempRollArray = [];
    for (let j = 0; j < 4; j++) {
      const roll = Math.floor(Math.random() * diceType) + 1;
      tempRollArray.push(roll);
    }
    tempRollArray.sort(numberCompare);
    tempRollArray.splice(-1, 1);
    let rolledSum = 0;
    for (const numberRolled of tempRollArray) {
      rolledSum += numberRolled;
    }
    rollArray.push(rolledSum);
  }
  rollArray.sort(numberCompare);

  //Creating an array of real stats
  bonusArray.splice(0, bonusArray.length);
  for (let i = 0; i < rollArray.length; i++) {
    let statValue = rollArray[i] - 10;
    //We always take the number lowest. So a 9 would result in a -1 for the bonus array.
    statValue = Math.floor(statValue / 2);
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
  const levelDisplay = document.querySelector(".level-display");
  levelDisplay.innerHTML = characterLevel.value;
});

function getName() {
  characterInfo.splice(0, characterInfo.length);
  const characterName = document.getElementById("name").value
    ? document.getElementById("name").value
    : "No Name";
  characterInfo.push(`${characterName}`);
}

function getClass() {
  const characterClass = document.getElementById("class").value;
  characterInfo.push(characterClass);
}

function getRace() {
  const characterRace = document.getElementById("race").value;
  characterInfo.push(characterRace);
}

function getBackground() {
  const characterBackground = document.getElementById("background").value;
  characterInfo.push(characterBackground);
}

function getLevel() {
  characterInfo.push(characterLevel.value);
}

function getProficiencies() {
  const selectedChecks = document.querySelectorAll(".check:checked");
  const selectedChecksArray = [];
  for (let i = 0; i < selectedChecks.length; i++) {
    selectedChecksArray.push(selectedChecks[i].value);
  }
  characterInfo.push(selectedChecksArray);
}

//Checking checkboxes for skill proficiencies
const profChecks = document.querySelectorAll(".check");
const maxChecks = 3;
const proficienciesEl = document.querySelector(".remaining-prof span");
let checksLeftGlobal = maxChecks;

for (let i = 0; i < profChecks.length; i++) {
  profChecks[i].onclick = checkLimiter;

  function checkLimiter() {
    const selectedChecks = document.querySelectorAll(".check:checked");
    const checksLeft = maxChecks - selectedChecks.length;

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
  }
}

//Update proficiencies left when race or class is selected.
const characterRaceContainer = document.querySelector(".race-selector");
const characterClassContainer = document.querySelector(".class-selector");

characterRaceContainer.addEventListener("click", () => {
  proficienciesEl.innerHTML = `${checksLeftGlobal}`;
});

characterClassContainer.addEventListener("click", () => {
  proficienciesEl.innerHTML = `${checksLeftGlobal}`;
});

//Event Listeners
rollEl.addEventListener("click", () => {
  getName();
  getClass();
  getRace();
  getBackground();
  getLevel();
  getProficiencies();
  returnAttPriorityArray();
  rollDice(6, 6);
  const CharacterObject = new Character();
  characterArray.push(CharacterObject);
  console.table(characterArray);
  assignOutputFieldHeader(CharacterObject);
  assignOutputFieldStats(CharacterObject);
  assignSkills(CharacterObject);
});

class Character {
  constructor() {
    this.name = characterInfo[0];
    this.class = characterInfo[1];
    this.race = characterInfo[2];
    this.background = characterInfo[3];
    this.level = characterInfo[4];
    this.proficiencies = characterInfo[5];
    this.strengthOrig = rollArray[attPriority.indexOf("Strength")];
    this.strength = bonusArray[attPriority.indexOf("Strength")];
    this.dexterityOrig = rollArray[attPriority.indexOf("Dexterity")];
    this.dexterity = bonusArray[attPriority.indexOf("Dexterity")];
    this.constitutionOrig = rollArray[attPriority.indexOf("Constitution")];
    this.constitution = bonusArray[attPriority.indexOf("Constitution")];
    this.intelligenceOrig = rollArray[attPriority.indexOf("Intelligence")];
    this.intelligence = bonusArray[attPriority.indexOf("Intelligence")];
    this.wisdomOrig = rollArray[attPriority.indexOf("Wisdom")];
    this.wisdom = bonusArray[attPriority.indexOf("Wisdom")];
    this.charismaOrig = rollArray[attPriority.indexOf("Charisma")];
    this.charisma = bonusArray[attPriority.indexOf("Charisma")];
    this.alignment = 0;
    this.faction = 0;
    this.exp = 0;
    this.playerName = 0;
  }
}

//==========================
//Assign values to the sheet
//==========================

//Functions to assign values to the sheet
//Because calling a bunch of the same assignment functions is ugly, here is a function that runs through all
//the output boxes and assigns the innerHTML of the associated span. The only thing hard-coded is the fieldListHeaderArray
//which should be in the same order as the sheet.
function assignOutputFieldHeader(object) {
  const fieldList = [
    "name",
    "level",
    "class",
    "race",
    "background",
    "alignment",
    "faction",
    "exp",
  ];

  for (const attribute of fieldList) {
    const outputGrabber = document.querySelector(
      `.sheet__character-${attribute} h1 span`
    );
    outputGrabber.innerHTML = object[attribute];
  }

  //Set the player name separately as it follows a different naming convention.
  const playerName = document.querySelector(`.sheet__player-name h1 span`);
  playerName.innerHTML = object[playerName];
}

const skillsModifier = {
  strength: ["athletics"],
  dexterity: ["acrobatics", "slight of hand", "stealth"],
  constitution: [],
  intelligence: ["arcana", "history", "investigation", "nature", "religion"],
  wisdom: ["animal handling", "insight", "medicine", "perception", "survival"],
  charisma: ["deception", "intimidation", "performance", "persuasion"],
};

function assignOutputFieldStats(object) {
  const fieldList = Object.keys(skillsModifier);

  for (const attribute of fieldList) {
    const outputGrabberBonus = document.querySelector(
      `.sheet__character-${attribute} span:first-of-type`
    );
    const outputGrabberOrig = document.querySelector(
      `.sheet__character-${attribute} span:last-child`
    );

    outputGrabberBonus.innerHTML = object[attribute];
    outputGrabberOrig.innerHTML = object[`${attribute}Orig`];
  }
}


function assignSkills(object) {
  const levelValue = characterLevel.value;
  let proficiencyBonus; 
  
  switch (true) {
    case (levelValue < 5):
      proficiencyBonus = 2;
      break;
    case (levelValue < 9):
      proficiencyBonus = 3;
      break;
    case (levelValue < 13):
      proficiencyBonus = 4;
      break;
    case (levelValue < 17):
      proficiencyBonus = 5;
      break;
    case (levelValue < 21):
      proficiencyBonus = 6;
      break;
  }



  const skillsElArray = Array.from(
    document.querySelectorAll(".sheet__character-skills > div")
  );
  const skillsArray = [];
  const skillsArraySpan = Array.from(
    document.querySelectorAll(".sheet__character-skills > div h1 span")
  );
  const fieldList = Object.keys(skillsModifier);

  for (const pushValue of skillsElArray) {
    skillsArray.push(pushValue.dataset.value);
  }

  for (const attribute of fieldList) {
    for (const skill of skillsModifier[`${attribute}`]) {
      if (skillsArray.indexOf(skill) > -1) {
        const skillsIndexer = skillsArray.indexOf(skill);

        if (object["proficiencies"].indexOf(skill) === -1) {
          skillsArraySpan[skillsIndexer].innerHTML = object[`${attribute}`];
        } else {
          skillsArraySpan[skillsIndexer].innerHTML = object[`${attribute}`] + proficiencyBonus;
        }

        skillsArraySpan.splice(skillsIndexer, 1);
        skillsArray.splice(skillsIndexer, 1);
      }
    }
  }
}