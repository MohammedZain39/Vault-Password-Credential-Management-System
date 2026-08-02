import { NavLink, useNavigate } from "react-router-dom";
import { FaLock, FaThLarge, FaShieldAlt , FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {

  const navigate = useNavigate();

  function handleLogout() {

    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

    navigate("/login", { replace: true });

  }

  return (

    <nav className="navbar">

      <div className="logo">

        <FaLock className="logo-icon" />

        <span>SecureVault</span>

      </div>

      <div className="nav-links">

        <NavLink to="/dashboard">

          <FaThLarge />

          Dashboard

        </NavLink>

        <NavLink to="/vault">

          <FaShieldAlt />

          Vault

        </NavLink>

        <NavLink to="/profile">

          <FaUserCircle />

          Profile

        </NavLink>

      </div>

      <button
        className="logout-btn"
        onClick={handleLogout}
      >

        <FaSignOutAlt />

        Logout

      </button>

    </nav>

  );

}

export default Navbar;