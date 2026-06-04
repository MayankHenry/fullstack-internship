const http = require('http');
const chalk = require('chalk');
const moment = require('moment');

const server = http.createServer((req, res) => {
  const url = req.url;

  if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to My First Node.js Server');
    return;
  }

  if (url === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('About Page');
    return;
  }

  if (url === '/contact') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Contact Page');
    return;
  }

  if (url === '/time') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Current date and time: ${moment().format('LLLL')}`);
    return;
  }

  if (url === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const response = {
      message: 'Hello from Node.js API',
      timestamp: new Date().toISOString(),
    };
    res.end(JSON.stringify(response, null, 2));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Page not found');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(chalk.green(`Server running at http://localhost:${PORT}`));
});
