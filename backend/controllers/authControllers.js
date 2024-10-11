// backend/controllers/authControllers.js
import { admin, db } from "../config/firebase.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Sign Up Controller
export const signup = async (req, res) => {
  const { email, password, name, username, department, designation } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    // Store additional user data in Firestore
    await db.collection("users").doc(userRecord.uid).set({
      name: name || "",
      username: username || "",
      department: department || "",
      designation: designation || "",
    });

    res.status(201).send({ uid: userRecord.uid });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verify user credentials using Firebase REST API
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    const user = response.data;

    // Fetch user details from Firestore
    const userDoc = await db.collection("users").doc(user.localId).get();

    if (!userDoc.exists) {
      return res.status(404).send({ error: "User not found" });
    }

    const userData = userDoc.data();
    const token = jwt.sign({ uid: user.localId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send back the uid and user details along with the token
    res.status(200).send({
      uid: user.localId,
      name: userData.name || "",
      username: userData.username || "",
      department: userData.department || "",
      designation: userData.designation || "",
      token,
    });
  } catch (error) {
    res
      .status(400)
      .send({ error: error.response?.data?.error?.message || error.message });
  }
};

// Logout Controller
export const logout = async (req, res) => {
  // Here you can perform any necessary actions, like logging out the user in your database, etc.
  res.status(200).send({ message: "Logout successful" });
};
