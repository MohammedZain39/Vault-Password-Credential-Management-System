import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import API from "../services/api";

import {
    FaKey,
    FaFolder,
    FaShieldAlt,
    FaExclamationTriangle,
    FaFileAlt,
    FaArrowRight,
    FaCheckCircle,
    FaClock,
    FaLock,
} from "react-icons/fa";

import "./Dashboard.css";


function Dashboard() {

    const navigate = useNavigate();

    const [credentials, setCredentials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================================
    // GREETING
    // =========================================================

    const getGreeting = () => {

        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) {
            return {
                text: "Good Morning",
                emoji: "☀️",
            };
        }

        if (hour >= 12 && hour < 17) {
            return {
                text: "Good Afternoon",
                emoji: "🌤️",
            };
        }

        if (hour >= 17 && hour < 21) {
            return {
                text: "Good Evening",
                emoji: "🌆",
            };
        }

        return {
            text: "Good Night",
            emoji: "🌙",
        };
    };


    const greeting = getGreeting();


    // =========================================================
    // LOAD CREDENTIALS
    // =========================================================

    useEffect(() => {

        async function loadCredentials() {

            try {

                setLoading(true);
                setError("");

                const response = await API.get("/credentials");

                setCredentials(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            } catch (err) {

                console.error(
                    "Failed to load dashboard:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load your dashboard data."
                );

            } finally {

                setLoading(false);

            }
        }

        loadCredentials();

    }, []);


    // =========================================================
    // STATISTICS
    // =========================================================

    const credentialCount = credentials.length;


    const categoryCount =
        new Set(
            credentials.map(
                credential =>
                    credential.category || "Others"
            )
        ).size;


    const weakPasswords =
        credentials.filter(
            credential =>
                (credential.password || "").length < 8
        ).length;


    // =========================================================
    // RECENT CREDENTIALS
    // ONLY SHOW 3
    // =========================================================

    const recentCredentials =
        credentials
            .slice()
            .reverse()
            .slice(0, 3);


    // =========================================================
    // DATE FORMAT
    // =========================================================

    const getRelativeTime = (date) => {

        if (!date) {
            return "Recently added";
        }

        const createdDate = new Date(date);

        if (Number.isNaN(createdDate.getTime())) {
            return "Recently added";
        }

        const now = new Date();

        const difference =
            now.getTime() -
            createdDate.getTime();

        const seconds =
            Math.floor(difference / 1000);

        const minutes =
            Math.floor(seconds / 60);

        const hours =
            Math.floor(minutes / 60);

        const days =
            Math.floor(hours / 24);


        if (days === 0) {

            if (hours === 0) {

                if (minutes <= 1) {
                    return "Just now";
                }

                return `${minutes} min ago`;
            }

            return `${hours} hr ago`;
        }


        if (days === 1) {
            return "Yesterday";
        }


        if (days < 7) {
            return `${days} days ago`;
        }


        if (days < 30) {
            const weeks =
                Math.floor(days / 7);

            return weeks === 1
                ? "1 week ago"
                : `${weeks} weeks ago`;
        }


        return createdDate.toLocaleDateString();
    };


    // =========================================================
    // GET CREDENTIAL DATE
    // =========================================================

    const getCredentialDate = (credential) => {

        return (
            credential.createdAt ||
            credential.createdDate ||
            credential.updatedAt ||
            credential.updatedDate ||
            null
        );
    };


    // =========================================================
    // GET CREDENTIAL BRAND
    // =========================================================

    const getBrandClass = (title = "") => {

        const value =
            title.toLowerCase();

        if (value.includes("google")) {
            return "google-brand";
        }

        if (value.includes("github")) {
            return "github-brand";
        }

        if (value.includes("amazon")) {
            return "amazon-brand";
        }

        return "default-brand";
    };


    const getBrandContent = (credential) => {

        const title =
            credential.title || "Credential";

        const value =
            title.toLowerCase();


        if (value.includes("google")) {
            return "G";
        }

        if (value.includes("github")) {
            return "●";
        }

        if (value.includes("amazon")) {
            return "a";
        }

        return <FaKey />;
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <MainLayout>

                <div className="dashboard-loading">

                    <div className="loading-spinner"></div>

                    <span>
                        Loading your SecureVault...
                    </span>

                </div>

            </MainLayout>
        );
    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <MainLayout>

            <div className="dashboard">


                {/* =================================================
                    WELCOME BANNER
                ================================================= */}

                <section className="welcome-banner">

                    <div className="welcome-content">

                        <div className="welcome-small-title">
                            YOUR VAULT, YOUR CONTROL
                        </div>


                        <h1>

                            {greeting.text}

                            <span className="greeting-emoji">
                                {greeting.emoji}
                            </span>

                        </h1>


                        <p>
                            Your SecureVault is protected
                            and ready for you today.
                        </p>

                    </div>


                    {/* RIGHT SIDE VISUAL */}

                    <div className="welcome-visual">

                        <div className="hero-shield">

                            <FaShieldAlt />

                            <FaLock className="hero-lock" />

                        </div>


                        <div className="hero-message">

                            <span>
                                Small steps
                            </span>

                            <span>
                                for a safer
                            </span>

                            <span>
                                digital you.
                            </span>

                        </div>

                    </div>

                </section>



                {/* =================================================
                    STATISTICS
                ================================================= */}

                <section className="dashboard-stats">


                    {/* CREDENTIALS */}

                    <div
                        className="stat-card"
                        onClick={() => navigate("/vault")}
                        style={{ cursor: "pointer" }}
                    >

                        <div className="stat-icon blue-icon">

                            <FaKey />

                        </div>


                        <div className="stat-content">

                            <span className="stat-label">
                                Credentials
                            </span>

                            <strong>
                                {credentialCount}
                            </strong>

                            <span className="stat-description">
                                Saved securely
                            </span>

                        </div>


                        <FaArrowRight className="stat-arrow" />

                        <div className="stat-wave blue-wave"></div>

                    </div>



                    {/* CATEGORIES */}

                    <div className="stat-card">

                        <div className="stat-icon purple-icon">

                            <FaFolder />

                        </div>


                        <div className="stat-content">

                            <span className="stat-label">
                                Categories
                            </span>

                            <strong>
                                {categoryCount}
                            </strong>

                            <span className="stat-description">
                                Organized collections
                            </span>

                        </div>


                        <FaArrowRight className="stat-arrow" />

                        <div className="stat-wave purple-wave"></div>

                    </div>



                    {/* WEAK PASSWORDS */}

                    <div className="stat-card">

                        <div className="stat-icon yellow-icon">

                            <FaExclamationTriangle />

                        </div>


                        <div className="stat-content">

                            <span className="stat-label">
                                Weak Passwords
                            </span>

                            <strong>
                                {weakPasswords}
                            </strong>

                            <span className="stat-description">

                                {weakPasswords === 0
                                    ? "No issues detected"
                                    : "Needs attention"
                                }

                            </span>

                        </div>


                        <FaArrowRight className="stat-arrow" />

                        <div className="stat-wave yellow-wave"></div>

                    </div>



                    {/* VAULT STATUS */}

                    <div className="stat-card">

                        <div className="stat-icon green-icon">

                            <FaShieldAlt />

                        </div>


                        <div className="stat-content">

                            <span className="stat-label">
                                Vault Status
                            </span>

                            <strong className="protected-text">
                                Protected
                            </strong>

                            <span className="stat-description">
                                All systems secure
                            </span>

                        </div>


                        <FaArrowRight className="stat-arrow" />

                        <div className="stat-wave green-wave"></div>

                    </div>

                </section>



                {/* =================================================
                    ERROR MESSAGE
                ================================================= */}

                {error && (

                    <div
                        style={{
                            marginBottom: "15px",
                            padding: "12px 16px",
                            background: "#fff1f2",
                            border: "1px solid #fecdd3",
                            borderRadius: "10px",
                            color: "#be123c",
                            fontSize: "13px",
                        }}
                    >
                        {error}
                    </div>

                )}



                {/* =================================================
                    BOTTOM SECTION
                ================================================= */}

                <section className="dashboard-bottom">


                    {/* =================================================
                        RECENT CREDENTIALS
                    ================================================= */}

                    <div className="dashboard-panel recent-panel">


                        <div className="panel-header">

                            <div className="panel-title-wrapper">

                                <div className="panel-icon blue-panel-icon">

                                    <FaFileAlt />

                                </div>


                                <div>

                                    <h2>
                                        Recent Credentials
                                    </h2>

                                    <p>
                                        Your most recently added accounts
                                    </p>

                                </div>

                            </div>


                            <button
                                type="button"
                                className="view-all-btn"
                                onClick={() =>
                                    navigate("/vault")
                                }
                            >

                                View All

                                <FaArrowRight />

                            </button>

                        </div>



                        {/* =================================================
                            EMPTY STATE
                        ================================================= */}

                        {recentCredentials.length === 0 && (

                            <div
                                style={{
                                    minHeight: "150px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    color: "#6983a4",
                                }}
                            >

                                <FaFileAlt
                                    style={{
                                        fontSize: "30px",
                                        marginBottom: "10px",
                                        color: "#b8cbe0",
                                    }}
                                />

                                <strong
                                    style={{
                                        color: "#405d80",
                                        fontSize: "14px",
                                    }}
                                >
                                    No credentials added yet.
                                </strong>

                                <span
                                    style={{
                                        marginTop: "5px",
                                        fontSize: "12px",
                                    }}
                                >
                                    Start by adding your first credential.
                                </span>

                            </div>

                        )}



                        {/* =================================================
                            CREDENTIAL LIST
                        ================================================= */}

                        {recentCredentials.length > 0 && (

                            <div className="credentials-list">

                                {recentCredentials.map(
                                    (credential, index) => (

                                        <div
                                            className="sv-dashboard-credential-row"
                                            key={
                                                credential.id ||
                                                credential.credentialId ||
                                                index
                                            }
                                        >


                                            {/* BRAND */}

                                            <div
                                                className={`sv-dashboard-credential-brand ${getBrandClass(
                                                    credential.title
                                                )}`}
                                            >

                                                {getBrandContent(
                                                    credential
                                                )}

                                            </div>



                                            {/* INFO */}

                                            <div className="sv-dashboard-credential-info">

                                                <strong>
                                                    {credential.title ||
                                                        "Untitled Credential"}
                                                </strong>

                                                <span>
                                                    {credential.website ||
                                                        "No website specified"}
                                                </span>

                                            </div>



                                            {/* CATEGORY */}

                                            <span className="sv-dashboard-credential-category">

                                                {credential.category ||
                                                    "Others"}

                                            </span>



                                            {/* TIME */}

                                            <span className="sv-dashboard-credential-time">

                                                {getRelativeTime(
                                                    getCredentialDate(
                                                        credential
                                                    )
                                                )}

                                            </span>



                                            {/* ARROW */}

                                            <FaArrowRight
                                                className="sv-dashboard-credential-arrow"
                                            />

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>



                    {/* =================================================
                        SECURITY STATUS
                    ================================================= */}

                    <div className="dashboard-panel security-panel">


                        <div className="panel-header">

                            <div className="panel-title-wrapper">

                                <div className="panel-icon green-panel-icon">

                                    <FaShieldAlt />

                                </div>


                                <div>

                                    <h2>
                                        Security Status
                                    </h2>

                                    <p>
                                        Your account security at a glance
                                    </p>

                                </div>

                            </div>


                            <div className="operational-badge">

                                <span></span>

                                Operational

                            </div>

                        </div>



                        {/* SECURITY ITEMS */}

                        <div className="security-list">


                            {/* VAULT PIN */}

                            <div className="sv-dashboard-security-item">

                                <div className="sv-dashboard-security-icon">

                                    <FaLock />

                                </div>


                                <div className="sv-dashboard-security-info">

                                    <strong>
                                        Vault PIN Configured
                                    </strong>

                                    <span>
                                        Vault protection enabled
                                    </span>

                                </div>


                                <FaCheckCircle
                                    className="sv-dashboard-security-check"
                                />

                            </div>



                            {/* SESSION */}

                            <div className="sv-dashboard-security-item">

                                <div className="sv-dashboard-security-icon">

                                    <FaShieldAlt />

                                </div>


                                <div className="sv-dashboard-security-info">

                                    <strong>
                                        Session Active
                                    </strong>

                                    <span>
                                        Secure session currently active
                                    </span>

                                </div>


                                <FaCheckCircle
                                    className="sv-dashboard-security-check"
                                />

                            </div>



                            {/* RECOVERY EMAIL */}

                            <div className="sv-dashboard-security-item">

                                <div className="sv-dashboard-security-icon">

                                    <FaShieldAlt />

                                </div>


                                <div className="sv-dashboard-security-info">

                                    <strong>
                                        Recovery Email Verified
                                    </strong>

                                    <span>
                                        Account recovery enabled
                                    </span>

                                </div>


                                <FaCheckCircle
                                    className="sv-dashboard-security-check"
                                />

                            </div>



                            {/* LAST LOGIN */}

                            <div className="sv-dashboard-security-item last-login">

                                <div className="sv-dashboard-security-icon">

                                    <FaClock />

                                </div>


                                <div className="sv-dashboard-security-info">

                                    <strong>
                                        Last Login
                                    </strong>

                                    <span>
                                        {new Date().toLocaleString()}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>



                {/* =================================================
                    FOOTER
                ================================================= */}

                <footer className="dashboard-footer">


                    <div className="footer-brand">

                        <div className="footer-lock">

                            <FaLock />

                        </div>


                        <div>

                            <strong>
                                SecureVault
                            </strong>

                            <span>
                                Encrypted Today. Safer Tomorrow.
                            </span>

                        </div>

                    </div>



                    <div className="footer-links">

                        <span>
                            Privacy
                        </span>

                        <i>|</i>

                        <span>
                            Terms
                        </span>

                        <i>|</i>

                        <span>
                            Support
                        </span>

                        <span className="footer-version">
                            v1.0.0
                        </span>

                    </div>

                </footer>


            </div>

        </MainLayout>
    );
}


export default Dashboard;