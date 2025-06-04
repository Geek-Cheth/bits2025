let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let taskId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

const elements = {
  input: () => document.getElementById('taskInput'),
  list: () => document.getElementById('tasksList'),
  stats: () => document.getElementById('stats')
};

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  const text = elements.input().value.trim();
  if (!text) return;
  
  tasks.unshift({
    id: taskId++,
    text,
    completed: false,
    time: Date.now()
  });
  
  elements.input().value = '';
  saveTasks();
  render();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    render();
  }
}

function deleteTask(id) {
  const element = document.querySelector(`[data-id="${id}"]`);
  element.style.animation = 'slideOut 0.3s ease forwards';
  setTimeout(() => {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
  }, 300);
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  render();
}

function getTimeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

function render() {
  const completed = tasks.filter(t => t.completed).length;
  elements.stats().textContent = `${tasks.length} tasks • ${completed} done`;
  
  if (!tasks.length) {
    elements.list().innerHTML = `
      <div class="empty">
        <div class="empty-icon">✓</div>
        <div class="empty-text">All clear</div>
      </div>
    `;
    return;
  }
  
  elements.list().innerHTML = tasks.map(task => `
    <div class="task ${task.completed ? 'completed' : ''}" data-id="${task.id}">
      <div class="task-check" onclick="toggleTask(${task.id})">
        <div class="check-icon">${task.completed ? '✓' : ''}</div>
      </div>
      <div class="task-content">
        <div class="task-text">${task.text}</div>
        <div class="task-time">${getTimeAgo(task.time)}</div>
      </div>
      <div class="task-actions">
        <button class="task-btn" onclick="deleteTask(${task.id})">×</button>
      </div>
    </div>
  `).join('');
}

function init() {
  elements.input().addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });
  
  document.getElementById('addBtn').addEventListener('click', addTask);
  document.getElementById('clearBtn').addEventListener('click', clearCompleted);
  
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') elements.input().blur();
    if (e.key === '/' && e.target !== elements.input()) {
      e.preventDefault();
      elements.input().focus();
    }
  });
  
  render();
}

init();
