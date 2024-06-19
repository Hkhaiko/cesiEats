import React from "react";
import { io } from "socket.io-client";
const soket = io.connect("http://localhost:5002");

function App() {
  const sendMessage = () => {
    soket.emit();
  };
  return (
    <div className="App">
      <input placeholder="Message ..." />
      <button onClick={sendMessage}>Send message</button>
    </div>
  );
}

export default App;
