import React, { useState } from 'react';
import axios from 'axios';
import './App.css';


function App() {
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const [dateTime, setDateTime] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !file || !dateTime) {
      setStatus('Please fill all fields');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('file', file);
    formData.append('dateTime', dateTime);

    try {
      const res = await axios.post('http://localhost:5000/send-email', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus(res.data.message);
    } catch (error) {
      setStatus('Error sending email');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form-card">
  <img 
    src="https://cdn-icons-png.flaticon.com/512/5968/5968756.png" 
    alt="Bird Logo" 
    className="logo-img" 
  />
  <h2>Send PDF via Email</h2>
  <input
    type="email"
    placeholder="Recipient's email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
  <input
    type="file"
    accept="application/pdf"
    onChange={(e) => setFile(e.target.files[0])}
    required
  />
  <input
    type="datetime-local"
    value={dateTime}
    onChange={(e) => setDateTime(e.target.value)}
    required
  />
  <button type="submit">Schedule Email</button>
  {status && <p className="status">{status}</p>}
</form>

    </div>
  );
}

export default App;
