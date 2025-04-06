import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import Compost from './pages/WasteManagement'; // Fixed casing
import Produce from './pages/Calculator';
import Electronics from './pages/About'; // About page
import MapPage from './pages/Map';
import ChatBot from './components/ChatBot';
import { UserProvider } from './context/UserContext';
import Sustainability from './pages/review';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('offlineAccess');
    localStorage.removeItem('tempEmail');
    setIsAuthenticated(false);
  };

  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar onLogout={handleLogout} />
          <Routes>
            <Route path="/auth" element={<Auth onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/" element={isAuthenticated ? <Navigate to="/about" replace /> : <Navigate to="/auth" replace />} />
            <Route path="/wastemanagement" element={<Compost />} />
            <Route path="/calculator" element={<Produce />} />
            <Route path="/about" element={<Electronics />} /> {/* Redirects to About */}
            <Route path="/review" element={<Sustainability />} />
            <Route path="/map" element={<MapPage />} />
          </Routes>
          <ChatBot />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;