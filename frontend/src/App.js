import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import dashboard from './components/dashboard';

function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<dashboard />} />
      </Routes>
    </Router>
      
    </div>
  );
}

export default App;