const API = "http://localhost:5000/api";

const authOverlay = document.getElementById("authOverlay");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const authMessage = document.getElementById("authMessage");
const showLogin = document.getElementById("showLogin");
const showSignup = document.getElementById("showSignup");
const closeAuth = document.getElementById("closeAuth");
const openLoginBtn = document.getElementById("openLoginBtn");
const openSignupBtn = document.getElementById("openSignupBtn");
const guestNav = document.getElementById("guestNav");
const userNav = document.getElementById("userNav");
const userBadge = document.getElementById("userBadge");
const logoutBtn = document.getElementById("logoutBtn");
const newPostBtn = document.getElementById("newPostBtn");
const myPostsBtn = document.getElementById("myPostsBtn");
const goHome = document.getElementById("goHome");
const globalSearch = document.getElementById("globalSearch");

const feedView = document.getElementById("feedView");
const postFeed = document.getElementById("postFeed");
const singlePostView = document.getElementById("singlePostView");
const fullPost = document.getElementById("fullPost");
const backToFeed = document.getElementById("backToFeed");
const commentForm = document.getElementById("commentForm");
const commentText = document.getElementById("commentText");
const commentsList = document.getElementById("commentsList");
const loginToComment = document.getElementById("loginToComment");

const editorView = document.getElementById("editorView");
const editorTitle = document.getElementById("editorTitle");
const postForm = document.getElementById("postForm");
const postId = document.getElementById("postId");
const postTitleInput = document.getElementById("postTitleInput");
const postExcerptInput = document.getElementById("postExcerptInput");
const postTagsInput = document.getElementById("postTagsInput");
const postContentInput = document.getElementById("postContentInput");
const backFromEditor = document.getElementById("backFromEditor");

let currentView = "feed";
let showingMyPosts = false;

function getToken() {
  return localStorage.getItem("blogToken");
}

function getUser() {
  return JSON.parse(localStorage.getItem("blogUser") || "null");
}

function setSession(data) {
  localStorage.setItem("blogToken", data.token);
  localStorage.setItem("blogUser", JSON.stringify(data.user));
}

function clearSession() {
  localStorage.removeItem("blogToken");
  localStorage.removeItem("blogUser");
}

async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function updateNav() {
  const user = getUser();
  if (user) {
    guestNav.classList.add("hidden");
    userNav.classList.remove("hidden");
    userBadge.textContent = user.name.charAt(0).toUpperCase();
    commentForm.classList.remove("hidden");
    loginToComment.classList.add("hidden");
  } else {
    guestNav.classList.remove("hidden");
    userNav.classList.add("hidden");
    commentForm.classList.add("hidden");
    loginToComment.classList.remove("hidden");
  }
}

function switchView(view) {
  feedView.classList.add("hidden");
  singlePostView.classList.add("hidden");
  editorView.classList.add("hidden");

  if (view === "feed") feedView.classList.remove("hidden");
  if (view === "single") singlePostView.classList.remove("hidden");
  if (view === "editor") editorView.classList.remove("hidden");

  currentView = view;
  window.scrollTo(0, 0);
}

function switchAuth(mode) {
  const isLogin = mode === "login";
  loginForm.classList.toggle("hidden", !isLogin);
  signupForm.classList.toggle("hidden", isLogin);
  showLogin.classList.toggle("active", isLogin);
  showSignup.classList.toggle("active", !isLogin);
  authMessage.textContent = "";
}

async function loadFeed() {
  const params = new URLSearchParams();
  const search = globalSearch.value.trim();
  if (search) params.set("search", search);

  const user = getUser();
  if (showingMyPosts && user) params.set("author", user.id);

  try {
    const posts = await api(`/posts?${params.toString()}`);
    renderFeed(posts);
  } catch (error) {
    postFeed.innerHTML = '<div class="empty">Could not load posts.</div>';
  }
}

