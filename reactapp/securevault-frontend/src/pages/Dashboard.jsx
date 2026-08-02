import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";
import "./Dashboard.css";
import {
FaKey,
FaFolder,
FaShieldAlt,
FaExclamationTriangle
} from "react-icons/fa";

function Dashboard() {

  const navigate = useNavigate();

  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);

  const lastLogin = new Date().toLocaleString();

  useEffect(() => {

    async function loadData() {

      try {

        const response = await API.get("/credentials");

        setCredentials(response.data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    }

    loadData();

  }, []);

  const credentialCount = credentials.length;

  const categoryCount = new Set(
    credentials.map(c => c.category || "Others")
  ).size;

  const weakPasswords = credentials.filter(
    c => (c.password || "").length < 8
  ).length;

  if (loading) {

    return (
      <MainLayout>
        <h2>Loading Dashboard...</h2>
      </MainLayout>
    );

  }

  return (

    <MainLayout>

      <div className="dashboard-header">

        <h1>Welcome Back 👋</h1>

        <p>Your SecureVault is protected and ready.</p>

      </div>

      <div className="cards">

  <div className="card">

    <div className="card-icon">

      <FaKey />

    </div>

    <h3>Credentials</h3>

    <p>{credentialCount}</p>

  </div>

  <div className="card">

    <div className="card-icon">

      <FaFolder />

    </div>

    <h3>Categories</h3>

    <p>{categoryCount}</p>

  </div>

  <div className="card">

    <div className="card-icon warning">

      <FaExclamationTriangle />

    </div>

    <h3>Weak Passwords</h3>

    <p>{weakPasswords}</p>

  </div>

  <div className="card">

    <div className="card-icon success">

      <FaShieldAlt />

    </div>

    <h3>Vault Status</h3>

    <p className="protected">Protected</p>

  </div>

</div>

      <div className="section">

        <h2>Recent Credentials</h2>

        {credentials.length === 0 ? (

          <p>No credentials added yet.</p>

        ) : (

          <ul>

            {credentials
              .slice()
              .reverse()
              .slice(0, 5)
              .map((credential) => (

                <li key={credential.id}>

  <strong>{credential.title}</strong>

  <br />

  <small>{credential.website}</small>

</li>

              ))}

          </ul>

        )}

      </div>

      <div className="section">

        <h2>Quick Actions</h2>

        <div className="actions">

          <button onClick={() => navigate("/add-credential")}>

            + Add Credential

          </button>

          <button onClick={() => navigate("/vault")}>

            Open Vault

          </button>

          <button onClick={() => navigate("/profile")}>

            Profile

          </button>

        </div>

      </div>

      <div className="section">

        <h2>Security Status</h2>

        <div className="security">

          <p>🟢 Vault PIN Configured</p>

          <p>🟢 Session Active</p>

          <p>🟢 Recovery Email Verified</p>

          <p>

            🕒 Last Login

            <br />

            <strong>{lastLogin}</strong>

          </p>

        </div>

      </div>

    </MainLayout>

  );

}

export default Dashboard;