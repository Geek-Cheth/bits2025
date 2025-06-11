const texts = [
  "The quick brown fox jumps over the lazy dog near the riverbank.",
  "Programming is the art of telling another human being what one wants the computer to do.",
  "Life is what happens to you while you are busy making other plans for the future.",
  "The only way to do great work is to love what you do and put your heart into it.",
  "Success is not final, failure is not fatal, it is the courage to continue that counts.",
  "Innovation distinguishes between a leader and a follower in the modern world of technology.",
  "The future belongs to those who believe in the beauty of their dreams and aspirations.",
  "Technology is best when it brings people together and makes communication easier for everyone."
];

const textToType = document.getElementById('textToType');
const userInput = document.getElementById('userInput');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const timer = document.getElementById('timer');
const wpm = document.getElementById('wpm');
const accuracy = document.getElementById('accuracy');
const results = document.getElementById('results');
const finalTime = document.getElementById('finalTime');
const finalWPM = document.getElementById('finalWPM');
const finalAccuracy = document.getElementById('finalAccuracy');

let currentText = '';
let startTime = null;
let timerInterval = null;
let isTestActive = false;
let hasTypingStarted = false;

function getRandomText() {
  return texts[Math.floor(Math.random() * texts.length)];
}

function displayText() {
  currentText = getRandomText();
  textToType.textContent = currentText;
}

function startTest() {
  isTestActive = true;
  hasTypingStarted = false;
  startTime = null;
  userInput.disabled = false;
  userInput.focus();
  userInput.value = '';
  startBtn.style.display = 'none';
  restartBtn.style.display = 'inline-block';
  results.style.display = 'none';
  
  timer.textContent = '0s';
  wpm.textContent = '0';
  accuracy.textContent = '100%';
}

function updateStats() {
  if (!isTestActive || !hasTypingStarted || !startTime) return;
  
  const userText = userInput.value;
  
  // Check for completion first before updating stats
  if (userText.length >= currentText.length) {
    finishTest();
    return;
  }
  
  const currentTime = new Date().getTime();
  const timeElapsed = (currentTime - startTime) / 1000;
  timer.textContent = Math.floor(timeElapsed) + 's';
  
  const wordsTyped = userText.trim().split(/\s+/).length;
  const currentWPM = timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;
  wpm.textContent = currentWPM;
  
  const currentAccuracy = calculateAccuracy(userText, currentText);
  accuracy.textContent = currentAccuracy + '%';
  
  highlightText(userText);
}

function calculateAccuracy(typed, original) {
  if (typed.length === 0) return 100;
  
  let correct = 0;
  const maxLength = Math.max(typed.length, original.length);
  
  for (let i = 0; i < maxLength; i++) {
    if (typed[i] === original[i]) {
      correct++;
    }
  }
  
  return Math.round((correct / maxLength) * 100);
}

function highlightText(userText) {
  let highlightedText = '';
  
  for (let i = 0; i < currentText.length; i++) {
    const char = currentText[i];
    
    if (i < userText.length) {
      if (userText[i] === char) {
        highlightedText += `<span class="correct">${char}</span>`;
      } else {
        highlightedText += `<span class="incorrect">${char}</span>`;
      }
    } else if (i === userText.length) {
      highlightedText += `<span class="current">${char}</span>`;
    } else {
      highlightedText += char;
    }
  }
  
  textToType.innerHTML = highlightedText;
}

function finishTest() {
  if (!isTestActive) return; 
  
  isTestActive = false;
  hasTypingStarted = false;
  clearInterval(timerInterval);
  timerInterval = null;
  userInput.disabled = true;
  
  const endTime = new Date().getTime();
  const totalTime = (endTime - startTime) / 1000;
  const wordsCount = currentText.trim().split(/\s+/).length;
  const finalWPMValue = Math.round((wordsCount / totalTime) * 60);
  const finalAccuracyValue = calculateAccuracy(userInput.value, currentText);
  
  finalTime.textContent = totalTime.toFixed(1) + 's';
  finalWPM.textContent = finalWPMValue;
  finalAccuracy.textContent = finalAccuracyValue + '%';
  
  results.style.display = 'block';
}

function restartTest() {
  isTestActive = false;
  hasTypingStarted = false;
  clearInterval(timerInterval);
  startTime = null;
  
  userInput.disabled = true;
  userInput.value = '';
  timer.textContent = '0s';
  wpm.textContent = '0';
  accuracy.textContent = '100%';
  
  startBtn.style.display = 'inline-block';
  restartBtn.style.display = 'none';
  results.style.display = 'none';
  
  displayText();
}

startBtn.addEventListener('click', startTest);
restartBtn.addEventListener('click', restartTest);

userInput.addEventListener('input', () => {
  if (isTestActive) {
    const userText = userInput.value;
    
    // Check for completion first
    if (userText.length >= currentText.length) {
      finishTest();
      return;
    }
    
    if (!hasTypingStarted && userText.length > 0) {
      hasTypingStarted = true;
      startTime = new Date().getTime();
      timerInterval = setInterval(updateStats, 100);
    }
    
    if (hasTypingStarted) {
      updateStats();
    } else {
      highlightText(userText);
      const currentAccuracy = calculateAccuracy(userText, currentText);
      accuracy.textContent = currentAccuracy + '%';
    }
  }
});

displayText();
