// F = (G - C*(1 - w)) / w 
// F = final grade, G = target grade, w = % weight as decimal, C = current grade 
function calcReqGrade(currGrade, targetGrade, finalWeight) {
  let w = finalWeight / 100;
  let reqGrade = (targetGrade - (currGrade * (1 - w))) / w;
  return reqGrade;
}
// G = F*w + C*(1 - w) 
// G = course grade, F = final grade, w = % weight as decimal, C = current grade 
function calcCourseGrade(currGrade, finalGrade, finalWeight) {
  let w = finalWeight / 100;
  let courseGrade = (finalGrade * w) + (currGrade * (1 - w));
  return courseGrade;
}
// I = (G*C + N*c) / (C + c)
// I = gpa impact, G = current gpa, C = completed credits, N = new course grade, c = new course credits, 
function calcGpaImpact(currGPA, compCreds, newGrade, newCreds) {
  if (!parseInt(newGrade)) {
    let base = Math.abs(newGrade.charCodeAt(0) - 69);  //doesn't work for F (it's E)
    if (newGrade.includes("F")) {
      base = 0;
    } else {
      if (newGrade.includes("+") && !newGrade.includes("A")) {
        base += 0.3;
      } else if (newGrade.includes("-") && !newGrade.includes("D")) {
        base -= 0.3;
      }
    }
    newGrade = base;
  }
  let totalPoints = currGPA * compCreds + newGrade * newCreds;
  let totalCreds = parseInt(compCreds) + parseInt(newCreds);
  let newGPA = Math.round((totalPoints / totalCreds) * 100) / 100;
  let gpaImpact = Math.round((newGPA - currGPA) * 1000) / 1000;
  return { newGPA, gpaImpact };
}

let reqGrade = {
  name: "reqGrade",
  value: ["currGrade", "targetGrade", "finalWeight"]
};
let reqGradeText = {
  name: "reqGradeText",
  value: ["current grade: ", "target grade: ", "final exam weight: ", "currGrade eg: 88.5", "targetGrade eg: 90", "finalWeight eg: 15"]
}
let courseGrade = {
  name: "courseGrade",
  value: ["currGrade", "finalGrade", "finalWeight"]
};
let courseGradeText = {
  name: "courseGradeText",
  value: ["current grade: ", "final grade: ", "final exam weight: ", "currGrade eg: 88.5", "finalGrade eg: 95", "finalWeight eg: 15"]
}
let gpaImpact = {
  name: "gpaImpact",
  value: ["currGPA", "compCreds", "newGrade", "newCreds"]
}
let gpaImpactText = {
  name: "gpaImpactText",
  value: ["current gpa: ", "completed credits: ", "new grade: ", "new credits: ", "currGPA eg: 3.5", "compCreds eg: 30", "newGrade eg: A- or 3.3", "newCreds eg: 3"]
}
let finalSlider = {
  name: "finalSlider",
  value: ["currGrade", "finalWeight"]
}
let finalSliderText = {
  name: "finalSliderText",
  value: ["current grade: ", "final weight: ", "currGrade default: 90", "finalWeight default: 15"]
}

//START 
let chart;
let isChart = false;
let selectedI = 50;
let dPs = [];

let mode = reqGrade;
let mode2 = reqGradeText;
let infoMode = 0;
createScreen(mode, mode2);

function createScreen(array, array2) {
  clearScreen();
  const options = document.getElementsByClassName("options");
  if (array.name == "reqGrade" || array.name == "courseGrade") {
    options[0].style.marginTop = (1.3 * 0.05 * 95) + "vh";
  } else if (array.name == "finalSlider") {
    options[0].style.marginTop = (1.05 * 0.05 * 95) + "vh";
  } else if (array.name == "gpaImpact") {
    options[0].style.marginTop = (1.1 * 0.05 * 95) + "vh";
  }
  const mains = document.getElementsByClassName("main");
  const images = document.getElementsByClassName("bg");
  createInfo();
  createAbout(array.name);
  createInputs(array.value, array2.value);
  if (array.name == "finalSlider") {
    mains[0].style.height = "154.75vh"; //95+55+4.75
    images[0].src = "images/grade-calculator-graphic-1.svg";
    createChart(90, 15);
  } else {
    mains[0].style.height = "95vh";
    images[0].src = "images/grade-calculator-graphic.svg"
    createEnter();
  }
}

