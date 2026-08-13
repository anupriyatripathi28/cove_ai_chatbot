/* ==========================================================
   Cove — AI chatbot
   Frontend communicates with a Node.js backend.
   Gemini API requests are handled securely on the server.
   ========================================================== */

(() => {
  'use strict';

  
  const chatLog        = document.getElementById('chatLog');
  const clearChatBtn = document.getElementById('clearChatBtn');
  const themeToggle = document.getElementById('themeToggle');
  const composerForm   = document.getElementById('composerForm');
  const messageInput   = document.getElementById('messageInput');
  const sendBtn        = document.getElementById('sendBtn');
  const suggestions    = document.getElementById('suggestions');
  const newChatBtn     = document.getElementById('newChatBtn');
  const menuToggle     = document.getElementById('menuToggle');
  const sidebar        = document.querySelector('.sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  /* ---------------- Simulated response engine ---------------- */

  

  async function generateReply(userText) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userText
        })
      });

      const data = await response.json();

      return data.reply || "Sorry, I couldn't generate a response.";

    } catch (error) {
      console.error(error);
      return "Error connecting to the server.";
    }
  }
  /* ---------------- Rendering helpers ---------------- */

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function scrollToBottom() {
    chatLog.scrollTop = chatLog.scrollHeight;
  }


  function saveChatHistory() {
    const messages = [];

    chatLog.querySelectorAll('.message').forEach((message) => {
      const bubble = message.querySelector('.bubble');

      if (!bubble || message.id === 'typingIndicator') return;

      messages.push({
        role: message.classList.contains('user') ? 'user' : 'bot',
        text: bubble.textContent
      });
    });

    localStorage.setItem('coveChatHistory', JSON.stringify(messages));
  }

  function loadChatHistory() {
    const saved = localStorage.getItem('coveChatHistory');

    if (!saved) return;

    const messages = JSON.parse(saved);

    // Remove the initial HTML messages
    chatLog.innerHTML = `
    <div class="day-divider">
      <span>Today</span>
    </div>
  `;

    messages.forEach((message) => {
      appendMessage(message.role, message.text);
    });

    hideSuggestions();
  }


  function appendMessage(role, text) {
    const wrap = document.createElement('div');
    wrap.className = `message ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar small';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = role === 'bot' ? '◈' : '';

    const stack = document.createElement('div');
    stack.className = 'bubble-stack';

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;

    const time = document.createElement('span');
    time.className = 'timestamp';
    time.textContent = formatTime(new Date());

    stack.appendChild(bubble);
    stack.appendChild(time);

    if (role === 'bot') {
      wrap.appendChild(avatar);
      wrap.appendChild(stack);
    } else {
      wrap.appendChild(stack);
    }

    chatLog.appendChild(wrap);
    scrollToBottom();

    saveChatHistory();

    return bubble;
  }


  

  function showTypingIndicator() {
    const wrap = document.createElement('div');
    wrap.className = 'message bot';
    wrap.id = 'typingIndicator';

    const avatar = document.createElement('div');
    avatar.className = 'avatar small';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = '◈';

    const stack = document.createElement('div');
    stack.className = 'bubble-stack';

    const bubble = document.createElement('div');
    bubble.className = 'bubble typing';
    bubble.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';

    stack.appendChild(bubble);
    wrap.appendChild(avatar);
    wrap.appendChild(stack);
    chatLog.appendChild(wrap);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
  }

  /* ---------------- Sending flow ---------------- */

  function hideSuggestions() {
    if (suggestions) suggestions.style.display = 'none';
  }

  function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    hideSuggestions();
    appendMessage('user', trimmed);
    resetInput();

    showTypingIndicator();
    const delay = 500 + Math.random() * 700;

    setTimeout(async () => {
      const reply = await generateReply(trimmed);

      removeTypingIndicator();
      appendMessage('bot', reply);
    }, delay);
  }

  function resetInput() {
    messageInput.value = '';
    autoResize();
    updateSendState();
    messageInput.focus();
  }

  function updateSendState() {
    sendBtn.disabled = messageInput.value.trim().length === 0;
  }

  function autoResize() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 160) + 'px';
  }

  /* ---------------- Event wiring ---------------- */

  composerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage(messageInput.value);
  });

  messageInput.addEventListener('input', () => {
    autoResize();
    updateSendState();
  });

  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) sendMessage(messageInput.value);
    }
  });

  if (suggestions) {
    suggestions.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      sendMessage(chip.dataset.prompt || chip.textContent);
    });
  }

  newChatBtn.addEventListener('click', () => {
    localStorage.removeItem('coveChatHistory');
    chatLog.innerHTML = `
      <div class="day-divider"><span>Today</span></div>
      <div class="message bot">
        <div class="avatar small" aria-hidden="true">◈</div>
        <div class="bubble-stack">
          <div class="bubble">New conversation started. What would you like to talk about?</div>
          <span class="timestamp">${formatTime(new Date())}</span>
        </div>
      </div>
    `;
    resetInput();
    closeSidebarOnMobile();
  });

  /* Mobile sidebar toggle */
  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('visible');
  }

  function closeSidebarOnMobile() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('visible');
  }

  menuToggle.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebarOnMobile() : openSidebar();
  });

  sidebarOverlay.addEventListener('click', closeSidebarOnMobile);

  document.querySelectorAll('.thread-item').forEach((item) => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.thread-item').forEach((i) => i.classList.remove('active'));
      item.classList.add('active');
      closeSidebarOnMobile();
    });
  });

  /* Initial state */
  updateSendState();
  loadChatHistory();

  const savedTheme = localStorage.getItem('coveTheme');

  if (savedTheme === 'light') {
    document.body.classList.add('light');
    themeToggle.textContent = '🌙 Dark';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');

    if (document.body.classList.contains('light')) {
      themeToggle.textContent = '🌙 Dark';
      localStorage.setItem('coveTheme', 'light');
    } else {
      themeToggle.textContent = '☀️ Light';
      localStorage.setItem('coveTheme', 'dark');
    }
  });  


  clearChatBtn.addEventListener('click', () => {
    chatLog.innerHTML = `
    <div class="day-divider"><span>Today</span></div>
  `;

    localStorage.removeItem('coveChatHistory');

    appendMessage(
      'bot',
      "Hey — I'm Cove. Ask me anything, or try one of the prompts below to get going."
    );
  });
  
  })();
