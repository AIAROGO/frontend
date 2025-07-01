import React, { useState } from 'react';

const CommunicationPanel = ({ messages, setMessages }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessages([...messages, { from: 'Dr. Johnson', text: message, time: new Date().toLocaleTimeString() }]);
    setMessage('');
  };

  return (
    <div>
      <ul className="mb-4">
        {messages.map((msg, index) => (
          <li key={index} className="p-2 border-b">{`${msg.from} (${msg.time}): ${msg.text}`}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Send
        </button>
      </form>
    </div>
  );
};

export default CommunicationPanel;