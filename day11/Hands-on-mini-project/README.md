# Day 11 Mini Project: Node.js Hello Server

This mini project introduces Node.js and npm by building a simple HTTP server with native Node.js APIs.

## What’s included

- `hello.js` — first Node.js script that prints a name and the current date.
- `server.js` — simple HTTP server with routes for `/`, `/about`, `/contact`, `/time`, and `/api`.
- `package.json` — project metadata with `chalk` and `moment` dependencies.

## How to run

1. Open a terminal in this folder.
2. Install dependencies:

```bash
npm install
```

3. Run the hello script:

```bash
npm run hello
```

4. Start the server:

```bash
npm start
```

5. Open a browser and visit:

- `http://localhost:3000/`
- `http://localhost:3000/about`
- `http://localhost:3000/contact`
- `http://localhost:3000/time`
- `http://localhost:3000/api`

## Project tasks

- See the server respond with the correct text for `/`, `/about`, and `/contact`.
- The `/time` route returns the current date and time.
- The `/api` route returns JSON data.

## Notes

- `chalk` is used to print colored console output.
- `moment` formats date and time for the `/time` route.
