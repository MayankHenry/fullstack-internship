# Day 12 Mini Project: Express Info Server

This mini project introduces Express.js, routing, middleware, and static file serving.

## What’s included

- `server.js` — Express server with routes for `/`, `/about`, `/contact`, `/api/users`, and `/weather/:city`.
- `public/index.html` — static home page served by Express.
- `public/contact.html` — static contact page.
- `package.json` — project metadata with `express` dependency.

## How to run

1. Open a terminal in this folder.
2. Install dependencies:

```powershell
npm install
```

3. Start the server:

```powershell
npm start
```

4. Visit in browser:

- `http://localhost:3000/`
- `http://localhost:3000/about`
- `http://localhost:3000/contact`
- `http://localhost:3000/api/users`
- `http://localhost:3000/weather/Delhi`

## Project tasks

- `/` responds with a welcome message.
- `/about` shows project information.
- `/contact` shows contact details.
- `/api/users` returns a JSON array of users.
- Request logging middleware prints each request method and URL.
- Static files are served from `public/`.

## Notes

- To access the static pages, visit `http://localhost:3000/index.html` and `http://localhost:3000/contact.html`.
- The server also supports a sample dynamic route at `/weather/:city`.
