import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!email.trim()) {
      setMessage("Please enter your email.");
      setMessageType("error");
      return;
    }

    try {
      const response = await API.post("/auth/forgot-password", {
        email,
      });

      setMessage(response.data.message);
      setMessageType("success");

      // Save email for next pages
      localStorage.setItem("resetEmail", email);

      setTimeout(() => {
        navigate("/verify-otp");
      }, 1000);

    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
      setMessageType("error");
    }
  };

  return (
    <div className="forgot-container">
      <form className="forgot-box" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <button type="submit">
          Send OTP
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;