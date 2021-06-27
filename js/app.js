//Global scope
const rollEl = document.getElementById("roll");
let bonusArray = [];
let attPriority = [];
let characterArray = [];

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
  const selectEl = document.querySelectorAll(".draggable-element");
  for (let i = 0; i < selectEl.length; i++) {
    attValue = selectEl[i].dataset.value;
    attPriority.push(attValue);
  }
}

function numberCompare(a, b) {
  return b - a;
}

//Event Listeners
rollEl.addEventListener("click", () => {
  returnAttPriorityArray();
  rollDice(20, 6);
  let characterObject = new Character();
  characterArray.push(characterObject);
  console.table(characterArray);
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
