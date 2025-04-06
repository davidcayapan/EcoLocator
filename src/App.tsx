import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import Compost from './pages/Compost';
import Produce from './pages/Produce';
import Electronics from './pages/Electronics';
import Sustainability from './pages/Sustainability';
import MapPage from './pages/Map';
import ChatBot from './components/ChatBot';
import { UserProvider } from './context/UserContext';

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
            <Route path="/auth" element={<Auth onLogin={() => setIsAuthenticated(true)}/>} />;
            <Route path="/" element={isAuthenticated ? <Navigate to="/sustainability" replace />  : <Navigate to="/auth" replace />  }  />
            <Route path="/compost" element={<Compost />} />
            <Route path="/produce" element={<Produce />} />
            <Route path="/electronics" element={<Electronics />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/map" element={<MapPage />} />

          </Routes>
          <ChatBot />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;