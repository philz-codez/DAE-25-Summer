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
    message.innerHTML = `<strong>${sender === "user" ? "You" : "Droid"}:</strong> ${formatMessage(text)}`;
    chatLog.appendChild(message);
    chatLog.scrollTop = chatLog.scrollHeight;
}

function formatMessage(text) {
    if (!text) return "";

    text = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");

    text = text.replace(/`(.*?)`/g, "<code>$1</code>");

    text = text.replace(/\n/g, "<br>");

    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

    return text;
}

function typeMessage(text, sender) {
    return new Promise((resolve) => {
        const message = document.createElement("div");
        message.classList.add("message", sender);
        chatLog.appendChild(message);
        chatLog.scrollTop = chatLog.scrollHeight;

        const formattedHTML = formatMessage(text);

        let index = 0;
        let cursorVisible = true;

        const cursor = document.createElement("span");
        cursor.textContent = "|";
        cursor.style.color = "#fff";
        cursor.style.fontWeight = "bold";
        cursor.style.marginLeft = "4px";

        message.innerHTML = `<strong>${sender === "user" ? "You" : "Droid"}:</strong> `;
        message.appendChild(cursor);

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = formattedHTML;
        const fullText = tempDiv.innerHTML;

        const blinkInterval = setInterval(() => {
            cursor.style.visibility = cursorVisible ? "hidden" : "visible";
            cursorVisible = !cursorVisible;
        }, 500);

        const typeInterval = setInterval(() => {
            if(index < fullText.length) {
                message.innerHTML = `<strong>${sender === "user" ? "You" : "Droid"}:</strong ` + fullText.substring(0, index+1);
                message.appendChild(cursor);
                index++
                chatLog.scrollTop = chatLog.scrollHeight;
            } else {
                clearInterval(typeInterval);
                clearInterval(blinkInterval);
                cursor.style.visibility = "hidden";
                resolve();
            }
        }, 10);
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

async function fetchJoke(){
    try{
        const response = await fetch("https://official-joke-api.appspot.com/random_joke");
        if(!response.ok) throw new Error("Failed to fetch joke");

        const data = await response.json();
        return `${data.setup} ... ${data.punchline}`;
    }catch(err) {
        console.error("Joke fetch error:", err);
        return "Oops! I couldn't fetch a joke right now.";
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

    let geminiReply;

    if (userText.toLowerCase().includes("tell me a joke")) {
        geminiReply = await fetchJoke();
    } else {
        geminiReply = await fetchGeminiReply(userText);
    }

    clearInterval(interval);
    thinkingMsg.remove();
    await typeMessage(geminiReply, "bot");
});

userInput.addEventListener("keydown", async (event) => {
    if(event.key === "Enter"){
        event.preventDefault();
        sendBtn.click();
    }
});