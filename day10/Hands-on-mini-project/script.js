const projects = [
    "Aadhaar-Drishti - AI Fraud Detection & Policy Intelligence",
    "Hostel Harmony - AI Powered Smart Hostel Management",
    "PrimeTrade API - Secure REST API with RBAC",
    "RAG PDF Search Engine",
    "AI E-Commerce Recommendation System"
];

const projectList = document.getElementById("project-list");
const themeToggle = document.getElementById("themeToggle");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const body = document.body;

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

function showMessage(message, color) {
    formMessage.textContent = message;
    formMessage.style.color = color;
}

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !phone || !message) {
        showMessage("All fields are required!", "#d93025");
        return;
    }

    if (!validateEmail(email)) {
        showMessage("Please enter a valid email address!", "#d93025");
        return;
    }

    if (!validatePhone(phone)) {
        showMessage("Please enter a valid phone number!", "#d93025");
        return;
    }

    showMessage("Message sent successfully! Thank you.", "#188038");
    contactForm.reset();
});

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