import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">

      <nav className="navbar">
        <h2>🔐 SecureVault</h2>

        <div className="nav-links">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/register" className="register-btn">Register</Link>
        </div>
      </nav>

      <section className="hero">

        <div className="hero-left">
          <h1>
            Store Passwords <br />
            <span>Securely.</span>
          </h1>

          <p>
            SecureVault is a modern password manager that keeps your
            credentials encrypted, organized and accessible only to you.
          </p>

          <div className="buttons">
            <Link to="/register" className="primary">
              Get Started
            </Link>

            <Link to="/login" className="secondary">
              Login
            </Link>
          </div>
        </div>

        <div className="hero-right">

          <div className="card">
            <h3>Password Vault</h3>

            <div className="row">
              <span>🌐 Google</span>
              <span>••••••••••</span>
            </div>

            <div className="row">
              <span>💻 GitHub</span>
              <span>••••••••••</span>
            </div>

            <div className="row">
              <span>📧 Gmail</span>
              <span>••••••••••</span>
            </div>

            <div className="status">
              🔒 AES-256 Encryption Enabled
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;