function clearScreen() {
  if (isChart) { clearChart(); }
  const enterParams = document.querySelectorAll(".enterParam");
  enterParams.forEach(elem => elem.remove());
  const charts = document.querySelectorAll(".charts");
  charts.forEach(elem => elem.remove());
  const toolTips = document.querySelectorAll(".toolTip");
  toolTips.forEach(elem => elem.remove());
  const inputs = document.getElementsByClassName("inputs");
  while (inputs[0].firstChild) {
    inputs[0].removeChild(inputs[0].firstChild);
  }
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
  const abouts = document.getElementsByClassName("about");
  if (arrName == "reqGrade") {
    abouts[0].innerHTML = "final grade calculator: calculates what final exam grade you'll need to get desired course grade";
  } else if (arrName == "courseGrade") {
    abouts[0].innerHTML = "course grade calculator: calculates your overall course grade after you've taken the final";
  } else if (arrName == "gpaImpact") {
    abouts[0].innerHTML = "gpa impact calculator: calculates your new gpa and overall gpa impact after taking a new course";
  } else if (arrName == "finalSlider") {
    abouts[0].innerHTML = "what if? grade visuzalizer: graphs the max/min course grade you can get for different final exam scores ";
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
    inputDivInput.placeholder = arrVal2[i + (arrVal2.length / 2)];

    inputDiv.appendChild(inputDivText);
    inputDiv.appendChild(inputDivInput);
    inputForm.appendChild(inputDiv);
    inputs[0].appendChild(inputForm);
    inputDivInput.style.width = returnEvenWidth(inputDiv, inputDivText, inputDivInput);
  }
  if (mode.name == "finalSlider") { //create inputs before create chart
    const sliderContainer = document.createElement("div");
    sliderContainer.classList.add("input");
    sliderContainer.id = "sliderContainer";

    const slider = document.createElement("input");
    slider.classList.add("inputParam");
    slider.type = "range";
    slider.min = "000";
    slider.max = "110";
    slider.value = "050";
    slider.id = "slider";

    const sliderValue = document.createElement("span");
    sliderValue.classList.add("inputText");
    sliderValue.id = "sliderValue";
    sliderValue.textContent = "050";
    sliderValue.style.color = "var(--option-color-active)";
    selectedI = 50; 

    const sliderMin = document.createElement("span");
    sliderMin.classList.add("inputText");
    sliderMin.id = "sliderMin";
    sliderMin.textContent = slider.min;
    sliderMin.style.marginLeft = "2.9vw";

    const sliderMax = document.createElement("span");
    sliderMax.classList.add("inputText");
    sliderMax.id = "sliderMax";
    sliderMax.textContent = slider.max;
    sliderMax.style.marginLeft = "0";

    sliderContainer.appendChild(sliderValue);
    sliderContainer.appendChild(sliderMin);
    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(sliderMax);
    inputForm.appendChild(sliderContainer);
    inputs[0].appendChild(inputForm);
  }
}

function returnEvenWidth(div, text, input) {
  let divWidth = div.offsetWidth;
  let textWidth = text.offsetWidth;
  let inputWidth = input.offsetWidth;
  const rect1 = text.getBoundingClientRect();
  const rect2 = input.getBoundingClientRect();
  let gapWidth = rect2.left - rect1.right;
  let marginWidth = parseFloat(window.getComputedStyle(text).marginLeft);
  return (divWidth - textWidth - gapWidth - 40 - marginWidth) + "px";
}

function createEnter() {
  const enters = document.getElementsByClassName("enter");
  const enterInput = document.createElement("button");
  enterInput.classList.add("enterParam");
  enterInput.textContent = "submit";
  enterInput.id = "enterButton";
  enters[0].appendChild(enterInput);
}

function checkInputs() {
  const form = document.getElementById("form");
  for (let i = 0; i < form.length; i++) {
    let id = form.elements[i].id;
    let stringVal = form.elements[i].value;
    let intVal = parseInt(form.elements[i].value); 
    const regex = /[^0-9.]/g; //matches any char that's not a digit or decimal 
    const regex1 = /.*[^0-9\.ABCDF\+\-].*/; //matches any char that's not a digit, decimal, +, -, or letters ABCDF 
    if (stringVal == "" || intVal < 0) {
      alert("please enter a non-negative value for " + id);
      return false;
    } else if (id != "newGrade" && regex.test(stringVal)) {
      alert("please enter a numerical value for " + id);
      return false; 
    } else if (id != "compCreds" && intVal > 100) {
      alert("please enter a value between 0 - 100 for " + id);
      return false;
    } else if (id == "newGrade" && regex1.test(stringVal)) {
      alert("please enter a numerical value between 0 - 100 or a valid grade letter for " + id);
      return false;
    } //id == "newGrade" && isNaN(intVal) && (stringVal.charCodeAt(0) < 65 || stringVal.charCodeAt(0) > 70 || stringVal.charCodeAt(0) == 69)
  }
  return true;
}

