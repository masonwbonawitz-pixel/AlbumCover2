import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MobilePage from './pages/MobilePage';
import AdminPage from './pages/AdminPage';
import './App.css';

// Device detection
const isMobileDevice = (): boolean => {
  if (window.innerWidth <= 1024) return true;
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={isMobileDevice() ? <MobilePage /> : <HomePage />} />
        <Route path="/mobile" element={<MobilePage />} />
        <Route path="/desktop" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

