# MHS Connect - Authentication Template & Guide

## Overview
This document explains how user authentication (sign up, log in, accounts) will work when MHS Connect goes live with real users.

---

## Current Status (Phase 1 - Demo)

**What you have now:**
- ✅ Full UI/design for feed, chat, comments
- ✅ Working locally on your computer
- ✅ No real accounts - everyone is "@You"
- ✅ Perfect for testing and development

**What's missing:**
- ❌ User accounts
- ❌ Database
- ❌ Server/backend
- ❌ Real login system

---

## Future Implementation (Phase 2 - Live)

### User Flow Diagram

```
New User Visit
      ↓
┌─────────────────┐
│  Landing Page   │  (Can view feed - read only)
│  MHS CONNECT    │
└─────────────────┘
      ↓
   [Sign Up] ←─────────── Already have account? [Log In]
      ↓                              ↓
┌─────────────────┐          ┌─────────────────┐
│  Sign Up Page   │          │   Login Page    │
│                 │          │                 │
│ Choose method:  │          │ Username/Email  │
│ • Email/Pass    │          │ Password        │
│ • Google        │          │                 │
│ • Facebook      │          │ [Log In]        │
│ • Discord       │          └─────────────────┘
└─────────────────┘                  ↓
      ↓                              ↓
  Create Account              Verify Credentials
      ↓                              ↓
  Email Verify                  ┌────────────┐
      ↓                         │  Success!  │
┌─────────────────┐             └────────────┘
│ Setup Profile   │                   ↓
│ • Username      │             ┌──────────────────┐
│ • Avatar        │             │   MHS Connect    │
│ • Bio           │             │   Full Access    │
└─────────────────┘             │                  │
      ↓                         │ • Post content   │
      ↓                         │ • Comment        │
      └─────────────────────────│ • Chat           │
                                │ • Like/React     │
                                │ • Profile        │
                                └──────────────────┘
```

---

## Sign Up Options

### Option 1: Email/Password Registration

**Sign Up Form:**
```html
<!--- Example Template --->
<div class="signup-container">
  <h2>Join MHS Connect</h2>

  <form id="signupForm">
    <div class="form-group">
      <label>Username</label>
      <input type="text" placeholder="@YourUsername" required>
      <span class="help">This is how others will see you</span>
    </div>

    <div class="form-group">
      <label>Email</label>
      <input type="email" placeholder="you@example.com" required>
    </div>

    <div class="form-group">
      <label>Password</label>
      <input type="password" placeholder="Min 8 characters" required>
      <span class="strength-meter">Strength: Weak</span>
    </div>

    <div class="form-group">
      <label>Confirm Password</label>
      <input type="password" required>
    </div>

    <div class="form-group">
      <label>
        <input type="checkbox" required>
        I agree to Terms of Service
      </label>
    </div>

    <button type="submit">Create Account</button>
  </form>

  <div class="divider">OR</div>

  <button class="social-btn google-btn">
    Sign up with Google
  </button>
  <button class="social-btn facebook-btn">
    Sign up with Facebook
  </button>
</div>
```

**What happens behind the scenes:**
1. User fills form
2. Click "Create Account"
3. JavaScript sends data to backend
4. Backend creates account in database
5. Sends verification email
6. User clicks email link
7. Account activated!

---

### Option 2: Social Login (Google, Facebook, etc.)

**Flow:**
```
User clicks "Sign up with Google"
         ↓
Opens Google login popup
         ↓
User logs into Google
         ↓
Google asks: "Allow MHS Connect access?"
         ↓
User clicks "Allow"
         ↓
Google sends user info to MHS Connect:
  - Name
  - Email
  - Profile picture
         ↓
MHS Connect creates account automatically
         ↓
User is logged in!
```

**Benefits:**
- ✅ No password to remember
- ✅ Faster signup (2 clicks)
- ✅ Secure (Google/Facebook handles it)
- ✅ Avatar auto-imported

---

## Login System

### Login Page Template

```html
<!--- Login Form Template --->
<div class="login-container">
  <h2>Welcome Back!</h2>

  <form id="loginForm">
    <div class="form-group">
      <label>Username or Email</label>
      <input type="text" placeholder="@username or email" required>
    </div>

    <div class="form-group">
      <label>Password</label>
      <input type="password" required>
    </div>

    <div class="form-options">
      <label>
        <input type="checkbox"> Remember me
      </label>
      <a href="forgot-password.html">Forgot password?</a>
    </div>

    <button type="submit">Log In</button>
  </form>

  <div class="divider">OR</div>

  <button class="social-btn google-btn">
    Sign in with Google
  </button>

  <div class="signup-link">
    Don't have an account? <a href="signup.html">Sign up</a>
  </div>
</div>
```

