// src/HomePage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signOut } from "./firebaseConfig";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    } else {
      navigate("/"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/"); // Redirect to login page on sign-out
      })
      .catch((error) => {
        console.error("Error signing out: ", error.message);
      });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome, {user ? user.displayName : "User"}!</h1>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default HomePage;
