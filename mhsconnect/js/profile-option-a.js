// Profile Option A - Clean Grid Layout JavaScript

// ===== LOAD USER PROFILE =====
function loadUserProfile() {
  const currentUser = window.authSystem.getCurrentUser();

  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  // Get full user data from storage
  const users = window.authSystem.getUsers();
  const user = users.find(u => u.id === currentUser.id);

  if (user) {
    // Update profile picture
    document.getElementById('profile-pic').src = user.profilePic || currentUser.profilePic;

    // Update username
    document.getElementById('profile-username').textContent = '@' + user.username;

    // Update bio
    const bioText = user.bio || 'No bio yet. Click Edit Profile to add one!';
    document.getElementById('profile-bio-text').textContent = bioText;

    // Update stats
    document.getElementById('posts-count').textContent = user.posts || 0;
    document.getElementById('followers-count').textContent = user.followers || 0;
    document.getElementById('following-count').textContent = user.following || 0;
  }
}

// ===== EDIT PROFILE MODAL =====
const editProfileBtn = document.getElementById('edit-profile-btn');
const editModal = document.getElementById('edit-profile-modal');
const closeModal = document.getElementById('close-modal');
const cancelEdit = document.getElementById('cancel-edit');
const saveProfile = document.getElementById('save-profile');
const editBio = document.getElementById('edit-bio');
const bioCount = document.getElementById('bio-count');

// Open modal
editProfileBtn.addEventListener('click', () => {
  const currentUser = window.authSystem.getCurrentUser();
  const users = window.authSystem.getUsers();
  const user = users.find(u => u.id === currentUser.id);

  if (user) {
    document.getElementById('edit-profile-pic').value = user.profilePic || '';
    document.getElementById('edit-bio').value = user.bio || '';
    bioCount.textContent = (user.bio || '').length;
  }

  editModal.classList.add('show');
});

// Close modal
function closeEditModal() {
  editModal.classList.remove('show');
}

closeModal.addEventListener('click', closeEditModal);
cancelEdit.addEventListener('click', closeEditModal);

// Close modal on outside click
editModal.addEventListener('click', (e) => {
  if (e.target === editModal) {
    closeEditModal();
  }
});

// Bio character counter
editBio.addEventListener('input', (e) => {
  bioCount.textContent = e.target.value.length;
});

// Save profile changes
saveProfile.addEventListener('click', () => {
  const currentUser = window.authSystem.getCurrentUser();
  const users = window.authSystem.getUsers();
  const userIndex = users.findIndex(u => u.id === currentUser.id);

  if (userIndex !== -1) {
    const newProfilePic = document.getElementById('edit-profile-pic').value.trim();
    const newBio = document.getElementById('edit-bio').value.trim();

    // Update user data
    if (newProfilePic) {
      users[userIndex].profilePic = newProfilePic;
    }
    users[userIndex].bio = newBio;

    // Save to localStorage
    localStorage.setItem('mhsKonnectUsers', JSON.stringify(users));

    // Update current session
    if (newProfilePic) {
      currentUser.profilePic = newProfilePic;
      localStorage.setItem('mhsKonnectCurrentUser', JSON.stringify(currentUser));
    }

    // Reload profile
    loadUserProfile();

    // Close modal
    closeEditModal();

    // Show success message
    showNotification('Profile updated successfully!', 'success');
  }
});

// ===== SHARE PROFILE =====
const shareProfileBtn = document.getElementById('share-profile-btn');

shareProfileBtn.addEventListener('click', () => {
  const currentUser = window.authSystem.getCurrentUser();
  const profileUrl = window.location.origin + window.location.pathname + '?user=' + currentUser.username;

  // Copy to clipboard
  navigator.clipboard.writeText(profileUrl).then(() => {
    showNotification('Profile link copied to clipboard!', 'success');
  }).catch(() => {
    showNotification('Failed to copy link', 'error');
  });
});

// ===== FILTER VIDEOS =====
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    filterBtns.forEach(b => b.classList.remove('active'));

    // Add active class to clicked button
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    // Here you would filter/sort the videos grid based on the filter
    // For now, just show notification
    showNotification(`Showing ${filter} posts`, 'info');
  });
});

// ===== VIDEO CARD CLICK =====
const videoCards = document.querySelectorAll('.video-card');

videoCards.forEach(card => {
  card.addEventListener('click', () => {
    // Navigate to video view or open video modal
    showNotification('Opening video...', 'info');
    // You can redirect to feed.html or open a modal with the video
  });
});

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
  // Remove existing notification
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Style notification
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

  // Remove after 3 seconds
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

// ===== CHANGE PROFILE PICTURE =====
const changePicBtn = document.getElementById('change-pic-btn');

changePicBtn.addEventListener('click', (e) => {
  e.stopPropagation();

  const newPicUrl = prompt('Enter new profile picture URL:');

  if (newPicUrl && newPicUrl.trim()) {
    const currentUser = window.authSystem.getCurrentUser();
    const users = window.authSystem.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
      users[userIndex].profilePic = newPicUrl.trim();
      localStorage.setItem('mhsKonnectUsers', JSON.stringify(users));

      currentUser.profilePic = newPicUrl.trim();
      localStorage.setItem('mhsKonnectCurrentUser', JSON.stringify(currentUser));

      loadUserProfile();
      showNotification('Profile picture updated!', 'success');
    }
  }
});

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  loadUserProfile();

  // Check if user has posts - if not, show empty state
  const videosGrid = document.getElementById('videos-grid');
  const emptyState = document.getElementById('empty-state');

  // For now, we'll show the grid with sample videos
  // Later, you can check actual user posts and toggle visibility
  // if (userPosts.length === 0) {
  //   videosGrid.style.display = 'none';
  //   emptyState.style.display = 'block';
  // }
});
