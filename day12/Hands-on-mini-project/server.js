const express = require('express');
const path = require('path');
const app = express();

// Built-in middleware for JSON body parsing
app.use(express.json());

// Custom middleware: log method, URL, and timestamp
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  next();
});

// Static files from public/
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Welcome to the Express Info Server!');
});

app.get('/about', (req, res) => {
  res.send('About Page: This server demonstrates Express routing and middleware.');
});

app.get('/contact', (req, res) => {
  res.send('Contact Page: Email me at intern@example.com');
});

app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'Rahul' },
    { id: 2, name: 'Aditi' }
  ];
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const newUser = req.body;
  if (!newUser || !newUser.name) {
    return res.status(400).json({ error: 'User name is required' });
  }

  newUser.id = Math.floor(Math.random() * 1000) + 3;
  res.status(201).json(newUser);
});

app.get('/weather/:city', (req, res) => {
  const { city } = req.params;
  res.json({ city, temp: '30°C' });
});

app.listen(3000, () => {
  console.log('Express server running at http://localhost:3000');
});
