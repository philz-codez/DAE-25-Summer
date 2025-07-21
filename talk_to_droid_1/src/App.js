import React, {useState} from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (input.trim() === '') return;

    setMessages([...messages, input]);
    setInput('');
  };
  return (
    <div className="App">
      <h1>Talk to a Droid</h1>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Type your message here...'
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default App;
