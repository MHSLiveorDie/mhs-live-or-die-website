// Chat functionality
const conversationItems = document.querySelectorAll('.conversation-item');
const messagesArea = document.getElementById('messagesArea');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// Switch between conversations
conversationItems.forEach(item => {
  item.addEventListener('click', () => {
    // Remove active class from all conversations
    conversationItems.forEach(conv => conv.classList.remove('active'));

    // Add active class to clicked conversation
    item.classList.add('active');

    // Get user name
    const userName = item.dataset.user;

    // Update chat header
    const chatUserName = document.querySelector('.chat-user-name');
    chatUserName.textContent = '@' + userName;

    // Clear messages (in real app, would load conversation history)
    messagesArea.innerHTML = `
      <div class="message received">
        <img src="https://via.placeholder.com/35" alt="${userName}" class="message-avatar">
        <div class="message-bubble">
          <p>Hey! Ready for some gaming? 🎮</p>
          <span class="message-time">10:00 AM</span>
        </div>
      </div>
    `;

    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
  });
});

// Send message function
function sendMessage() {
  const messageText = messageInput.value.trim();

  if (messageText === '') return;

  // Create message element
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message sent';

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  messageDiv.innerHTML = `
    <div class="message-bubble">
      <p>${escapeHtml(messageText)}</p>
      <span class="message-time">${currentTime}</span>
    </div>
  `;

  // Add to messages area
  messagesArea.appendChild(messageDiv);

  // Clear input
  messageInput.value = '';

  // Scroll to bottom
  messagesArea.scrollTop = messagesArea.scrollHeight;

  // Simulate received response (for demo)
  setTimeout(() => {
    const responseDiv = document.createElement('div');
    responseDiv.className = 'message received';
    responseDiv.innerHTML = `
      <img src="https://via.placeholder.com/35" alt="User" class="message-avatar">
      <div class="message-bubble">
        <p>Got it! Let's do this 💪</p>
        <span class="message-time">Just now</span>
      </div>
    `;
    messagesArea.appendChild(responseDiv);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }, 1000);
}

// Send button click
sendBtn.addEventListener('click', sendMessage);

// Enter key to send
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
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

// Auto-scroll to bottom on page load
window.addEventListener('load', () => {
  messagesArea.scrollTop = messagesArea.scrollHeight;
});
