// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [showLoginForm, setShowLoginForm] = useState(false); // Toggle between Google and username/password login
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Simulate Google login (this will be replaced with actual Google OAuth logic)
    alert('Simulating Google login');
    navigate('/dashboard'); // Redirect after Google login
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    if (username && password) {
      // Simulate a successful username/password login
      navigate('/dashboard');
    } else {
      alert('Please enter valid credentials');
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>

      {/* Google login option */}
      <div className="google-login">
        <h3>Login with Google</h3>
        <button onClick={handleGoogleLogin}>Login with Google</button>
      </div>

      {/* Toggle between Google login and username/password */}
      {!showLoginForm ? (
        <div className="login-options">
          <p>Or login with your username and password</p>
          <button onClick={() => setShowLoginForm(true)}>Use Username/Password</button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <div>
            <label>Username</label>
            <input
              type="text"
              name="username"
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default LoginPage;
