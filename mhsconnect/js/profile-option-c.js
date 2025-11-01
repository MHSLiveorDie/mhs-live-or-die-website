// Profile Option C - Hybrid JavaScript

// ===== LOAD USER PROFILE =====
function loadHybridProfile() {
  const currentUser = window.authSystem.getCurrentUser();

  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  const users = window.authSystem.getUsers();
  const user = users.find(u => u.id === currentUser.id);

  if (user) {
    // Update avatar
    document.getElementById('profile-avatar').src = user.profilePic || currentUser.profilePic;

    // Update username
    document.getElementById('username').textContent = '@' + user.username;

    // Update bio
    document.getElementById('bio').textContent = user.bio || 'Gaming enthusiast | Content creator | Living the dream 🎮';

    // Update quick stats
    document.getElementById('stat-posts').textContent = user.posts || 0;
    document.getElementById('stat-followers').textContent = user.followers || 0;
    document.getElementById('stat-following').textContent = user.following || 0;
    document.getElementById('stat-likes').textContent = formatNumber(user.totalLikes || 0);

    // Calculate and update level
    const level = calculateLevel(user);
    document.getElementById('level-circle').textContent = level;

    // Update rank title
    const rankTitle = getRankTitle(level);
    document.querySelector('.level-rank').textContent = rankTitle;
  }
}

// ===== HELPER FUNCTIONS =====
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function calculateLevel(user) {
  const xp = (user.posts || 0) * 50 +
             (user.totalLikes || 0) * 10 +
             (user.followers || 0) * 20 +
             (user.streak || 0) * 25;

  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

function getRankTitle(level) {
  if (level >= 50) return '👑 Legend';
  if (level >= 40) return '💎 Diamond';
  if (level >= 30) return '🏅 Platinum';
  if (level >= 20) return '🥇 Gold';
  if (level >= 15) return '🏆 Elite Gamer';
  if (level >= 10) return '⭐ Rising Star';
  if (level >= 5) return '🎮 Active Player';
  return '🌱 Newbie';
}

// ===== TAB FUNCTIONALITY =====
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.dataset.tab;

    // Remove active class from all buttons and panes
    tabButtons.forEach(b => b.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));

    // Add active class to clicked button
    btn.classList.add('active');

    // Show corresponding pane
    const targetPane = document.querySelector(`[data-tab-pane="${targetTab}"]`);
    if (targetPane) {
      targetPane.classList.add('active');
    }
  });
});

// ===== EDIT PROFILE =====
const editProfileBtn = document.getElementById('edit-profile');

editProfileBtn.addEventListener('click', () => {
  showNotification('Edit profile functionality coming soon!', 'info');
  // You can redirect to settings or open modal
  // window.location.href = 'settings.html';
});

// ===== SHARE PROFILE =====
const shareProfileBtn = document.getElementById('share-profile');

shareProfileBtn.addEventListener('click', () => {
  const currentUser = window.authSystem.getCurrentUser();
  const profileUrl = window.location.origin + window.location.pathname + '?user=' + currentUser.username;

  navigator.clipboard.writeText(profileUrl).then(() => {
    showNotification('Profile link copied to clipboard!', 'success');
  }).catch(() => {
    showNotification('Failed to copy link', 'error');
  });
});

// ===== CHANGE AVATAR =====
const changeAvatarBtn = document.getElementById('change-avatar-btn');

changeAvatarBtn.addEventListener('click', (e) => {
  e.stopPropagation();

  const newAvatarUrl = prompt('Enter new profile picture URL:');

  if (newAvatarUrl && newAvatarUrl.trim()) {
    const currentUser = window.authSystem.getCurrentUser();
    const users = window.authSystem.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
      users[userIndex].profilePic = newAvatarUrl.trim();
      localStorage.setItem('mhsKonnectUsers', JSON.stringify(users));

      currentUser.profilePic = newAvatarUrl.trim();
      localStorage.setItem('mhsKonnectCurrentUser', JSON.stringify(currentUser));

      loadHybridProfile();
      showNotification('Profile picture updated!', 'success');
    }
  }
});

// ===== VIDEO CARDS CLICK =====
const videoCards = document.querySelectorAll('.video-grid-card');

videoCards.forEach(card => {
  card.addEventListener('click', () => {
    showNotification('Opening video...', 'info');
    // Navigate to video or open modal
  });
});

// ===== BADGE MINI CLICK =====
const badgeMinis = document.querySelectorAll('.badge-mini');

badgeMinis.forEach(badge => {
  badge.addEventListener('click', () => {
    // Switch to About tab
    tabButtons.forEach(b => b.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));

    const aboutTab = document.querySelector('[data-tab="about"]');
    const aboutPane = document.querySelector('[data-tab-pane="about"]');

    if (aboutTab && aboutPane) {
      aboutTab.classList.add('active');
      aboutPane.classList.add('active');
      showNotification('Viewing achievement details', 'info');
    }
  });
});

// ===== TAG CLICK =====
const tags = document.querySelectorAll('.tag');

tags.forEach(tag => {
  tag.addEventListener('click', () => {
    const game = tag.textContent;
    showNotification(`Searching for ${game} content...`, 'info');
  });
});

// ===== BADGE ITEM CLICK =====
const badgeItems = document.querySelectorAll('.badge-item');

badgeItems.forEach(item => {
  item.addEventListener('click', () => {
    const badgeName = item.querySelector('.badge-name').textContent;
    const badgeDesc = item.querySelector('.badge-desc').textContent;
    showNotification(`${badgeName}: ${badgeDesc}`, 'success');
  });
});

// ===== SOCIAL LINK CLICK =====
const socialLinks = document.querySelectorAll('.social-link-item');

socialLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const platform = link.textContent.trim().split(':')[0];
    showNotification(`Connect your ${platform} in settings`, 'info');
  });
});

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: ${type === 'success' ? 'rgba(0, 255, 65, 0.15)' : type === 'error' ? 'rgba(255, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.1)'};
    border: 2px solid ${type === 'success' ? '#00ff41' : type === 'error' ? '#ff0000' : '#fff'};
    color: ${type === 'success' ? '#00ff41' : type === 'error' ? '#ff0000' : '#fff'};
    padding: 16px 24px;
    border-radius: 10px;
    font-family: var(--font-primary, 'Orbitron', sans-serif);
    font-weight: 600;
    font-size: 0.95rem;
    z-index: 10000;
    animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
    box-shadow: 0 0 20px ${type === 'success' ? 'rgba(0, 255, 65, 0.3)' : type === 'error' ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ===== STATS COUNTER ANIMATION =====
function animateStatsCounters() {
  const statNums = document.querySelectorAll('.stat-num');

  statNums.forEach(stat => {
    const target = parseInt(stat.textContent);
    animateValue(stat, 0, target, 1000);
  });
}

function animateValue(element, start, end, duration) {
  let startTimestamp = null;

  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const current = Math.floor(progress * (end - start) + start);

    element.textContent = current;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = end;
    }
  };

  window.requestAnimationFrame(step);
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  loadHybridProfile();

  // Animate stats after a short delay
  setTimeout(() => {
    animateStatsCounters();
  }, 300);
});
