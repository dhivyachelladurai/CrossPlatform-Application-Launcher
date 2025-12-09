
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Settings() {
  const [apps, setApps] = useState([]);

  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    const res = await axios.get('/api/apps');
    setApps(res.data);
  };

  const addApp = async () => {
    try {
      const res = await axios.post('/api/apps/add', { name: 'New App' });
      fetchApps();
      alert('Added: ' + (res.data.name || res.data.exePath));
    } catch (e) {
      alert('Must run this on server machine; or error occurred');
    }
  };

  const del = async (id) => {
    await axios.delete('/api/apps/' + id);
    fetchApps();
  };

  return (
    <div className="container">
      <h1>Settings (server only)</h1>
      <button onClick={addApp}>Add Application (opens file picker)</button>
      
      <div className="list">
        {apps.map(a => (
          <div key={a.id} className="listItem">
            <div>
              <strong>{a.name}</strong>
              <div className="muted">{a.exePath}</div>
            </div>
            <div>
              <button onClick={() => del(a.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}