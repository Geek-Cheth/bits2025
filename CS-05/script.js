let tasks = [];
let taskId = 1;

function loadTasks() {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    tasks = JSON.parse(saved);
    taskId = Math.max(...tasks.map(t => t.id), 0) + 1;
  }
  render();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  
  if (!text) return;
  
  tasks.unshift({
    id: taskId++,
    text: text,
    completed: false
  });
  
  input.value = '';
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
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

function render() {
  const list = document.getElementById('tasksList');
  list.innerHTML = '';
  
  tasks.forEach(task => {
    const item = document.createElement('div');
    item.className = `task-item ${task.completed ? 'completed' : ''}`;
    item.innerHTML = `
      <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})">
        ${task.completed ? '✓' : ''}
      </div>
      <span class="task-text">${task.text}</span>
      <button class="delete-btn" onclick="deleteTask(${task.id})">×</button>
    `;
    list.appendChild(item);
  });
}

document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

loadTasks();
