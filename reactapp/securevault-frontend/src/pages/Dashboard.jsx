import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const email = localStorage.getItem("userEmail");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>SecureVault</h1>

        <p>Welcome{email ? `, ${email}` : ""}!</p>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;