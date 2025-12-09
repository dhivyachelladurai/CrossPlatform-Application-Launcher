import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function App() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    try {
      const res = await axios.get('/api/apps');
      setApps(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const launch = async (id) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/launch', { id });
      const { pid, name } = res.data;
      window.location.href = `/running?pid=${pid}&name=${encodeURIComponent(name)}`;
    } catch (e) {
      alert('Failed to launch');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Launcher</h1>
        <a className="settings" href="/settings">Settings</a>
      </header>
      
      {loading && <div className="overlay">Launching...</div>}

      <div className="grid">
        {apps.length === 0 && <div className="empty">No apps. Open Settings on server to add.</div>}
        
        {apps.map(a => (
          <div key={a.id} className="card" onClick={() => launch(a.id)}>
            <div className="icon">{a.name ? a.name[0].toUpperCase() : 'A'}</div>
            <div className="label">{a.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}