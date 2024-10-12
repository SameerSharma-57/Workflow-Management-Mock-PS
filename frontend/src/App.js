import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/dashboard.jsx';

function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
      
    </div>
  );
}

export default App;