// src/LoginPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup } from "./firebaseConfig";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/home"); // Redirect to the home page on successful sign-in
    } catch (error) {
      console.error("Error signing in with Google: ", error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Sign In with Google</h1>
      <button onClick={handleGoogleSignIn}>Sign In with Google</button>
    </div>
  );
};

export default LoginPage;
