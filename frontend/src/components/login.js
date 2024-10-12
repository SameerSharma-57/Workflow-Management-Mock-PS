import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "../google.svg"; // Assume you have this icon

const LoginPage = () => {
  const [activeForm, setActiveForm] = useState("login"); // "login" or "signup"
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState(""); // Add department for signup
  const [designation, setDesignation] = useState(""); // Add designation for signup

  const navigate = useNavigate();

  // API Base URL
  const API_BASE_URL = "http://localhost:5000/api"; // Change this according to your server's port

  // Handle Login
  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token in local storage
        localStorage.setItem("token", data.token);
        navigate("/dashboard"); // Redirect to home on successful login
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Login Error: ", error);
      alert("An error occurred during login");
    }
  };

  // Handle Signup
  const handleSignUp = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          department,
          designation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Sign-up successful! Please log in.");
        setActiveForm("login"); // Switch to login form after sign-up
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Sign Up Error: ", error);
      alert("An error occurred during sign up");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>WORKFLOW</div>
        <div style={styles.formSwitch}>
          <button
            style={activeForm === "login" ? styles.activeTab : styles.tab}
            onClick={() => setActiveForm("login")}
          >
            Login
          </button>
          <button
            style={activeForm === "signup" ? styles.activeTab : styles.tab}
            onClick={() => setActiveForm("signup")}
          >
            Sign up
          </button>
        </div>
      </div>

      <div style={styles.formContainer}>
        {activeForm === "login" ? (
          <div style={styles.formBox}>
            <h2>Login</h2>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.inputBox}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.inputBox}
            />
            <button onClick={handleLogin} style={styles.submitButton}>
              Login
            </button>
            <button style={styles.googleButton}>
              <img src={GoogleIcon} alt="Google Icon" style={styles.googleIcon} />
              Sign In with Google
            </button>
          </div>
        ) : (
          <div style={styles.formBox}>
            <h2>Sign Up</h2>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.inputBox}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.inputBox}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.inputBox}
            />
            <button onClick={handleSignUp} style={styles.submitButton}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
    container: {
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f7f7f7",
    },
    title: {
        fontSize: "30px",
        fontWeight: "bold",
        color: "black",
        position: "absolute",
        left: 0,
        top: 0,
    },
      formSwitch: {
        display: "flex",
        marginTop: "20px",
    },
    tab: {
        padding: "10px 20px",
        backgroundColor: "transparent",
        border: "2px solid #555",
        borderRadius: "0px 0px 0 0", // Rounded corners only at the top
        cursor: "pointer",
        fontWeight: "bold",
        marginLeft: "10px",
    },
    activeTab: {
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        border: "none",
        borderRadius: "0px 0px 0 0", // Rounded corners only at the top
        cursor: "pointer",
        fontWeight: "bold",
        color: "white",
        marginLeft: "10px",
    },
    formContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "600px",
    },
    formBox: {
        width: "300px",
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "0px 10px 10px 10px", // Rounded corners on the bottom
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    },
    inputBox: {
        width: "100%",
        padding: "10px",
        marginBottom: "15px",
        borderRadius: "5px",
        border: "1px solid #ddd",
        fontSize: "16px",
    },
    submitButton: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "15px",
    },
    googleButton: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#4285F4",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    googleIcon: {
        width: "20px",
        marginRight: "10px",
    },
};

export default LoginPage;