function displayResult(mode) {
  const form = document.getElementById("form");
  if (mode.name == "reqGrade") {
    text = calcReqGrade(form.elements[0].value, form.elements[1].value, form.elements[2].value);
    alert("you will need at least a " + text + "% to get a " + form.elements[1].value + " in the class!");
  } else if (mode.name == "courseGrade") {
    text = calcCourseGrade(form.elements[0].value, form.elements[1].value, form.elements[2].value);
    alert("you will have a " + text + " in the class!");
  } else if (mode.name == "gpaImpact") {
    const { newGPA: newGPA, gpaImpact: gpaImpact } = calcGpaImpact(form.elements[0].value, form.elements[1].value, form.elements[2].value, form.elements[3].value);
    text = generateGPAText(gpaImpact);
    alert("new gpa: " + newGPA + "\nchanges gpa by  " + gpaImpact + "  – " + text);
  }
}

function generateGPAText(gpaImpact) {
  let text;
  if (gpaImpact < 0) {
    text = " negative ";
  } else if (gpaImpact > 0) {
    text = " positive ";
  } else {
    text = " ";
  }
  if (Math.abs(gpaImpact) >= 0.100) {
    text = "high" + text + "impact";
  } else if (Math.abs(gpaImpact) >= 0.050) {
    text = "moderate" + text + "impact";
  } else if (Math.abs(gpaImpact) >= 0.010) {
    text = "slight" + text + "impact";
  } else {
    text = "negligible" + text + "impact";
  }
  return text;
}

function createChart(currG, finalW) {
  const chartContainer = document.createElement("div");
  chartContainer.classList.add("charts");
  chartContainer.id = "chartContainer";
  chartContainer.style = "height: var(--def-width-1); width: calc(1.1 * var(--def-width-2));"
  const mains = document.getElementsByClassName("main");
  mains[0].appendChild(chartContainer);

  let xVal = 0;
  let yVal = 0;
  chart = new CanvasJS.Chart("chartContainer", {
    interactivityEnabled: true,
    showTooltip: true,
    titleWrap: true,
    backgroundColor: "#dcebff",
    title: {
      text: "so what if?",
      fontColor: "rgb(125, 155, 215)",
      fontFamily: "courier new",
      padding: "10",
    },
    axisX: {
      title: "what if? final exam score (%)",
      titleFontColor: "#00005b",
      titleFontFamily: "courier new",
      titlePadding: 15,
      includeZero: true,
    },
    axisY: {
      title: "overall course grade",
      titleFontColor: "#00005b",
      titleFontFamily: "courier new",
      titlePadding: 20,
    },
    data: [{
      type: "line",
      dataPoints: dPs,
    }],
    toolTip: {
      shared: false,
      fontColor: "black",
      fontWeight: "bold",
      fontFamily: "courier new",
      backgroundColor: "white",
      borderThickness: 10.5,
      borderColor: "white",
      cornerRadius: 2,
      content: "final exam score: {x}%, course grade: {y}",
    },
  });
  isChart = true;

  for (let i = 0; i < 111; i += 1) {
    xVal = i;
    yVal = calcCourseGrade(currG, i, finalW);
    dPs.push({
      x: xVal,
      y: yVal
    });
  }
  chart.render();
  createToolTip();
}

function updateChart(currG, finalW) {
  clearChart();
  clearToolTip();
  let points = chart.options.data[0].dataPoints;
  for (let i = 0; i < 111; i += 1) { points.push({ x: i, y: calcCourseGrade(currG, i, finalW) }); }
  chart.render();
  createToolTip();
}

function clearChart() {
  for (let i = 0; i < 111; i += 1) { chart.options.data[0].dataPoints.shift(); } 
  clearToolTip(); 
}

function checkInputsGraph() {
  const regex = /[^0-9.]/g; //matches any char that's not a digit or decimal 
  let isClear1 = true;
  let isClear2 = true;
  let input1 = 90;
  let input2 = 15;
  
  let id1 = form.elements[0].id;
  let string1 = form.elements[0].value;
  let int1 = parseInt(form.elements[0].value);
  if (string1 == "") {
    input1 = 90;
  } else if (int1 < 0 || int1 > 100 || regex.test(string1)) {
    isClear1 = false;
  } else {
    input1 = int1;
  }
  let id2 = form.elements[1].id;
  let string2 = form.elements[1].value;
  let int2 = parseInt(form.elements[1].value);
  if (string2 == "") {
    input2 = 15;
  } else if (int2 < 0 || int2 > 100 || regex.test(string2)) {
    isClear2 = false;
  } else {
    input2 = int2;
  }
  if (isClear1 && isClear2) {
    updateChart(input1, input2);
  } else {
    alert("please enter numerical values between 0-100 for both inputs, or leave blank for default values");
  }
}

