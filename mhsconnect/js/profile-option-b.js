// Profile Option B - Gaming Dashboard JavaScript

// ===== LOAD USER DASHBOARD =====
function loadDashboard() {
  const currentUser = window.authSystem.getCurrentUser();

  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  // Get full user data
  const users = window.authSystem.getUsers();
  const user = users.find(u => u.id === currentUser.id);

  if (user) {
    // Update avatar
    document.getElementById('profile-avatar').src = user.profilePic || currentUser.profilePic;

    // Update gamer tag
    document.getElementById('gamer-tag').textContent = '@' + user.username;

    // Update member date
    if (user.createdAt) {
      const date = new Date(user.createdAt);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      document.getElementById('member-date').textContent = monthYear;
    }

    // Update stats
    document.getElementById('total-posts').textContent = user.posts || 0;
    document.getElementById('total-likes').textContent = formatNumber(user.totalLikes || 0);
    document.getElementById('total-followers').textContent = user.followers || 0;
    document.getElementById('streak-days').textContent = user.streak || 0;

    // Calculate and display level
    const level = calculateLevel(user);
    document.getElementById('level-badge').textContent = level;

    // Update rank title based on level
    const rankTitle = getRankTitle(level);
    document.getElementById('rank-title').textContent = rankTitle;
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
  // Calculate level based on XP
  // XP = (posts * 50) + (likes * 10) + (followers * 20) + (streak * 25)
  const xp = (user.posts || 0) * 50 +
             (user.totalLikes || 0) * 10 +
             (user.followers || 0) * 20 +
             (user.streak || 0) * 25;

  // Level formula: Level = floor(sqrt(XP / 100)) + 1
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

// ===== EDIT DASHBOARD BUTTON =====
const editDashboardBtn = document.getElementById('edit-dashboard-btn');

editDashboardBtn.addEventListener('click', () => {
  showNotification('Dashboard editing coming soon!', 'info');
  // You can redirect to settings or open an edit modal
  // window.location.href = 'settings.html';
});

// ===== ACTIVITY FILTER =====
const activityFilter = document.getElementById('activity-filter');

activityFilter.addEventListener('change', (e) => {
  const period = e.target.value;
  showNotification(`Showing activity for: ${period}`, 'info');
  // Here you would update the graph based on the selected time period
  // For now, just show notification
});

// ===== GRAPH BAR INTERACTIONS =====
const graphBars = document.querySelectorAll('.graph-bar');

graphBars.forEach(bar => {
  bar.addEventListener('click', () => {
    const day = bar.dataset.day;
    const value = bar.dataset.value;
    showNotification(`${day}: ${value} posts`, 'info');
  });
});

// ===== ACHIEVEMENT BADGES =====
const achievementBadges = document.querySelectorAll('.achievement-badge');

achievementBadges.forEach(badge => {
  badge.addEventListener('click', () => {
    if (badge.classList.contains('earned')) {
      const badgeName = badge.querySelector('.badge-name').textContent;
      showNotification(`Achievement unlocked: ${badgeName}!`, 'success');
    } else {
      showNotification('This achievement is locked. Keep playing to unlock it!', 'info');
    }
  });
});

// ===== RECENT VIDEOS =====
const recentVideoItems = document.querySelectorAll('.recent-video-item');

recentVideoItems.forEach(item => {
  item.addEventListener('click', () => {
    showNotification('Opening video...', 'info');
    // Navigate to video or open modal
  });
});

// ===== SOCIAL LINKS =====
const socialLinks = document.querySelectorAll('.social-link');

socialLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const platform = link.querySelector('span:last-child').textContent;
    showNotification(`Connect your ${platform} account in settings`, 'info');
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

// ===== LEVEL PROGRESS ANIMATION =====
function animateLevelProgress() {
  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) {
    const targetWidth = progressFill.style.width;
    progressFill.style.width = '0%';

    setTimeout(() => {
      progressFill.style.width = targetWidth;
    }, 500);
  }
}

// ===== ACHIEVEMENT UNLOCK ANIMATION =====
function checkNewAchievements() {
  const currentUser = window.authSystem.getCurrentUser();
  const users = window.authSystem.getUsers();
  const user = users.find(u => u.id === currentUser.id);

  if (user) {
    // Check for new achievements based on user stats
    const level = calculateLevel(user);

    // Example: Check if user just hit level 10
    if (level >= 10 && !user.achievements?.includes('level10')) {
      showNotification('🎉 Achievement Unlocked: Level 10!', 'success');

      // Save achievement (you would do this in a real app)
      // user.achievements = user.achievements || [];
      // user.achievements.push('level10');
      // saveUsers(users);
    }
  }
}

// ===== INITIALIZE DASHBOARD =====
document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  animateLevelProgress();
  checkNewAchievements();
});

// ===== STATS ANIMATION ON SCROLL =====
function animateStatsOnScroll() {
  const stats = document.querySelectorAll('.stat-value');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = parseInt(target.textContent);

        animateValue(target, 0, finalValue, 1000);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
}

function animateValue(element, start, end, duration) {
  let startTimestamp = null;

  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const current = Math.floor(progress * (end - start) + start);

    element.textContent = formatNumber(current);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = formatNumber(end);
    }
  };

  window.requestAnimationFrame(step);
}

// Initialize scroll animations
setTimeout(() => {
  animateStatsOnScroll();
}, 500);
