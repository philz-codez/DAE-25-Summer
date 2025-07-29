console.log("Js file has loaded");
const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-button");

function addMessage(sender, text) {
    const message = document.createElement("div");
    message.classList.add("message", sender);
    message.textContent = `${sender === "user" ? "You" : "Droid"}: ${text}`;
    chatLog.appendChild(message);
    chatLog.scrollTop = chatLog.scrollHeight;
}

sendBtn.addEventListener("click", () => {
    const userText = userInput.value.trim();
    if(!userText) return;

    addMessage("user", userText);
    userInput.value = "";

    const loadingMsg = document.createElement("div");
    loadingMsg.classList.add("message", "bot");
    loadingMsg.textContent = "Droid is thinking...";
    chatLog.appendChild(loadingMsg);
    chatLog.scrollTop=chatLog.scrollHeight;

    setTimeout(() =>{
        loadingMsg.remove();
        addMessage("bot", "I'm still learning. Check back later!");
    }, 1000);
});