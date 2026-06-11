const baseURL = 'http://localhost:3000';

function getToken() { return localStorage.getItem('token'); }
function setToken(t) { if (t) localStorage.setItem('token', t); else localStorage.removeItem('token'); }

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchUsers() {
  try {
    const res = await axios.get(`${baseURL}/users`, { headers: authHeaders() });
    renderUsers(res.data);
  } catch (err) {
    console.error(err);
    alert('Failed to fetch users. Are you logged in?');
  }
}

function renderUsers(users) {
  const tbody = document.querySelector('#users-table tbody');
  tbody.innerHTML = '';
  users.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${u.id}</td><td>${u.name}</td><td>${u.email}</td>
      <td>
        <button data-action="edit" data-id="${u.id}">Edit</button>
        <button data-action="delete" data-id="${u.id}">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

async function addUser(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  if (!name || !email) return;
  try {
    await axios.post(`${baseURL}/users`, { name, email }, { headers: authHeaders() });
    document.getElementById('add-form').reset();
    fetchUsers();
  } catch (err) {
    console.error(err);
    alert('Failed to add user');
  }
}

async function handleTableClick(e) {
  const btn = e.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  if (action === 'edit') {
    const newName = prompt('New name?');
    const newEmail = prompt('New email?');
    if (newName || newEmail) {
      try {
        await axios.put(`${baseURL}/users/${id}`, { name: newName, email: newEmail }, { headers: authHeaders() });
        fetchUsers();
      } catch (err) { console.error(err); alert('Update failed'); }
    }
  } else if (action === 'delete') {
    if (!confirm('Delete user?')) return;
    try {
      await axios.delete(`${baseURL}/users/${id}`, { headers: authHeaders() });
      fetchUsers();
    } catch (err) { console.error(err); alert('Delete failed'); }
  }
}

async function login(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  try {
    const res = await axios.post(`${baseURL}/login`, { email, password });
    setToken(res.data.token);
    document.getElementById('auth-msg').textContent = `Logged in as ${res.data.user.email}`;
    showDashboard(true);
    fetchUsers();
  } catch (err) {
    console.error(err);
    alert('Login failed');
  }
}

function logout() {
  setToken(null);
  document.getElementById('auth-msg').textContent = 'Logged out';
  showDashboard(false);
}

function showDashboard(visible) {
  document.getElementById('dashboard').style.display = visible ? 'block' : 'none';
  document.getElementById('auth').style.display = visible ? 'none' : 'block';
}

// Example Fetch API usage (GET) — shows difference from Axios
async function fetchSample() {
  try {
    const token = getToken();
    const res = await fetch(`${baseURL}/users`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json();
    alert(`Fetched ${data.length} users via Fetch API`);
  } catch (err) { console.error(err); alert('Fetch sample failed'); }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('add-form').addEventListener('submit', addUser);
  document.getElementById('users-table').addEventListener('click', handleTableClick);
  document.getElementById('login-form').addEventListener('submit', login);
  document.getElementById('logout-btn').addEventListener('click', logout);
  document.getElementById('refresh').addEventListener('click', fetchUsers);
  document.getElementById('fetch-sample').addEventListener('click', fetchSample);
  if (getToken()) {
    showDashboard(true);
    fetchUsers();
    document.getElementById('auth-msg').textContent = 'Logged in (token present)';
  }
});
