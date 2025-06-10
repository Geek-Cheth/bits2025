const display = document.getElementById('result');
const numberBtns = document.querySelectorAll('.number');
const operatorBtns = document.querySelectorAll('.operator');
const equalsBtn = document.getElementById('equals');
const clearBtn = document.getElementById('clear');

let currentInput = '0';
let operator = null;
let previousInput = null;
let shouldResetDisplay = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function inputNumber(number) {
  if (shouldResetDisplay) {
    currentInput = '';
    shouldResetDisplay = false;
  }
  
  if (number === '.' && currentInput.includes('.')) return;
  
  currentInput = currentInput === '0' ? number : currentInput + number;
  updateDisplay();
}

function inputOperator(nextOperator) {
  if (previousInput === null) {
    previousInput = currentInput;
  } else if (operator) {
    const result = calculate();
    currentInput = String(result);
    previousInput = result;
    updateDisplay();
  }
  
  shouldResetDisplay = true;
  operator = nextOperator;
  
  operatorBtns.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-operator="${nextOperator}"]`).classList.add('active');
}

function calculate() {
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);
  
  if (isNaN(prev) || isNaN(current)) return;
  
  switch (operator) {
    case '+': return prev + current;
    case '-': return prev - current;
    case '*': return prev * current;
    case '/': return current !== 0 ? prev / current : 0;
    default: return;
  }
}

function equals() {
  if (operator === null || shouldResetDisplay) return;
  
  const result = calculate();
  currentInput = String(result);
  operator = null;
  previousInput = null;
  shouldResetDisplay = true;
  
  operatorBtns.forEach(btn => btn.classList.remove('active'));
  updateDisplay();
}

function clear() {
  currentInput = '0';
  operator = null;
  previousInput = null;
  shouldResetDisplay = false;
  
  operatorBtns.forEach(btn => btn.classList.remove('active'));
  updateDisplay();
}

numberBtns.forEach(btn => {
  btn.addEventListener('click', () => inputNumber(btn.dataset.number));
});

operatorBtns.forEach(btn => {
  btn.addEventListener('click', () => inputOperator(btn.dataset.operator));
});

equalsBtn.addEventListener('click', equals);
clearBtn.addEventListener('click', clear);

updateDisplay();
