console.log("Js file has loaded");

const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-button");
const stopBtn = document.getElementById("stop-button");
let abortController = null;

const API_KEY = "YOUR_API_KEY_HERE"; // Replace this

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

        let index = 0;
        let cursorVisible = true;

        const cursor = document.createElement("span");
        cursor.textContent = "|";
        cursor.style.color = "#0b93f6";
        cursor.style.fontWeight = "bold";
        cursor.style.marginLeft = "2px";

        message.textContent = `${sender === "user" ? "You" : "Droid"}: `;
        message.appendChild(cursor);

        const blinkInterval = setInterval(() => {
            cursor.style.visibility = cursorVisible ? "hidden" : "visible";
            cursorVisible = !cursorVisible;
        }, 500);

        const typeInterval = setInterval(() => {
            if (index < text.length) {
                message.textContent = `${sender === "user" ? "You" : "Droid"}: ` + text.substring(0, index + 1);
                message.appendChild(cursor);
                index++;
                chatLog.scrollTop = chatLog.scrollHeight;
            } else {
                clearInterval(typeInterval);
                clearInterval(blinkInterval);
                cursor.style.visibility = "hidden";
                resolve();
            }
        }, 30);
    });
}

async function fetchGeminiReply(promptText) {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    
    const requestBody = {
        contents: [
            {
                role: "user",
                parts: [{ text: promptText }]
            }
        ]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API error:", errorText);
            return "Sorry, I couldn't reach my brain circuits. Try again.";
        }

        const data = await response.json();
        console.log("Gemini raw response:", data);

        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return reply || "Hmm... I'm speechless.";
    } catch (err) {
        console.error("Fetch failed:", err);
        return "I'm having a glitch! Try again later.";    
    }
}

function showThinkingAnimation() {
    const thinkingMsg = document.createElement("div");
    thinkingMsg.classList.add("message", "bot");

    const thinkingText = document.createElement("span");
    thinkingText.textContent = "Droid is thinking";
    thinkingMsg.appendChild(thinkingText);

    const dotsContainer = document.createElement("span");
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

    thinkingMsg.appendChild(dotsContainer);
    chatLog.appendChild(thinkingMsg);
    chatLog.scrollTop = chatLog.scrollHeight;

    let currentDot = 0;
    const interval = setInterval(() => {
        dots.forEach(dot => dot.style.opacity = "0.3");
        dots[currentDot].style.opacity = "1";
        currentDot = (currentDot + 1) % dots.length;
    }, 400);

    return { thinkingMsg, interval };
}

sendBtn.addEventListener("click", async () => {
    const userText = userInput.value.trim();
    if (!userText || userText.length > 200) return;

    addMessage("user", userText);
    userInput.value = "";
    userInput.focus();

    const { thinkingMsg, interval } = showThinkingAnimation();

    const geminiReply = await fetchGeminiReply(userText);

    clearInterval(interval);
    thinkingMsg.remove();
    await typeMessage(geminiReply, "bot");
});