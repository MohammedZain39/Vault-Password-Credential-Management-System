import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./Register.css";

function Register() {
  const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const navigate = useNavigate();

const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState("");

  const handleRegister = async (e) => {
  e.preventDefault();

  // Clear previous message
  setMessage("");

  // Full Name Validation
  if (!fullName.trim()) {
    setMessage("Full name is required.");
    setMessageType("error");
    return;
  }

  // Password Length Validation
  if (password.length < 8) {
    setMessage("Password must be at least 8 characters long.");
    setMessageType("error");
    return;
  }

  try {
    await API.post("/auth/register", {
      fullName,
      email,
      password,
    });

    // Redirect immediately to Login page
    navigate("/login");

  } catch (error) {
    setMessage(error.response?.data?.message || "Registration Failed");
    setMessageType("error");
  }
};

  return (
    <div className="register-container">
      <form className="register-box" onSubmit={handleRegister}>
        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
/>

{message && (
  <div className={`message ${messageType}`}>
    {message}
  </div>
)}

        <button type="submit">Register</button>

        <p className="login-text">
             Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;