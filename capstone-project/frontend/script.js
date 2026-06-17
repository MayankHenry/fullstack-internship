const API_BASE_URL = "http://localhost:5000/api";

const authPanel = document.getElementById("authPanel");
const dashboard = document.getElementById("dashboard");
const authMessage = document.getElementById("authMessage");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const showLogin = document.getElementById("showLogin");
const showSignup = document.getElementById("showSignup");
const logoutBtn = document.getElementById("logoutBtn");
const welcomeTitle = document.getElementById("welcomeTitle");
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const saveTaskBtn = document.getElementById("saveTaskBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const taskId = document.getElementById("taskId");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskCategory = document.getElementById("taskCategory");
const taskDueDate = document.getElementById("taskDueDate");

let tasks = [];

function getToken() {
  return localStorage.getItem("taskManagerToken");
}

function getUser() {
  return JSON.parse(localStorage.getItem("taskManagerUser") || "null");
}

function setSession(data) {
  localStorage.setItem("taskManagerToken", data.token);
  localStorage.setItem("taskManagerUser", JSON.stringify(data.user));
}

function clearSession() {
  localStorage.removeItem("taskManagerToken");
  localStorage.removeItem("taskManagerUser");
}

async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

function showView() {
  const user = getUser();
  const token = getToken();

  if (user && token) {
    authPanel.classList.add("hidden");
    dashboard.classList.remove("hidden");
    welcomeTitle.textContent = `${user.name}'s Tasks`;
    loadTasks();
  } else {
    dashboard.classList.add("hidden");
    authPanel.classList.remove("hidden");
  }
}

function switchAuth(mode) {
  const isLogin = mode === "login";
  loginForm.classList.toggle("hidden", !isLogin);
  signupForm.classList.toggle("hidden", isLogin);
  showLogin.classList.toggle("active", isLogin);
  showSignup.classList.toggle("active", !isLogin);
  authMessage.textContent = "";
}

function formatDate(value) {
  if (!value) return "No due date";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function updateStats() {
  const done = tasks.filter((task) => task.completed).length;
  document.getElementById("totalCount").textContent = tasks.length;
  document.getElementById("activeCount").textContent = tasks.length - done;
  document.getElementById("doneCount").textContent = done;
}

function renderTasks() {
  updateStats();

  if (!tasks.length) {
    taskList.innerHTML = '<div class="empty">No tasks found. Add your first task from the form.</div>';
    return;
  }

  taskList.innerHTML = tasks
    .map((task) => `
      <article class="task-item ${task.completed ? "done" : ""}">
        <div class="task-head">
          <h3>${escapeHtml(task.title)}</h3>
          <span class="pill">${task.completed ? "Completed" : "Active"}</span>
        </div>
        <p>${escapeHtml(task.description || "No description")}</p>
        <div class="task-meta">
          <span class="pill">${escapeHtml(task.category || "General")}</span>
          <span class="pill">${formatDate(task.dueDate)}</span>
        </div>
        <div class="task-actions">
          <button type="button" data-action="toggle" data-id="${task._id}">
            ${task.completed ? "Mark active" : "Mark done"}
          </button>
          <button class="secondary" type="button" data-action="edit" data-id="${task._id}">Edit</button>
          <button class="danger" type="button" data-action="delete" data-id="${task._id}">Delete</button>
        </div>
      </article>
    `)
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadTasks() {
  const params = new URLSearchParams();
  if (searchInput.value.trim()) params.set("search", searchInput.value.trim());
  if (statusFilter.value) params.set("status", statusFilter.value);

  tasks = await api(`/tasks?${params.toString()}`);
  renderTasks();
}

function resetTaskForm() {
  taskId.value = "";
  taskForm.reset();
  taskCategory.value = "General";
  saveTaskBtn.textContent = "Add task";
  cancelEditBtn.classList.add("hidden");
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  authMessage.textContent = "";

  try {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value
      })
    });
    setSession(data);
    showView();
  } catch (error) {
    authMessage.textContent = error.message;
  }
});

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  authMessage.textContent = "";

  try {
    const data = await api("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        name: document.getElementById("signupName").value,
        email: document.getElementById("signupEmail").value,
        password: document.getElementById("signupPassword").value
      })
    });
    setSession(data);
    showView();
  } catch (error) {
    authMessage.textContent = error.message;
  }
});

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    title: taskTitle.value,
    description: taskDescription.value,
    category: taskCategory.value || "General",
    dueDate: taskDueDate.value || null,
    completed: taskId.value ? tasks.find((task) => task._id === taskId.value)?.completed : false
  };

  if (taskId.value) {
    await api(`/tasks/${taskId.value}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  } else {
    await api("/tasks", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  resetTaskForm();
  loadTasks();
});

taskList.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const task = tasks.find((item) => item._id === button.dataset.id);
  if (!task) return;

  if (button.dataset.action === "toggle") {
    await api(`/tasks/${task._id}`, {
      method: "PUT",
      body: JSON.stringify({ ...task, completed: !task.completed })
    });
    loadTasks();
  }

  if (button.dataset.action === "edit") {
    taskId.value = task._id;
    taskTitle.value = task.title;
    taskDescription.value = task.description || "";
    taskCategory.value = task.category || "General";
    taskDueDate.value = task.dueDate ? task.dueDate.slice(0, 10) : "";
    saveTaskBtn.textContent = "Save changes";
    cancelEditBtn.classList.remove("hidden");
  }

  if (button.dataset.action === "delete") {
    await api(`/tasks/${task._id}`, { method: "DELETE" });
    loadTasks();
  }
});

showLogin.addEventListener("click", () => switchAuth("login"));
showSignup.addEventListener("click", () => switchAuth("signup"));
cancelEditBtn.addEventListener("click", resetTaskForm);
searchInput.addEventListener("input", loadTasks);
statusFilter.addEventListener("change", loadTasks);
logoutBtn.addEventListener("click", () => {
  clearSession();
  resetTaskForm();
  showView();
});

showView();
