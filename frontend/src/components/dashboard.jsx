// src/components/Dashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the logout API (assuming it's set up at /api/auth/logout)
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token if required
        },
      });

      if (response.ok) {
        // Remove the token from local storage
        localStorage.removeItem("token");

        // Redirect to the login page
        navigate("/");
      } else {
        // Handle logout error
        alert("Failed to log out. Please try again.");
      }
    } catch (error) {
      console.error("Logout Error: ", error);
      alert("An error occurred during logout.");
    }
  };

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>This is a protected page, accessible only after login.</p>

      <button onClick={handleLogout}>Logout</button>  {/* Logout button */}
    </div>
  );
};

export default Dashboard;
