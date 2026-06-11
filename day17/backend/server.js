const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

let users = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', password: 'adminpass' },
  { id: 2, name: 'Alice', email: 'alice@example.com', password: 'alice123' }
];
let nextId = 3;

function generateToken(user) {
  const payload = { id: user.id, email: user.email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '6h' });
}

function authenticateToken(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ message: 'Missing Authorization header' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Malformed Authorization header' });
  const token = parts[1];
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = payload;
    next();
  });
}

app.get('/', (req, res) => {
  res.json({ message: 'Day17 demo backend running' });
});

// Signup (creates a user)
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  if (users.find(u => u.email === email)) return res.status(400).json({ message: 'Email already exists' });
  const user = { id: nextId++, name: name || 'Unnamed', email, password };
  users.push(user);
  const token = generateToken(user);
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const token = generateToken(user);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// Protected CRUD for users
app.get('/users', authenticateToken, (req, res) => {
  const safe = users.map(u => ({ id: u.id, name: u.name, email: u.email }));
  res.json(safe);
});

app.post('/users', authenticateToken, (req, res) => {
  const { name, email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });
  if (users.find(u => u.email === email)) return res.status(400).json({ message: 'Email exists' });
  const user = { id: nextId++, name: name || 'Unnamed', email, password: 'changeme' };
  users.push(user);
  res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

app.put('/users/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { name, email } = req.body;
  if (email && users.find(u => u.email === email && u.id !== id)) return res.status(400).json({ message: 'Email taken' });
  if (name) user.name = name;
  if (email) user.email = email;
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.delete('/users/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  const removed = users.splice(idx, 1)[0];
  res.json({ message: 'Deleted', user: { id: removed.id, name: removed.name, email: removed.email } });
});

app.listen(PORT, () => {
  console.log(`Day17 backend demo running on http://localhost:${PORT}`);
});
