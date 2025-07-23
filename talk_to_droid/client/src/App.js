import React, { useState } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setChatLog([...chatLog, { sender: "You", text: input }]);

    try {
      const res = await axios.post("http://localhost:5500/api/chat", { message: input });
      setChatLog((prev) => [...prev, { sender: "Droid", text: res.data.reply }]);
    } catch (err) {
      setChatLog((prev) => [...prev, { sender: "Droid", text: "Error: Could not reach backend." }]);
    }

    setInput("");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h1>Talk to Droid</h1>
      <div style={{ minHeight: "200px", border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
        {chatLog.map((msg, idx) => (
          <p key={idx}><strong>{msg.sender}:</strong> {msg.text}</p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type your message..."
        style={{ width: "80%", padding: "0.5rem" }}
      />
      <button onClick={sendMessage} style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}>Send</button>
    </div>
  );
}

export default App;
