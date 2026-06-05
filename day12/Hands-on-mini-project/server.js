const express = require("express");
const app = express();
const path = require("path");

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Route for home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route for contact page
app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "contact.html"));
});

// 404 handler
app.use((req, res) => {
    res.status(404).send("<h1>404 - Page Not Found</h1>");
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✓ Server running at http://localhost:${PORT}`);
});
