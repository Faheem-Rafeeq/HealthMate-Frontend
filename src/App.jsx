// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Screens/Login';
import SignUpPage from './Screens/Signup';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<LoginPage />} /> {/* Default route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;