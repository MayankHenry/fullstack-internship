const API = 'http://localhost:3000/tasks';

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const taskList = document.getElementById('taskList');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');

async function loadTasks() {
  try {
    const response = await axios.get(API);
    const tasks = response.data;
    renderTasks(tasks);
  } catch (error) {
    taskList.innerHTML = '<li class="empty-state">Unable to load tasks. Is the backend running?</li>';
  }
}

function renderTasks(tasks) {
  if (!tasks.length) {
    taskList.innerHTML = '<li class="empty-state">No tasks yet. Add a task to get started.</li>';
    totalCount.textContent = '0';
    completedCount.textContent = '0';
    return;
  }

  const completed = tasks.filter((task) => task.completed).length;
  totalCount.textContent = tasks.length;
  completedCount.textContent = completed;

  taskList.innerHTML = tasks
    .map((task) => {
      return `
        <li class="task-item">
          <div>
            <h2 class="task-title ${task.completed ? 'completed' : ''}">${escapeHtml(task.title)}</h2>
            <div class="task-meta">
              <span>${escapeHtml(task.category)}</span>
              <span>${new Date(task.createdAt).toLocaleString()}</span>
            </div>
          </div>
          <div class="task-actions">
            <button class="complete" onclick="toggleTask('${task._id}', ${!task.completed})">
              ${task.completed ? 'Undo' : 'Complete'}
            </button>
            <button class="edit" onclick="editTask('${task._id}', '${escapeHtml(task.title)}', '${escapeHtml(task.category)}')">Edit</button>
            <button class="delete" onclick="deleteTask('${task._id}')">Delete</button>
          </div>
        </li>
      `;
    })
    .join('');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function addTask(event) {
  event.preventDefault();
  const title = taskInput.value.trim();
  const category = categorySelect.value;

  if (!title) return;

  try {
    await axios.post(API, { title, category });
    taskInput.value = '';
    categorySelect.value = 'General';
    loadTasks();
  } catch (error) {
    alert('Unable to add task. Check backend status.');
  }
}

async function toggleTask(id, completed) {
  try {
    await axios.put(`${API}/${id}`, { completed });
    loadTasks();
  } catch (error) {
    alert('Unable to update task.');
  }
}

async function deleteTask(id) {
  try {
    await axios.delete(`${API}/${id}`);
    loadTasks();
  } catch (error) {
    alert('Unable to delete task.');
  }
}

function editTask(id, title, category) {
  const newTitle = prompt('Edit task title:', title);
  if (newTitle === null) return;

  const newCategory = prompt('Edit task category (General, Work, Personal, Urgent):', category);
  if (newCategory === null) return;

  const trimmedTitle = newTitle.trim();
  const trimmedCategory = newCategory.trim() || 'General';

  if (!trimmedTitle) {
    alert('Task title cannot be empty.');
    return;
  }

  axios
    .put(`${API}/${id}`, { title: trimmedTitle, category: trimmedCategory })
    .then(loadTasks)
    .catch(() => alert('Unable to save task changes.'));
}

taskForm.addEventListener('submit', addTask);
loadTasks();
