const time = document.getElementById('time');
const date = document.getElementById('date');
const formatBtn = document.getElementById('formatBtn');
const themeBtn = document.getElementById('themeBtn');

let is24Hour = false;
let theme = localStorage.getItem('theme') || 'dark';

document.documentElement.setAttribute('data-theme', theme);
themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';

function updateClock() {
  const now = new Date();
  
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  
  let timeStr;
  if (is24Hour) {
    timeStr = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
  } else {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    timeStr = `${hours}:${minutes}:${seconds} ${ampm}`;
  }
  
  time.textContent = timeStr;
  date.textContent = dateStr;
}

formatBtn.addEventListener('click', () => {
  is24Hour = !is24Hour;
  formatBtn.textContent = is24Hour ? '24H' : '12H';
  updateClock();
});

themeBtn.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
});

setInterval(updateClock, 1000);
updateClock();
