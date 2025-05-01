
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('user-input');
  const chatLog = document.getElementById('chat-log');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;

    const userMessageElem = document.createElement('li');
    userMessageElem.classList.add('user-message');
    userMessageElem.innerHTML = "<strong>You:</strong> " + message;
    chatLog.appendChild(userMessageElem);
    input.value = '';
    chatLog.scrollTop = chatLog.scrollHeight;

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
      });
      const data = await response.json();
      const reply = data.reply;

      const assistantMessageElem = document.createElement('li');
      assistantMessageElem.classList.add('assistant-message');
      assistantMessageElem.innerHTML = "<strong>Mohammed:</strong> " + reply;
      chatLog.appendChild(assistantMessageElem);
      chatLog.scrollTop = chatLog.scrollHeight;
    } catch (error) {
      console.error("Error:", error);
    }
  });
});