function renderFeed(posts) {
  if (!posts.length) {
    postFeed.innerHTML = '<div class="empty">No posts yet. Be the first to write something.</div>';
    return;
  }

  const user = getUser();

  postFeed.innerHTML = posts
    .map((post) => {
      const isOwner = user && post.author && post.author._id === user.id;
      const tags = (post.tags || [])
        .map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`)
        .join("");

      let actions = "";
      if (isOwner) {
        actions = `
          <div class="post-card-actions">
            <button type="button" class="btn-sm" data-action="edit" data-id="${post._id}">Edit</button>
            <button type="button" class="btn-sm danger" data-action="delete" data-id="${post._id}">Delete</button>
          </div>
        `;
      }

      return `
        <article class="post-card" data-post-id="${post._id}">
          <h3>${escapeHtml(post.title)}</h3>
          <p>${escapeHtml(post.excerpt || post.content.substring(0, 150))}</p>
          <div class="post-meta">
            <span class="author">${escapeHtml(post.author?.name || "Unknown")}</span>
            <span>${formatDate(post.createdAt)}</span>
            ${tags}
          </div>
          ${actions}
        </article>
      `;
    })
    .join("");
}

async function openPost(id) {
  try {
    const post = await api(`/posts/${id}`);
    const user = getUser();
    const isOwner = user && post.author && post.author._id === user.id;
    const tags = (post.tags || [])
      .map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`)
      .join("");

    let actions = "";
    if (isOwner) {
      actions = `
        <div class="post-card-actions">
          <button type="button" class="btn-sm" data-action="edit" data-id="${post._id}">Edit</button>
          <button type="button" class="btn-sm danger" data-action="delete" data-id="${post._id}">Delete</button>
        </div>
      `;
    }

    fullPost.innerHTML = `
      <h1>${escapeHtml(post.title)}</h1>
      <div class="post-meta">
        <span class="author">${escapeHtml(post.author?.name || "Unknown")}</span>
        <span>${formatDate(post.createdAt)}</span>
        ${tags}
      </div>
      ${actions}
      <div class="post-body">${escapeHtml(post.content)}</div>
    `;

    fullPost.dataset.postId = post._id;
    switchView("single");
    loadComments(post._id);
  } catch (error) {
    alert("Could not load post");
  }
}

async function loadComments(postId) {
  try {
    const comments = await api(`/comments/${postId}`);
    renderComments(comments);
  } catch (error) {
    commentsList.innerHTML = "";
  }
}

function renderComments(comments) {
  if (!comments.length) {
    commentsList.innerHTML = '<div class="empty">No comments yet.</div>';
    return;
  }

  const user = getUser();

  commentsList.innerHTML = comments
    .map((c) => {
      const isOwner = user && c.author && c.author._id === user.id;
      const deleteBtn = isOwner
        ? `<button type="button" class="btn-sm danger" data-action="delete-comment" data-id="${c._id}">Delete</button>`
        : "";

      return `
        <div class="comment-item">
          <div class="comment-head">
            <strong>${escapeHtml(c.author?.name || "Unknown")}</strong>
            <span>${formatDate(c.createdAt)}</span>
          </div>
          <p>${escapeHtml(c.text)}</p>
          ${deleteBtn}
        </div>
      `;
    })
    .join("");
}

