// Authentication System for MHS Konnect

// ===== USER DATA STORAGE =====
const USERS_KEY = 'mhsKonnectUsers';
const CURRENT_USER_KEY = 'mhsKonnectCurrentUser';

// Get all users from localStorage
function getUsers() {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

// Save users to localStorage
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Get current logged-in user
function getCurrentUser() {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
}

// Save current user session
function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// Clear current user session
function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// ===== AUTHENTICATION FUNCTIONS =====

// Check if user is logged in
function isLoggedIn() {
  return getCurrentUser() !== null;
}

// Show message to user
function showMessage(message, type = 'error') {
  const messageDiv = document.getElementById('auth-message');
  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.className = `auth-message show ${type}`;

    setTimeout(() => {
      messageDiv.classList.remove('show');
    }, 5000);
  }
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ===== SIGN UP FUNCTIONALITY =====
function handleSignup(e) {
  e.preventDefault();

  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm-password').value;
  const age = parseInt(document.getElementById('signup-age').value);
  const agreeTerms = document.getElementById('agree-terms').checked;

  // Validation
  if (!username || !email || !password || !confirmPassword || !age) {
    showMessage('Please fill in all fields', 'error');
    return;
  }

  if (username.length < 3) {
    showMessage('Username must be at least 3 characters long', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showMessage('Please enter a valid email address', 'error');
    return;
  }

  if (password.length < 6) {
    showMessage('Password must be at least 6 characters long', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showMessage('Passwords do not match', 'error');
    return;
  }

  if (age < 13) {
    showMessage('You must be at least 13 years old to sign up', 'error');
    return;
  }

  if (!agreeTerms) {
    showMessage('You must agree to the Terms of Service', 'error');
    return;
  }

  // Check if username or email already exists
  const users = getUsers();
  const existingUser = users.find(u =>
    u.username.toLowerCase() === username.toLowerCase() ||
    u.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    showMessage('Username or email already exists', 'error');
    return;
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    username,
    email,
    password, // In production, this should be hashed!
    age,
    createdAt: new Date().toISOString(),
    profilePic: 'https://via.placeholder.com/150/00ff41/000000?text=' + username.charAt(0).toUpperCase(),
    bio: 'New MHS Konnect user',
    followers: 0,
    following: 0
  };

  users.push(newUser);
  saveUsers(users);

  showMessage('Account created successfully! Redirecting to login...', 'success');

  setTimeout(() => {
    window.location.href = 'login.html';
  }, 2000);
}

// ===== LOGIN FUNCTIONALITY =====
function handleLogin(e) {
  e.preventDefault();

  const usernameOrEmail = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const rememberMe = document.getElementById('remember-me').checked;

  // Validation
  if (!usernameOrEmail || !password) {
    showMessage('Please enter your username/email and password', 'error');
    return;
  }

  // Find user
  const users = getUsers();
  const user = users.find(u =>
    (u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
     u.email.toLowerCase() === usernameOrEmail.toLowerCase()) &&
    u.password === password
  );

  if (!user) {
    showMessage('Invalid username/email or password', 'error');
    return;
  }

  // Save session
  const userSession = {
    id: user.id,
    username: user.username,
    email: user.email,
    profilePic: user.profilePic,
    rememberMe
  };

  setCurrentUser(userSession);

  showMessage('Login successful! Redirecting...', 'success');

  setTimeout(() => {
    window.location.href = 'feed.html';
  }, 1500);
}

// ===== LOGOUT FUNCTIONALITY =====
function logout() {
  clearCurrentUser();
  showMessage('Logged out successfully', 'success');

  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1000);
}

// ===== PAGE PROTECTION =====
function checkAuthRequired() {
  const protectedPages = ['feed.html', 'profile.html', 'upload.html', 'chat.html', 'settings.html'];
  const currentPage = window.location.pathname.split('/').pop();

  if (protectedPages.includes(currentPage) && !isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

// ===== PAGE INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Check if page requires authentication
  checkAuthRequired();

  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Signup form
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }

  // Logout button (if exists on protected pages)
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to logout?')) {
        logout();
      }
    });
  }

  // Display current user info on protected pages
  if (isLoggedIn()) {
    const currentUser = getCurrentUser();
    const userDisplayElements = document.querySelectorAll('.current-user-name');
    userDisplayElements.forEach(el => {
      el.textContent = currentUser.username;
    });

    const userPicElements = document.querySelectorAll('.current-user-pic');
    userPicElements.forEach(el => {
      el.src = currentUser.profilePic;
    });
  }
});

// Export functions for use in other scripts
window.authSystem = {
  isLoggedIn,
  getCurrentUser,
  logout,
  getUsers
};
