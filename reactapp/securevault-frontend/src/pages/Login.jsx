import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../services/api";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

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

        password

      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userEmail", email);

      navigate("/dashboard");

    } catch (error) {

      setMessage(

        error.response?.data?.message ||

        "Login Failed"

      );

      setMessageType("error");

    }

  };

  return (

    <div className="login-container">

      <form className="login-box" onSubmit={handleLogin}>

        <div className="logo">

          <FaLock />

        </div>

        <h1>SecureVault</h1>

        <p className="subtitle">

          Secure Password Management System

        </p>

        <input

          type="email"

          placeholder="Email Address"

          value={email}

          onChange={(e) => setEmail(e.target.value)}

        />

        <div className="password-box">

          <input

            type={showPassword ? "text" : "password"}

            placeholder="Password"

            value={password}

            onChange={(e) => setPassword(e.target.value)}

          />

          <span

            onClick={() =>

              setShowPassword(!showPassword)

            }

          >

            {showPassword ?

              <FaEyeSlash /> :

              <FaEye />}

          </span>

        </div>

        {message && (

          <div className={`message ${messageType}`}>

            {message}

          </div>

        )}

        <button>

          Login

        </button>

        <p className="forgot-text">

          <Link to="/forgot-password">

            Forgot Password?

          </Link>

        </p>

        <p className="register-text">

          Don't have an account?

          <Link to="/register">

            Register

          </Link>

        </p>

      </form>

    </div>

  );

}

export default Login;