---

## Database Structure

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  bio TEXT,
  join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME,
  verified BOOLEAN DEFAULT FALSE,
  status ENUM('active', 'suspended', 'banned') DEFAULT 'active'
);
```

### Posts Table
```sql
CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  media_type ENUM('video', 'image'),
  media_url VARCHAR(255),
  caption TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Comments Table
```sql
CREATE TABLE comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  parent_comment_id INT,
  comment_text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  likes_count INT DEFAULT 0,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  from_user_id INT NOT NULL,
  to_user_id INT NOT NULL,
  message_text TEXT NOT NULL,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  read_status BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (from_user_id) REFERENCES users(id),
  FOREIGN KEY (to_user_id) REFERENCES users(id)
);
```

---

## Session Management

### How "Staying Logged In" Works

**When user logs in:**
1. Backend verifies username/password
2. Creates session token (like a ticket)
3. Sends token to browser
4. Browser stores token (cookie/localStorage)

**On every page load:**
1. Browser sends token to server
2. Server checks: "Is this token valid?"
3. If yes → User is logged in
4. If no → Redirect to login page

**When user logs out:**
1. Click "Log Out"
2. Delete session token
3. Redirect to login page

**Token example:**
```javascript
{
  userId: 123,
  username: "@PlayerX",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  expiresAt: "2025-11-30 14:30:00"
}
```

---

## Security Essentials

### Password Security
```javascript
// Never store plain passwords!
// Instead, use encryption (hashing)

// User enters: "MyPassword123"
// Database stores: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92lDaB"

// When logging in:
const enteredPassword = "MyPassword123";
const storedHash = "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92lDaB";

// Check if they match (bcrypt library)
const isMatch = bcrypt.compare(enteredPassword, storedHash);
// Returns: true or false
```

### Email Verification
```
1. User signs up
2. Account created but not activated
3. System sends email with link:
   https://mhsconnect.com/verify?token=abc123xyz
4. User clicks link
5. Backend verifies token
6. Account activated!
```

### Prevent Spam/Abuse
- Rate limiting (max 5 login attempts per minute)
- CAPTCHA for suspicious activity
- Email verification required
- Report/block users
- Admin moderation tools

---

## Technology Stack Options

### Easy Option: Firebase (Recommended)
```javascript
// Firebase handles everything!

// Sign up with email
firebase.auth().createUserWithEmailAndPassword(email, password);

// Sign in with Google
firebase.auth().signInWithPopup(googleProvider);

// Check if logged in
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("Logged in as:", user.displayName);
  } else {
    console.log("Not logged in");
  }
});

// Log out
firebase.auth().signOut();
```

**Firebase Benefits:**
- ✅ Free tier (good for starting)
- ✅ Handles all security
- ✅ Social login built-in
- ✅ Email verification included
- ✅ Just add JavaScript code

**Firebase Costs:**
- Free: Up to 50K users
- Paid: $0.0055 per user after that

---

### Advanced Option: Custom Backend

**Tech Stack:**
- Frontend: Your HTML/CSS/JS (what you have now)
- Backend: Node.js + Express
- Database: MySQL or PostgreSQL
- Authentication: Passport.js or JWT

**Example Backend (Node.js):**
```javascript
// signup.js
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save to database
  await db.query(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );

  // Send verification email
  sendVerificationEmail(email);

  res.json({ success: true });
});

// login.js
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Get user from database
  const user = await db.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );

  // Check password
  const isValid = await bcrypt.compare(password, user.password_hash);

  if (isValid) {
    // Create session token
    const token = jwt.sign({ userId: user.id }, SECRET_KEY);
    res.json({ success: true, token });
  } else {
    res.json({ success: false, error: 'Invalid credentials' });
  }
});
```

---

## Profile System

### Profile Page Template

