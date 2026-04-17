// Authentication Functions

function goSlow(url) {
    if (!url || url === '#' || window.location.href.endsWith(url)) return;
    document.body.classList.add("fade-out");
    setTimeout(() => { window.location.href = url; }, 800);
}


// Show alert message
function showAlert(message, type = 'error') {
    const alertEl = document.getElementById('alertMessage');
    if (!alertEl) return;

    alertEl.textContent = message;
    alertEl.className = `alert ${type}`;
    alertEl.style.display = 'block';

    setTimeout(() => {
        alertEl.style.display = 'none';
    }, 5000);
}

// Helper for legacy showMessage calls
function showMessage(id, text, type = "error") {
    const msg = document.getElementById(id);
    if (!msg) {
        showAlert(text, type);
        return;
    }
    msg.innerText = text;
    msg.className = "alert " + type;
    msg.style.display = "block";
    setTimeout(() => { msg.style.display = "none"; }, 3000);
}

// Toggle password visibility
function togglePassword(inputId = 'password') {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

// Toggle password for login page
function togglePasswordLogin() {
    const input = document.getElementById('password');
    const icon = document.getElementById('eyeIconLogin');

    if (input.type === 'password') {
        input.type = 'text';
        icon.src = 'Eye img/view.png';
        icon.alt = 'Hide password';
    } else {
        input.type = 'password';
        icon.src = 'Eye img/hide.png';
        icon.alt = 'Show password';
    }
}

// Toggle password for signup page (works with old structure)
function togglePasswordOld(inputId, iconElement) {
    const input = document.getElementById(inputId);

    if (input.type === 'password') {
        input.type = 'text';
        iconElement.src = 'Eye img/view.png';
        iconElement.alt = 'Hide password';
    } else {
        input.type = 'password';
        iconElement.src = 'Eye img/hide.png';
        iconElement.alt = 'Show password';
    }
}

// Signup function
async function signup() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showAlert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        showAlert('Password must be at least 6 characters');
        return;
    }

    try {
        const response = await fetch(API.SIGNUP, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (data.success) {
            showAlert('Account created successfully! Redirecting...', 'success');
            setTimeout(() => goSlow('login.html'), 700);
        } else {
            showAlert(data.message || 'Signup failed');
        }
    } catch (error) {
        showAlert('Server error. Please try again later.');
        console.error('Signup error:', error);
    }
}

// Login function
async function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validation
    if (!email || !password) {
        showAlert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch(API.LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            // Store token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.user.name);
            localStorage.setItem('userEmail', data.user.email);
            localStorage.setItem('userId', data.user.id);

            showAlert('Login successful! Redirecting...', 'success');
            setTimeout(() => goSlow('dashboard.html'), 200);
        } else {
            showAlert(data.message || 'Login failed');
        }
    } catch (error) {
        showAlert('Server error. Please try again later.');
        console.error('Login error:', error);
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    goSlow('login.html');
}

// Check if user is authenticated
async function requireAuth() {
    const token = localStorage.getItem('token');

    if (!token) {
        goSlow('login.html');
        return false;
    }

    // Display cached user name instantly
    const userName = localStorage.getItem('userName');
    const userNameEl = document.getElementById('userName');
    if (userNameEl && userName) {
        userNameEl.textContent = `Hi ${userName} 👋🏻`;
    }

    // Fetch latest user data in background to prevent showing older names
    try {
        const data = await apiCall(API.ME);
        if (data.success) {
            localStorage.setItem('userName', data.user.name);
            localStorage.setItem('userEmail', data.user.email);
            if (userNameEl) {
                userNameEl.textContent = `Hi there ${data.user.name} 👋🏻`;
            }
        }
    } catch (e) {
        console.error('Session invalid, logging out', e);
        logout();
        return false;
    }

    return true;
}

// Redirect to dashboard if already logged in
function redirectIfAuthenticated() {
    const token = localStorage.getItem('token');
    if (token) {
        goSlow('dashboard.html');
    }
}
