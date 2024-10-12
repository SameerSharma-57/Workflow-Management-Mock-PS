// src/components/Dashboard.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>This is a protected page, accessible only after login.</p>
    </div>
  );
};

export default Dashboard;
