// Like button functionality
const likeButtons = document.querySelectorAll('.like-btn');

likeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.textContent = '❤️ Liked';
    btn.style.color = '#00ff41';
  });
});

// Comment section functionality
const commentButtons = document.querySelectorAll('.comment-btn');

commentButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const post = btn.closest('.post');
    const commentsSection = post.querySelector('.comments-section');
    commentsSection.classList.toggle('active');
  });
});

// Post comment functionality
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('comment-submit-btn')) {
    const isReply = e.target.closest('.reply-input-area');
    const inputArea = isReply || e.target.closest('.comment-input-area');
    const input = inputArea.querySelector('.comment-input');
    const commentText = input.value.trim();

    if (commentText === '') return;

    // Create new comment
    const newComment = document.createElement('div');
    newComment.className = 'comment';

    const currentTime = new Date();
    const timeStr = 'Just now';

    newComment.innerHTML = `
      <img src="https://via.placeholder.com/35" alt="You" class="comment-avatar">
      <div class="comment-content">
        <div class="comment-header">
          <span class="comment-author">@You</span>
          <span class="comment-time">${timeStr}</span>
        </div>
        <p class="comment-text">${escapeHtml(commentText)}</p>
        <div class="comment-actions">
          <button class="comment-action-btn comment-like-btn">❤️ Like (0)</button>
          <button class="comment-action-btn comment-reply-btn">Reply</button>
        </div>
        <div class="reply-input-area">
          <input type="text" class="comment-input" placeholder="Write a reply...">
          <button class="comment-submit-btn">Reply</button>
        </div>
      </div>
    `;

    // Add comment to list or replies
    if (isReply) {
      const parentComment = isReply.closest('.comment');
      let repliesSection = parentComment.querySelector('.comment-replies');

      if (!repliesSection) {
        repliesSection = document.createElement('div');
        repliesSection.className = 'comment-replies active';
        parentComment.querySelector('.comment-content').appendChild(repliesSection);
      } else {
        repliesSection.classList.add('active');
      }

      repliesSection.appendChild(newComment);
      isReply.classList.remove('active');
    } else {
      const commentsList = inputArea.nextElementSibling;
      commentsList.appendChild(newComment);
    }

    // Clear input
    input.value = '';

    // Update comment count
    const post = e.target.closest('.post');
    const commentBtn = post.querySelector('.comment-btn');
    const currentCount = parseInt(commentBtn.textContent.match(/\d+/) || 0);
    commentBtn.textContent = `💬 Comment (${currentCount + 1})`;
  }
});

// Reply button functionality
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('comment-reply-btn')) {
    const comment = e.target.closest('.comment');
    const replyInput = comment.querySelector('.reply-input-area');
    replyInput.classList.toggle('active');

    if (replyInput.classList.contains('active')) {
      replyInput.querySelector('.comment-input').focus();
    }
  }
});

// Like comment functionality
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('comment-like-btn')) {
    const btn = e.target;
    const currentText = btn.textContent;
    const currentCount = parseInt(currentText.match(/\d+/) || 0);

    if (btn.classList.contains('liked')) {
      btn.classList.remove('liked');
      btn.textContent = `❤️ Like (${currentCount - 1})`;
    } else {
      btn.classList.add('liked');
      btn.textContent = `❤️ Liked (${currentCount + 1})`;
    }
  }
});

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Video controls - autoplay, mute/unmute, progress bar
const postVideos = document.querySelectorAll('.post-video');
let currentAudioVideo = null;

// Intersection Observer to autoplay videos when scrolled into view
const videoObserverOptions = {
  threshold: 0.5 // 50% of video must be visible
};

const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target;

    if (entry.isIntersecting) {
      // Play video muted when in view
      video.muted = true;
      video.play().catch(err => console.log('Autoplay prevented:', err));
    } else {
      // Pause video when out of view
      video.pause();
      video.currentTime = 0; // Reset to start

      // If this was the audio video, clear it
      if (currentAudioVideo === video) {
        currentAudioVideo = null;
      }
    }
  });
}, videoObserverOptions);

// Observe all post videos
postVideos.forEach(video => {
  videoObserver.observe(video);

  // Update progress bar as video plays
  video.addEventListener('timeupdate', () => {
    const wrapper = video.closest('.post-video-wrapper');
    const progressBar = wrapper.querySelector('.video-progress-bar');
    if (progressBar && video.duration) {
      const percentage = (video.currentTime / video.duration) * 100;
      progressBar.style.width = percentage + '%';
    }
  });

  // Click on progress bar to seek
  const wrapper = video.closest('.post-video-wrapper');
  const progressContainer = wrapper.querySelector('.video-progress-container');
  if (progressContainer) {
    progressContainer.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      video.currentTime = percentage * video.duration;
    });
  }

  // Click on video to unmute - only one video has audio at a time
  video.addEventListener('click', () => {
    // Mute any previous video
    if (currentAudioVideo && currentAudioVideo !== video) {
      currentAudioVideo.muted = true;
    }

    // Toggle mute/unmute for this video
    if (video.muted) {
      video.muted = false;
      video.volume = 0.7;
      currentAudioVideo = video;
    } else {
      video.muted = true;
      currentAudioVideo = null;
    }

    // Make sure video is playing
    if (video.paused) {
      video.play().catch(err => console.log('Play prevented:', err));
    }
  });
});
