// F = (G - C*(1 - w)) / w 
// F = final grade, G = target grade, w = % weight as decimal, C = current grade 
function calcReqGrade (currGrade, targetGrade, finalWeight) {
  let w = finalWeight / 100; 
  let reqGrade = (targetGrade - (currGrade * (1 - w))) / w; 
  return reqGrade; 
} 

// G = F*w + C*(1 - w) 
// G = course grade, F = final grade, w = % weight as decimal, C = current grade 
function calcCourseGrade (currGrade, finalGrade, finalWeight) {
  let w = finalWeight / 100; 
  let courseGrade = (finalGrade * w) + (currGrade * (1 - w)); 
  return courseGrade; 
} 

// I = (G*C + N*c) / (C + c)
// I = gpa impact, G = current gpa, C = completed credits, N = new course grade, c = new course credits, 
function calcGpaImpact (currGPA, compCreds, newGrade, newCreds) {
  let totalPoints = currGPA * compCreds + newGrade * newCreds; 
  let totalCreds = parseInt(compCreds) + parseInt(newCreds); 
  let newGPA = Math.round((totalPoints / totalCreds) * 100) / 100; 
  let gpaImpact = Math.round((newGPA - currGPA) * 1000) / 1000; 
  return {newGPA, gpaImpact}; 
}

function createScreen(array, array2) {
  clearScreen(); 
  createAbout(array.name); 
  createInputs(array.value, array2.value); 
  createEnter(); 
}

function clearScreen() {
  const inputs = document.getElementsByClassName("inputs"); 
  while (inputs[0].firstChild) {
    inputs[0].removeChild(inputs[0].firstChild); 
  }
  const enters = document.getElementsByClassName("enter"); 
  enters[0].removeChild(enters[0].firstChild); 
}

function createAbout(arrName) { 
  const options = document.getElementsByClassName("option");
  for (let i = 0; i < options.length; i++) {
    if (options[i].id == arrName) {
      options[i].classList.remove("inactive"); 
      options[i].classList.add("active"); 
    } else {
      options[i].classList.remove("active"); 
      options[i].classList.add("inactive"); 
    }
  } 
  if (arrName == "reqGrade") {
    const abouts = document.getElementsByClassName("about"); 
    abouts[0].innerHTML = "final grade calculator: calculates what final exam grade you'll need to get desired class grade!!"; 
  } else if (arrName == "courseGrade") {
    const abouts = document.getElementsByClassName("about");
    abouts[0].innerHTML = "course grade calculator: calculates your overall class grade after you've taken the final!!"; 
  }
}

function createInputs(arrVal, arrVal2) {
  const inputs = document.getElementsByClassName("inputs");
  const inputForm = document.createElement("form"); 
  inputForm.id = "form"; 
  for (let i = 0; i < arrVal.length; i++) { 
    const inputDiv = document.createElement("div");
    inputDiv.classList.add("input"); 
    inputDiv.id = arrVal[i] + "Div"; 

    const inputDivText = document.createElement("div"); 
    inputDivText.classList.add("inputText")
    inputDivText.innerHTML = arrVal2[i]; 
    inputDivText.id = arrVal[i] + "DivText"; 

    const inputDivInput = document.createElement("input"); 
    inputDivInput.classList.add("inputParam");
    inputDivInput.type = "text";
    inputDivInput.name = arrVal[i];
    inputDivInput.id = arrVal[i]; 
    inputDivInput.placeholder = arrVal[i]; 

    inputDiv.appendChild(inputDivText); 
    inputDiv.appendChild(inputDivInput); 
    inputForm.appendChild(inputDiv); 
    inputs[0].appendChild(inputForm);
  }
}

function createEnter() {
  const enters = document.getElementsByClassName("enter");
  const enterInput = document.createElement("button");
  enterInput.classList.add("enterParam"); 
  enterInput.textContent = "submit"; 
  enterInput.id = "enterButton"; 
  enters[0].appendChild(enterInput); 
}

//START 
let reqGrade = {
  name: "reqGrade", 
  value: ["currGrade", "targetGrade", "finalWeight"]
}; 
let courseGrade = {
  name: "courseGrade", 
  value: ["currGrade", "finalGrade", "finalWeight"]
}; 
let reqGradeText = {
  name: "reqGradeText", 
  value: ["current grade: ", "target grade: ", "final exam weight: "]
}
let courseGradeText = {
  name: "courseGradeText",
  value: ["current grade: ", "final grade: ", "final exam weight: "]
}
let gpaImpact = {
  name: "gpaImpact",
  value: ["currGPA: ", "compCreds: ", "newGrade", "newCreds"]
}
let gpaImpactText = {
  name: "gpaImpactText",
  value: ["current gpa: ", "completed credits: ", "new grade: ", "new credits: "]
}

let mode = reqGrade; 
let mode2 = reqGradeText; 
createScreen(mode, mode2); 

const reqGradeButton = document.getElementById("reqGrade"); 
reqGradeButton.addEventListener("click", () => {
  mode = reqGrade; 
  mode2 = reqGradeText; 
  createScreen(reqGrade, reqGradeText); 
}); 

const courseGradeButton = document.getElementById("courseGrade");
courseGradeButton.addEventListener("click", () => {
  mode = courseGrade; 
  mode2 = courseGradeText; 
  createScreen(courseGrade, courseGradeText);
}); 

const gpaImpactButton = document.getElementById("gpaImpact");
gpaImpactButton.addEventListener("click", () => {
  mode = gpaImpact;
  mode2 = gpaImpactText;
  createScreen(gpaImpact, gpaImpactText);
}); 

const enters = document.getElementsByClassName("enter"); 
enters[0].addEventListener("click", (event) => {
  const enterButton = event.target.closest(".enterParam");
  if (enterButton) { displayResult(mode); }
});

function displayResult(mode) {
  let form = document.getElementById("form");
  if (mode.name == "reqGrade") {
    text = calcReqGrade(form.elements[0].value, form.elements[1].value, form.elements[2].value); 
    alert("you will need a " + text + "% to get a " + form.elements[1].value + " in the class!");
  } else if (mode.name == "courseGrade") {
    text = calcCourseGrade(form.elements[0].value, form.elements[1].value, form.elements[2].value); 
    alert("you will have a " + text + " in the class!");
  } else if (mode.name == "gpaImpact") {
    const {newGPA: newGPA, gpaImpact: gpaImpact} = calcGpaImpact(form.elements[0].value, form.elements[1].value, form.elements[2].value, form.elements[3].value);
    alert("your gpa changed by " + gpaImpact + " and is now " + newGPA + "!");
  }
}