```html
<div class="profile-container">
  <div class="profile-header">
    <img src="avatar.jpg" class="profile-avatar">
    <div class="profile-info">
      <h2>@PlayerX</h2>
      <p class="bio">COD and Battlefield enthusiast 🎮</p>
      <div class="profile-stats">
        <span>123 Posts</span>
        <span>456 Followers</span>
        <span>789 Following</span>
      </div>
      <button class="edit-profile-btn">Edit Profile</button>
    </div>
  </div>

  <div class="profile-tabs">
    <button class="active">Posts</button>
    <button>Comments</button>
    <button>Likes</button>
  </div>

  <div class="profile-posts">
    <!-- User's posts appear here -->
  </div>
</div>
```

### Edit Profile Form
```html
<form id="editProfileForm">
  <div class="form-group">
    <label>Avatar</label>
    <input type="file" accept="image/*">
    <img src="current-avatar.jpg" class="avatar-preview">
  </div>

  <div class="form-group">
    <label>Username</label>
    <input type="text" value="@PlayerX">
  </div>

  <div class="form-group">
    <label>Bio</label>
    <textarea maxlength="150">COD and Battlefield enthusiast 🎮</textarea>
  </div>

  <div class="form-group">
    <label>Email</label>
    <input type="email" value="player@example.com">
  </div>

  <button type="submit">Save Changes</button>
</form>
```

---

## Implementation Timeline

### Phase 1: NOW (Demo/Design)
- ✅ Build UI/design
- ✅ Test features locally
- ✅ Perfect the experience
- ⏱️ **Duration:** As long as you need

### Phase 2: Backend Setup (When Ready)
- Set up Firebase or custom backend
- Connect database
- Implement authentication
- Test with friends
- ⏱️ **Duration:** 1-2 weeks

### Phase 3: Beta Testing
- Invite small group (10-20 users)
- Test real usage
- Fix bugs
- Gather feedback
- ⏱️ **Duration:** 2-4 weeks

### Phase 4: Public Launch
- Open to everyone
- Marketing/promotion
- Monitor performance
- Add features based on feedback
- ⏱️ **Duration:** Ongoing

---

## Costs Estimate (Annual)

### Free Tier (Firebase)
- **Users:** Up to 50,000
- **Database:** 1 GB storage
- **Bandwidth:** 10 GB/month
- **Cost:** $0/year

### Small Community
- **Users:** 100-500
- **Hosting:** Shared hosting
- **Database:** 5 GB
- **Cost:** $50-100/year

### Growing Community
- **Users:** 500-5,000
- **Hosting:** VPS
- **Database:** 25 GB
- **CDN:** For media files
- **Cost:** $300-600/year

### Large Community
- **Users:** 5,000-50,000
- **Dedicated server**
- **Database:** 100 GB+
- **CDN:** Premium
- **Backup/Security**
- **Cost:** $1,200-3,000/year

---

## Privacy & Legal Requirements

### Privacy Policy (Required)
**What you collect:**
- Email addresses
- Usernames
- IP addresses
- Posts/comments
- Messages

**What you do with it:**
- Run the platform
- Send notifications
- Prevent abuse
- NEVER sell to third parties

### Terms of Service (Required)
**User rules:**
- Be respectful
- No spam/abuse
- No illegal content
- Age requirement (13+)
- Content ownership

### GDPR Compliance (If EU users)
- Right to delete account
- Export user data
- Clear consent
- Cookie notice

---

## Next Steps (When You're Ready)

### Step 1: Choose Authentication Method
- [ ] Firebase (recommended for beginners)
- [ ] Custom backend (more control)
- [ ] Social login only
- [ ] Email/password only

### Step 2: Set Up Backend
- [ ] Create Firebase project OR set up server
- [ ] Create database
- [ ] Test authentication locally

### Step 3: Connect Frontend
- [ ] Add login/signup pages
- [ ] Connect forms to backend
- [ ] Test user flow

### Step 4: Deploy
- [ ] Choose hosting (Netlify, Vercel, etc.)
- [ ] Set up domain (mhsconnect.com)
- [ ] SSL certificate (HTTPS)
- [ ] Launch!

---

## Summary

**What you have now:**
Beautiful, fully-designed social platform (UI only)

**What you'll add later:**
Real user accounts, login system, database

**How it works:**
Just like Facebook - users create accounts, log in, post/comment/chat

**When to implement:**
Whenever you're ready! No rush - perfect the design first.

**Cost:**
Can start completely free with Firebase

**Difficulty:**
Medium - But I can help when you're ready!

---

**Questions?** Save this template for future reference when you're ready to add real users!