function createToolTip() {
  const toolTip = document.createElement("div");
  toolTip.className = "toolTip";
  toolTip.id = "toolTip";
  const triangle = document.createElement("div");
  triangle.className = "toolTip";
  triangle.id = "toolTipTri";
  const dot = document.createElement("div");
  dot.className = "toolTip";
  dot.id = "toolTipDot";

  const mains = document.getElementsByClassName("main");
  mains[0].appendChild(toolTip);
  mains[0].appendChild(triangle);
  mains[0].appendChild(dot);

  const dp = dPs[selectedI];
  const pixelX = chart.axisX[0].convertValueToPixel(dp.x);
  const pixelY = chart.axisY[0].convertValueToPixel(dp.y);
  const chartRect = document.getElementById("chartContainer").getBoundingClientRect();
  toolTip.style.display = "block";
  toolTip.style.left = (pixelX + chartRect.left - toolTip.offsetWidth / 2) + "px";
  toolTip.style.top = (pixelY + 559 - 70) + "px"; //70 px above dot
  toolTip.innerHTML = "final exam: " + (dp.x).toString() + " \nfinal grade: " + (dp.y).toString();
  triangle.style.display = "block";
  triangle.style.left = (pixelX + chartRect.left - triangle.offsetWidth / 2) + "px";
  triangle.style.top = (pixelY + 586 - 32) + "px"; //32 px above dot
  dot.style.display = "block";
  dot.style.left = (pixelX + chartRect.left - dot.offsetWidth / 2) + "px";
  dot.style.top = (pixelY + 586) + "px";
}

function clearToolTip() {
  const toolTips = document.querySelectorAll(".toolTip");
  toolTips.forEach(elem => elem.remove());
}

function createInfo() {
  const infoDiv = document.getElementsByClassName("infoDiv");
  const infoDivTri = document.getElementsByClassName("infoDivTri");
  infoDiv[0].style.display = "none";
  infoDivTri[0].style.display = "none";
}

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

const finalSliderButton = document.getElementById("finalSlider");
finalSliderButton.addEventListener("click", () => {
  mode = finalSlider;
  mode2 = finalSliderText;
  createScreen(finalSlider, finalSliderText);
});

const enters = document.getElementsByClassName("enter");
enters[0].addEventListener("click", (event) => {
  const enterButton = event.target.closest(".enterParam");
  if (enterButton && checkInputs()) { displayResult(mode); }
});

const inputs = document.getElementsByClassName("inputs");
inputs[0].addEventListener("input", function (e) {
  if (e.target && e.target.id === "slider") {
    const sliderContainer = document.getElementById("sliderContainer");
    const slider = document.getElementById("slider");
    const sliderValue = document.getElementById("sliderValue");
    slider.addEventListener("input", function () {
      selectedI = this.value;
      let text = selectedI;
      if (text.charAt(1) == "" && text.charAt(2) == "") {
        text = "00" + text;
      } else if (text.charAt(2) == "") {
        text = "0" + text;
      }
      sliderValue.textContent = text;
      clearToolTip();
      createToolTip();
      chart.render();
    });
  }
}); 

document.addEventListener("change", function (e) {
  const target = e.target.closest("#currGrade");
  if (target && mode.name == "finalSlider") {
    checkInputsGraph();
  }
}); 

document.addEventListener("change", function (e) {
  const target = e.target.closest("#finalWeight");
  if (target && mode.name == "finalSlider") {
    checkInputsGraph();
  }
}); 

const infoButton = document.getElementsByClassName("infoButton");
infoButton[0].addEventListener("click", (event) => {
  const infoDiv = document.getElementsByClassName("infoDiv");
  const infoDivTri = document.getElementsByClassName("infoDivTri");
  if (infoMode == 0) {
    infoDiv[0].style.display = "flex";
    infoDivTri[0].style.display = "flex";
    infoMode = 1;
    if (mode.name == "reqGrade") {
      infoDiv[0].innerHTML = "formula:\nF = (G-C*(1-w))/w\n\nF = final grade\nG = target grade\nw = % weight as decimal\nC = current grade";
    } else if (mode.name == "courseGrade") {
      infoDiv[0].innerHTML = "formula:\nG = F*w+C*(1-w)\n\nG = course grade\nF = final grade\nw = % weight as decimal\nC = current grade";
    } else if (mode.name == "finalSlider") {
      infoDiv[0].innerHTML = "meet the visual graph!\n\nchange inputs to change\ngrade range & slope\n\ntooltip: use slider for static and hover over\ngraph for dynamic";
    } else if (mode.name == "gpaImpact") {
      infoDiv[0].innerHTML = "formula:\nI = (G*C+N*c)/(C+c)\n\nI = gpa impact\nG = current gpa\nC = completed credits\nN = new course grade\nc = new course credits";
    }
  } else {
    infoDiv[0].style.display = "none";
    infoDivTri[0].style.display = "none";
    infoMode = 0;
  }
}); 