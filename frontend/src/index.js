import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Running from './Running';
import Settings from './Settings';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/running' element={<Running />} />
        <Route path='/settings' element={<Settings />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);