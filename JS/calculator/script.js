// --- Sélection des éléments du DOM ---
const screen = document.getElementById("display");
const keypad = document.getElementById("keys");
const historyBox = document.getElementById("history");

// --- Variables globales ---
let currentValue = "0";
let storedValue = null;
let currentOperator = null;
let replaceNext = false;
let historyList = [];

// Met a jour laaffichage
const refreshScreen = () => {
  screen.textContent = (!isNaN(currentValue) && currentValue.length > 15)
    ? Number(currentValue).toExponential(7)
    : currentValue;
};

// Reinitialisation
const reset = (full = true) => {
  currentValue = "0";
  if (full) {
    storedValue = null;
    currentOperator = null;
  }
  replaceNext = false;
  refreshScreen();
};

//lhistorique
const pushHistory = entry => {
  historyList.unshift(entry);
  if (historyList.length > 5) historyList.pop();
  historyBox.innerHTML = historyList.map(item => `<li>${item}</li>`).join("");
};

//calcul
const compute = () => {
  if (storedValue === null || !currentOperator) return;
  const a = Number(storedValue), b = Number(currentValue);
  let result;

  if (currentOperator === "÷" && b === 0) {
    reset();
    screen.textContent = "Error";
    return;
  }

  if (currentOperator === "+") result = a + b;
  else if (currentOperator === "-") result = a - b;
  else if (currentOperator === "×") result = a * b;
  else if (currentOperator === "÷") result = a / b;

  result = Number(result.toFixed(10));
  pushHistory(`${a} ${currentOperator} ${b} = ${result}`);
  currentValue = String(result);
  storedValue = null;
  currentOperator = null;
  replaceNext = true;
  refreshScreen();
};

// Gerer les entrees
const processInput = (type, value = null) => {
  if (type === "digit") {
    if (value === "." && currentValue.includes(".")) return; 
    currentValue = replaceNext || currentValue === "0" ? value : currentValue + value;
    replaceNext = false;
  } else if (type === "op") {
    if (replaceNext) { currentOperator = value; return; }
    if (storedValue !== null && currentOperator) compute();
    storedValue = currentValue;
    currentOperator = value;
    replaceNext = true;
  } else if (type === "eq") {
    compute();
  } else if (type === "cmd") {
    if (value === "AC") reset();
    else if (value === "CE") currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
    else if (value === "neg") currentValue = currentValue.startsWith("-") ? currentValue.slice(1) : "-" + currentValue;
    else if (value === "pct") currentValue = String(+currentValue / 100);
  }
  refreshScreen();
};

// Clic souris
keypad.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (btn) processInput(btn.dataset.type, btn.dataset.value);
});

// Clavier
document.addEventListener("keydown", e => {
  if (/\d/.test(e.key)) processInput("digit", e.key);
  else if (e.key === ".") processInput("digit", ".");
  else if (["+", "-", "*", "/"].includes(e.key))
    processInput("op", { "*": "×", "/": "÷" }[e.key] || e.key);
  else if (["Enter", "="].includes(e.key)) processInput("eq");
  else if (e.key === "Backspace") processInput("cmd", "CE");
  else if (e.key === "Escape") processInput("cmd", "AC");
});
