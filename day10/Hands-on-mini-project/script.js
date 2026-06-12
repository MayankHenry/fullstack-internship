const projects = [
    "Aadhaar-Drishti - AI Fraud Detection & Policy Intelligence",
    "Hostel Harmony - AI Powered Smart Hostel Management",
    "PrimeTrade API - Secure REST API with RBAC",
    "RAG PDF Search Engine",
    "AI E-Commerce Recommendation System"
];

const projectList = document.getElementById("project-list");
const authForm = document.getElementById("authForm");
const authMessage = document.getElementById("authMessage");
const apiBaseURL = "https://mayank-portfolio-dtwh.onrender.com";

function renderProjects() {
    projects.forEach((project) => {
        const li = document.createElement("li");
        li.textContent = project;
        projectList.appendChild(li);
    });
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^\+?[0-9\s()-]{7,20}$/.test(phone);
}

function showAuthMessage(message, color) {
    if (authMessage) {
        authMessage.textContent = message;
        authMessage.style.color = color;
    }
}

if (authForm) {
    authForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value.trim();

        if (!name || !email || !password) {
            showAuthMessage("All fields are required.", "#d93025");
            return;
        }

        if (!validateEmail(email)) {
            showAuthMessage("Please enter a valid email address.", "#d93025");
            return;
        }

        if (password.length < 6) {
            showAuthMessage("Password must be at least 6 characters.", "#d93025");
            return;
        }

        try {
            const response = await fetch(`${apiBaseURL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const result = await response.json();
            if (!response.ok) {
                showAuthMessage(result.errors?.[0] || "Signup failed.", "#d93025");
                return;
            }

            showAuthMessage("Signup successful! You can now login.", "#188038");
            authForm.reset();
        } catch (error) {
            console.error(error);
            showAuthMessage("Unable to reach backend. Try again later.", "#d93025");
        }
    });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
        event.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

const themeToggle = document.getElementById("themeToggle");
const body = document.body;

function setTheme(isDark) {
    if (isDark) {
        body.classList.add("dark-mode");
        if (themeToggle) {
            themeToggle.textContent = "☀️ Light Mode";
        }
    } else {
        body.classList.remove("dark-mode");
        if (themeToggle) {
            themeToggle.textContent = "🌙 Dark Mode";
        }
    }
}

if (themeToggle) {

    const savedTheme = localStorage.getItem("preferredTheme");

    setTheme(savedTheme === "dark");

    themeToggle.addEventListener("click", () => {

        const isDark = !body.classList.contains("dark-mode");

        setTheme(isDark);

        localStorage.setItem(
            "preferredTheme",
            isDark ? "dark" : "light"
        );

    });

}