import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";
import {
  FaUserCircle,
  FaEnvelope,
  FaKey,
  FaFolder,
  FaShieldAlt,
  FaLock
} from "react-icons/fa";
import "./Profile.css";

function Profile() {

  const [user, setUser] = useState({
    fullName: "",
    email: ""
  });

  const [credentialCount, setCredentialCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);

  useEffect(() => {

    loadProfile();

  }, []);

  async function loadProfile() {

    try {

      const email = localStorage.getItem("userEmail");

      setUser({
        fullName: email.split("@")[0],
        email
      });

      const response = await API.get("/credentials");

      setCredentialCount(response.data.length);

      const categories = new Set(
        response.data.map(c => c.category || "Others")
      );

      setCategoryCount(categories.size);

    } catch (error) {

      console.log(error);

    }

  }

  return (

    <MainLayout>

      <div className="profile-container">

        <div className="profile-card">

          <FaUserCircle className="profile-avatar" />

          <h2>{user.fullName}</h2>

          <p>{user.email}</p>

          <span className="status">
            Active User
          </span>

        </div>

        <div className="profile-grid">

          <div className="info-card">

            <h3>Account Information</h3>

            <p>

              <FaUserCircle />

              <strong>Name</strong>

              {user.fullName}

            </p>

            <p>

              <FaEnvelope />

              <strong>Email</strong>

              {user.email}

            </p>

            <p>

              <FaShieldAlt />

              <strong>Role</strong>

              User

            </p>

          </div>

          <div className="info-card">

            <h3>Vault Statistics</h3>

            <p>

              <FaKey />

              <strong>Credentials</strong>

              {credentialCount}

            </p>

            <p>

              <FaFolder />

              <strong>Categories</strong>

              {categoryCount}

            </p>

            <p>

              <FaLock />

              <strong>Vault PIN</strong>

              Configured

            </p>

          </div>

        </div>

        <div className="security-card">

          <h3>Security Status</h3>

          <div className="security-list">

            <div>✅ JWT Session Active</div>

            <div>✅ AES Encrypted Credentials</div>

            <div>✅ Vault Protected</div>

            <div>✅ Email Verified</div>

          </div>

        </div>

      </div>

    </MainLayout>

  );

}

export default Profile;