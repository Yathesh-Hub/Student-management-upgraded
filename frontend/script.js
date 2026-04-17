// ── Helpers ──────────────────────────────────────────────────────────────────

function goSlow(url) {
  document.body.classList.add("fade-out");
  setTimeout(() => { window.location.href = url; }, 800);
}

function showMessage(id, text, type = "error") {
  const msg = document.getElementById(id);
  if (!msg) return;
  msg.innerText = text;
  msg.className = "alert " + type;
  msg.style.display = "block";
  setTimeout(() => { msg.style.display = "none"; }, 3000);
}

function togglePassword(id, icon) {
  const input = document.getElementById(id);
  if (input.type === "password") {
    input.type = "text";
    icon.src = "Eye img/view.png";
    icon.alt = "Hide password";
  } else {
    input.type = "password";
    icon.src = "Eye img/hide.png";
    icon.alt = "Show password";
  }
}

// ── IMPORTANT FIX (NO LOCALHOST) ─────────────────────────────────────────────

const API = "http://ec2-18-139-161-32.ap-southeast-1.compute.amazonaws.com:5000";
// OR: const API = "http://54.255.237.141:5000";

// ── SIGNUP ───────────────────────────────────────────────────────────────────

async function signup() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("Password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!name || !email || !password || !confirmPassword) {
    showMessage("signupMsg", "Please fill in all fields.");
    return;
  }

  if (password !== confirmPassword) {
    showMessage("signupMsg", "Passwords do not match.");
    return;
  }

  if (password.length < 6) {
    showMessage("signupMsg", "Password must be at least 6 characters.");
    return;
  }

  try {
    const res = await fetch(`${API}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (data.message === "User registered successfully") {
      showMessage("signupMsg", "Account created! Redirecting…", "success");
      setTimeout(() => goSlow("login.html"), 1200);
    } else {
      showMessage("signupMsg", data.message);
    }

  } catch (err) {
    showMessage("signupMsg", "Server error. Backend not reachable.");
  }
}

// ── LOGIN ────────────────────────────────────────────────────────────────────

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.message === "Login successful") {
      localStorage.setItem("loggedIn", email);
      localStorage.setItem("loggedInName", data.name || email);
      localStorage.setItem("userId", data.userId);

      goSlow("index.html");
    } else {
      showMessage("msg", data.message);
    }

  } catch (err) {
    showMessage("msg", "Server error. Backend not reachable.");
  }
}

// ── LOGOUT ───────────────────────────────────────────────────────────────────

function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("loggedInName");
  localStorage.removeItem("userId");
  goSlow("login.html");
}

// ── AUTH GUARD ───────────────────────────────────────────────────────────────

function requireAuth() {
  if (!localStorage.getItem("loggedIn")) {
    window.location.href = "login.html";
    return;
  }

  const name = localStorage.getItem("loggedInName");
  const el = document.getElementById("welcomeUser");

  if (el && name) {
    el.innerText = "Hi, " + name + " 👋";
  }
}
