// Profile Option D - Universal Social Network JavaScript

// ===== LOAD USER PROFILE =====
function loadUniversalProfile() {
  const currentUser = window.authSystem.getCurrentUser();

  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  const users = window.authSystem.getUsers();
  const user = users.find(u => u.id === currentUser.id);

  if (user) {
    // Update avatar
    document.getElementById('profile-avatar-large').src = user.profilePic || currentUser.profilePic;

    // Update display name
    document.getElementById('display-name').textContent = '@' + user.username;

    // Update bio
    document.getElementById('user-bio').textContent = user.bio || 'Gaming enthusiast | Content creator | Living the dream 🎮';

    // Update stats
    document.getElementById('stat-posts').textContent = user.posts || 0;
    document.getElementById('stat-followers').textContent = user.followers || 0;
    document.getElementById('stat-following').textContent = user.following || 0;
    document.getElementById('stat-likes').textContent = formatNumber(user.totalLikes || 0);
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

// ===== TAB NAVIGATION =====
const navTabs = document.querySelectorAll('.nav-tab');
const tabSections = document.querySelectorAll('.tab-section');

navTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetTab = tab.dataset.tab;

    // Remove active class from all tabs and sections
    navTabs.forEach(t => t.classList.remove('active'));
    tabSections.forEach(section => section.classList.remove('active'));

    // Add active class to clicked tab
    tab.classList.add('active');

    // Show corresponding section
    const targetSection = document.querySelector(`[data-tab-section="${targetTab}"]`);
    if (targetSection) {
      targetSection.classList.add('active');
    }
  });
});

// ===== CONTENT FILTER =====
const filterChips = document.querySelectorAll('.filter-chip');

filterChips.forEach(chip => {
  chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;

    // Update active state
    filterChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    // Filter posts (for now just show notification)
    showNotification(`Showing ${filter} posts`, 'info');

    // In a real app, you would filter the .post-card elements here
  });
});

// ===== POST INPUT =====
const postInput = document.getElementById('post-input');

postInput.addEventListener('focus', () => {
  // Could open a full post creation modal here
  showNotification('Post creation coming soon!', 'info');
});

// ===== POST TYPE BUTTONS =====
const postTypeBtns = document.querySelectorAll('.post-type-btn');

postTypeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.title;
    showNotification(`Creating ${type} post...`, 'info');
  });
});

// ===== PROFILE ACTIONS =====
const editProfileBtn = document.getElementById('edit-profile-btn');
const shareProfileBtn = document.getElementById('share-profile-btn');
const messageBtn = document.getElementById('message-btn');

editProfileBtn.addEventListener('click', () => {
  showNotification('Edit profile coming soon!', 'info');
  // Could redirect to settings or open modal
});

shareProfileBtn.addEventListener('click', () => {
  const currentUser = window.authSystem.getCurrentUser();
  const profileUrl = window.location.origin + window.location.pathname + '?user=' + currentUser.username;

  navigator.clipboard.writeText(profileUrl).then(() => {
    showNotification('Profile link copied to clipboard!', 'success');
  }).catch(() => {
    showNotification('Failed to copy link', 'error');
  });
});

messageBtn.addEventListener('click', () => {
  showNotification('Messaging coming soon!', 'info');
});

// ===== CHANGE BANNER =====
const changeBannerBtn = document.getElementById('change-banner-btn');

changeBannerBtn.addEventListener('click', () => {
  showNotification('Banner customization coming soon!', 'info');
});

// ===== PLATFORM CONNECTIONS =====
const platformItems = document.querySelectorAll('.platform-item');

platformItems.forEach(item => {
  item.addEventListener('click', () => {
    const platformName = item.querySelector('.platform-name').textContent;
    const isConnected = item.classList.contains('connected');

    if (isConnected) {
      showNotification(`${platformName} is connected!`, 'success');
    } else {
      showNotification(`Connect your ${platformName} account in settings`, 'info');
    }
  });
});

// ===== POST REACTIONS =====
const reactionBtns = document.querySelectorAll('.reaction-btn');

reactionBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const currentText = btn.textContent;
    const [emoji, count] = currentText.split(' ');
    const newCount = parseInt(count) + 1;

    btn.textContent = `${emoji} ${newCount}`;
    btn.style.color = 'var(--battlefield-primary, #00ff41)';

    setTimeout(() => {
      btn.style.color = '';
    }, 1000);
  });
});

// ===== POST MENU =====
const postMenuBtns = document.querySelectorAll('.post-menu-btn');

postMenuBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    showNotification('Post options: Edit, Delete, Share, Report', 'info');
  });
});

// ===== PLAY VIDEO =====
const videoThumbnails = document.querySelectorAll('.post-video-thumbnail');

videoThumbnails.forEach(thumb => {
  thumb.addEventListener('click', () => {
    showNotification('Playing video...', 'info');
    // Would open video player modal
  });
});

// ===== HIGHLIGHT THUMBNAILS =====
const highlightThumbs = document.querySelectorAll('.highlight-thumb');

highlightThumbs.forEach(thumb => {
  thumb.addEventListener('click', () => {
    showNotification('Opening highlight...', 'info');
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
  const statNumbers = document.querySelectorAll('.stat-number');

  statNumbers.forEach(stat => {
    const target = parseInt(stat.textContent);
    if (target > 0) {
      animateValue(stat, 0, target, 1000);
    }
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
  loadUniversalProfile();

  // Animate stats after a short delay
  setTimeout(() => {
    animateStatsCounters();
  }, 300);

  // Welcome message
  setTimeout(() => {
    showNotification('Welcome to your Universal Profile! 🌍', 'success');
  }, 1000);
});