function openEditor(post) {
  if (post) {
    editorTitle.textContent = "Edit Post";
    postId.value = post._id;
    postTitleInput.value = post.title;
    postExcerptInput.value = post.excerpt || "";
    postTagsInput.value = (post.tags || []).join(", ");
    postContentInput.value = post.content;
  } else {
    editorTitle.textContent = "New Post";
    postId.value = "";
    postForm.reset();
  }
  switchView("editor");
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
    updateNav();
    authOverlay.classList.add("hidden");
    loginForm.reset();
    loadFeed();
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
    updateNav();
    authOverlay.classList.add("hidden");
    signupForm.reset();
    loadFeed();
  } catch (error) {
    authMessage.textContent = error.message;
  }
});

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const tagsRaw = postTagsInput.value;
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const payload = {
    title: postTitleInput.value,
    content: postContentInput.value,
    excerpt: postExcerptInput.value,
    tags
  };

  try {
    if (postId.value) {
      await api(`/posts/${postId.value}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
    } else {
      await api("/posts", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    }

    postForm.reset();
    postId.value = "";
    switchView("feed");
    loadFeed();
  } catch (error) {
    alert(error.message);
  }
});

commentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const currentPostId = fullPost.dataset.postId;
  if (!currentPostId) return;

  try {
    await api(`/comments/${currentPostId}`, {
      method: "POST",
      body: JSON.stringify({ text: commentText.value })
    });
    commentText.value = "";
    loadComments(currentPostId);
  } catch (error) {
    alert(error.message);
  }
});

postFeed.addEventListener("click", async (event) => {
  const button = event.target.closest("button");

  if (button && button.dataset.action === "edit") {
    event.stopPropagation();
    try {
      const post = await api(`/posts/${button.dataset.id}`);
      openEditor(post);
    } catch (error) {
      alert("Could not load post for editing");
    }
    return;
  }

  if (button && button.dataset.action === "delete") {
    event.stopPropagation();
    if (!confirm("Delete this post?")) return;
    try {
      await api(`/posts/${button.dataset.id}`, { method: "DELETE" });
      loadFeed();
    } catch (error) {
      alert("Could not delete post");
    }
    return;
  }

  const card = event.target.closest(".post-card");
  if (card) {
    openPost(card.dataset.postId);
  }
});

fullPost.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.action === "edit") {
    try {
      const post = await api(`/posts/${button.dataset.id}`);
      openEditor(post);
    } catch (error) {
      alert("Could not load post for editing");
    }
  }

  if (button.dataset.action === "delete") {
    if (!confirm("Delete this post?")) return;
    try {
      await api(`/posts/${button.dataset.id}`, { method: "DELETE" });
      switchView("feed");
      loadFeed();
    } catch (error) {
      alert("Could not delete post");
    }
  }
});

commentsList.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button || button.dataset.action !== "delete-comment") return;

  if (!confirm("Delete this comment?")) return;

  try {
    await api(`/comments/${button.dataset.id}`, { method: "DELETE" });
    loadComments(fullPost.dataset.postId);
  } catch (error) {
    alert("Could not delete comment");
  }
});

openLoginBtn.addEventListener("click", () => {
  switchAuth("login");
  authOverlay.classList.remove("hidden");
});

openSignupBtn.addEventListener("click", () => {
  switchAuth("signup");
  authOverlay.classList.remove("hidden");
});

closeAuth.addEventListener("click", () => {
  authOverlay.classList.add("hidden");
  authMessage.textContent = "";
});

authOverlay.addEventListener("click", (event) => {
  if (event.target === authOverlay) {
    authOverlay.classList.add("hidden");
    authMessage.textContent = "";
  }
});

showLogin.addEventListener("click", () => switchAuth("login"));
showSignup.addEventListener("click", () => switchAuth("signup"));

logoutBtn.addEventListener("click", () => {
  clearSession();
  updateNav();
  showingMyPosts = false;
  switchView("feed");
  loadFeed();
});

newPostBtn.addEventListener("click", () => openEditor(null));

myPostsBtn.addEventListener("click", () => {
  showingMyPosts = !showingMyPosts;
  myPostsBtn.textContent = showingMyPosts ? "All Posts" : "My Posts";
  switchView("feed");
  loadFeed();
});

goHome.addEventListener("click", (event) => {
  event.preventDefault();
  showingMyPosts = false;
  myPostsBtn.textContent = "My Posts";
  globalSearch.value = "";
  switchView("feed");
  loadFeed();
});

backToFeed.addEventListener("click", () => {
  switchView("feed");
  loadFeed();
});

backFromEditor.addEventListener("click", () => {
  switchView("feed");
});

let searchTimer;
globalSearch.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    if (currentView !== "feed") switchView("feed");
    loadFeed();
  }, 350);
});

updateNav();
loadFeed();
