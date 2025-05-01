// Toggle chat visibility
document.addEventListener("DOMContentLoaded", function () {
    const chatToggleBtn = document.getElementById("chat-toggle-btn");
    const chatWidget = document.getElementById("chat-widget");
    const chatCloseBtn = document.getElementById("chat-close-btn");
    const chatForm = document.getElementById("chat-form");
    const chatLog = document.getElementById("chat-log");
    const userInput = document.getElementById("user-input");
  
    if (chatToggleBtn) {
      chatToggleBtn.addEventListener("click", function () {
        chatWidget.style.display = chatWidget.style.display === "block" ? "none" : "block";
      });
    }
  
    if (chatCloseBtn) {
      chatCloseBtn.addEventListener("click", function () {
        chatWidget.style.display = "none";
      });
    }
  
    if (chatForm) {
      chatForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const message = userInput.value.trim();
        if (message === "") return;
  
        const userMessage = document.createElement("li");
        userMessage.innerHTML = `<strong>You:</strong> ${message}`;
        chatLog.appendChild(userMessage);
        chatLog.scrollTop = chatLog.scrollHeight;
  
        fetch("/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: message })
        })
          .then((res) => res.json())
          .then((data) => {
            const botMessage = document.createElement("li");
            botMessage.innerHTML = `<strong>Mohammed:</strong> ${data.reply}`;
            chatLog.appendChild(botMessage);
            chatLog.scrollTop = chatLog.scrollHeight;
          });
  
        userInput.value = "";
      });
    }
  });
  