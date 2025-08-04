console.log("Js file has loaded");
const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-button");
const droidReplies = [
    "Beep boop! What do you mean by that?",
    "Interesting... I want to know more.",
    "I'll need to update some circuits to understand that.",
    "Can you rephrase that in binary",
    "My logic unit is... confused",
    "Don't know what you mean brotato chip",
    "01001000 01101001",
    "How bizzare, it would be an adventure to understand that"
];

const totalRepliesPlusFive= droidReplies.length + 5;

function addMessage(sender, text) {
    const message = document.createElement("div");
    message.classList.add("message", sender);
    message.textContent = `${sender === "user" ? "You" : "Droid"}: ${text}`;
    chatLog.appendChild(message);
    chatLog.scrollTop = chatLog.scrollHeight;
}

function typeMessage(text, sender) {
    return new Promise((resolve) => {
        const message = document.createElement("div");
        message.classList.add("message", sender);
        chatLog.appendChild(message);
        chatLog.scrollTop = chatLog.scrollHeight;

        let index =0;
        let cursorVisible = true;

        const cursor = document.createElement("span");
        cursor.textContent = "|";
        cursor.style.color = "#0b93f6"
        cursor.style.fontWeight = "bold";
        cursor.style.marginLeft = "2px";

        message.textContent = `${sender === "user" ? "You": "Droid"}: `;
        message.appendChild(cursor);

        const blinkInterval = setInterval(() => {
            cursor.style.visibility = cursorVisible ? "hidden" : "visible";
            cursorVisible - !cursorVisible;
        }, 500);

        const typeInterval = setInterval(() => {
            if (index < text.length) {
                message.textContent = `${sender === "user" ? "You" : "Droid"}: ` + text.substring(0, index + 1);
                message.appendChild(cursor);
                index++;
                chatLog,scrollTop = chatLog.scrollHeight;
            } else {
                clearInterval(typeInterval);
                clearInterval(blinkInterval);
                cursor.style.visibility = "hidden";
                resolve();
            }
        }, 50);
    });
}

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === "Return") {
        sendBtn.click();
    }
});

sendBtn.addEventListener("click", async () => {
    const userText = userInput.value.trim()
    if (!userText || userText.length > 200) return;

    addMessage("user", userText);
    userInput.value = "";
    userInput.focus();

    const thinkingMsg = document.createElement("div");
    thinkingMsg.classList.add("message", "bot");

    const thinkingText = document.createElement("span");
    thinkingText.textContent = "Droid is thinking";
    thinkingMsg.appendChild(thinkingText);

    const dotsContainer = document.createElement("span")
    dotsContainer.style.marginLeft = "6px";

    const dots = [];
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement("span");
        dot.textContent = ".";
        dot.style.opacity = "0.3";
        dot.style.fontWeight = "bold";
        dot.style.fontSize = "20px";
        dot.style.color = "white";
        dot.style.transition = "opacity 0.3s ease-in-out";
        dotsContainer.appendChild(dot);
        dots.push(dot);
    }

    chatLog.appendChild(thinkingMsg);
    chatLog.scrollTop = chatLog.scrollHeight;

    let currentDot = 0;
    const interval = setInterval(() => {
        dots.forEach(dot => dot.style.opacity = "0.3");
        dots[currentDot].style.opacity = "1";
        currentDot = (currentDot +1) % dots.length;
    }, 400);

    await new Promise((r) => setTimeout(r, 1500));

    clearInterval(interval);
    thinkingMsg.remove();

    const randomReply = droidReplies[Math.floor(Math.random() * droidReplies.length)];
    await typeMessage(randomReply, "bot");

    const messageCount = document.getElementsByClassName("message").length;
    console.log("Total messages so far:", messageCount);
});