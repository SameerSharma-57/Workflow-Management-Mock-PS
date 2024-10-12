import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/dashboard.jsx';
import { jwtDecode } from 'jwt-decode'; 
import { Navigate } from 'react-router-dom';

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
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" />;
  }

  // Optionally, decode the token to check its expiration
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds
    if (decoded.exp < currentTime) {
      localStorage.removeItem("token");
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.error("Token decoding error: ", error);
    localStorage.removeItem("token");
    return <Navigate to="/" />;
  }

  return children;
};
export default App;