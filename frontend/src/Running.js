import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Running() {
  const q = useQuery();
  const pid = q.get('pid');
  const name = q.get('name');

  const goHome = async () => {
    try {
      await axios.post('/api/quit', { pid });
    } catch (e) {}
    window.location.href = '/';
  };

  return (
    <div className="center">
      <h2>Running: {decodeURIComponent(name || '')}</h2>
      <p>PID: {pid}</p>
      <button onClick={goHome}>Home</button>
    </div>
  );
}