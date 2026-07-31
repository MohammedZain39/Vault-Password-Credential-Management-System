import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!email.trim() || !password.trim()) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      setMessage(response.data.message);
      setMessageType("success");

      // Optional: Store login status
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);

      // Redirect after 1 second
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      setMessage(error.response?.data?.message || "Login Failed");
      setMessageType("error");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Login</h2>

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

        <button type="submit">Login</button>

        <p className="forgot-text">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>

        <p className="register-text">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;