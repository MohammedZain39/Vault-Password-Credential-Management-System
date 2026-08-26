import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";
import {
    FaEye,
    FaEyeSlash,
    FaShareAlt,
    FaClock,
    FaEdit,
    FaLock
} from "react-icons/fa";
import "./SharedCredentials.css";

function SharedCredentials() {

    const navigate = useNavigate();

    const [credentials, setCredentials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [visiblePasswords, setVisiblePasswords] = useState({});


    useEffect(() => {

        fetchSharedCredentials();

    }, []);


    async function fetchSharedCredentials() {

        try {

            const response = await API.get("/credentials/shared");

            setCredentials(response.data);

        } catch (error) {

            console.error(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to load shared credentials."
            );

        } finally {

            setLoading(false);

        }

    }


    function togglePassword(id) {

        setVisiblePasswords(prev => ({
            ...prev,
            [id]: !prev[id]
        }));

    }


    function formatDate(date) {

        if (!date) return "No expiry";

        return new Date(date).toLocaleString();

    }


    function isExpired(date) {

        if (!date) return false;

        return new Date(date) <= new Date();

    }


    /*
     * ==========================
     * PERMISSION HELPERS
     * ==========================
     */

    function isEditAllowed(credential) {

        return credential.permissionLevel === "EDIT";

    }


    function getPermissionLabel(permission) {

        if (permission === "EDIT") {

            return "Edit Access";

        }

        return "View Only";

    }


    if (loading) {

        return (

            <MainLayout>

                <div className="shared-loading">
                    Loading shared credentials...
                </div>

            </MainLayout>

        );

    }


    return (

        <MainLayout>

            <div className="shared-page">


                {/* ==========================
                    HEADER
                ========================== */}

                <div className="shared-header">

                    <div>

                        <div className="shared-title">

                            <FaShareAlt />

                            <h1>Shared With Me</h1>

                        </div>

                        <p>
                            Credentials shared with your SecureVault account
                        </p>

                    </div>


                    <div className="shared-count">

                        {credentials.length}

                        <span>
                            {credentials.length === 1
                                ? " Credential"
                                : " Credentials"}
                        </span>

                    </div>

                </div>


                {/* ==========================
                    ERROR
                ========================== */}

                {message && (

                    <div className="shared-message">

                        {message}

                    </div>

                )}


                {/* ==========================
                    EMPTY STATE
                ========================== */}

                {credentials.length === 0 && !message && (

                    <div className="shared-empty">

                        <div className="empty-icon">

                            <FaShareAlt />

                        </div>

                        <h2>No Shared Credentials</h2>

                        <p>
                            When someone shares a credential with you,
                            it will appear here.
                        </p>

                    </div>

                )}


                {/* ==========================
                    CREDENTIALS
                ========================== */}

                {credentials.length > 0 && (

                    <div className="shared-grid">

                        {credentials.map((credential) => {

                            const expired =
                                isExpired(credential.expiresAt);

                            const visible =
                                visiblePasswords[credential.shareId];

                            const canEdit =
                                isEditAllowed(credential);


                            return (

                                <div
                                    className={`shared-card ${
                                        expired ? "expired" : ""
                                    }`}
                                    key={credential.shareId}
                                >


                                    {/* ==========================
                                        CARD TOP
                                    ========================== */}

                                    <div className="shared-card-top">

                                        <div className="credential-icon">
                                            🔐
                                        </div>

                                        <div>

                                            <h2>
                                                {credential.title}
                                            </h2>

                                            <span className="category">

                                                {credential.category ||
                                                    "General"}

                                            </span>

                                        </div>

                                    </div>


                                    {/* ==========================
                                        PERMISSION
                                    ========================== */}

                                    <div
                                        className={`permission-badge ${
                                            canEdit
                                                ? "permission-edit"
                                                : "permission-view"
                                        }`}
                                    >

                                        {canEdit ? (
                                            <FaEdit />
                                        ) : (
                                            <FaLock />
                                        )}

                                        <span>

                                            {getPermissionLabel(
                                                credential.permissionLevel
                                            )}

                                        </span>

                                    </div>


                                    {/* ==========================
                                        WEBSITE
                                    ========================== */}

                                    <div className="credential-row">

                                        <span className="label">
                                            Website
                                        </span>

                                        <span className="value">
                                            {credential.website}
                                        </span>

                                    </div>


                                    {/* ==========================
                                        USERNAME
                                    ========================== */}

                                    <div className="credential-row">

                                        <span className="label">
                                            Username
                                        </span>

                                        <span className="value">
                                            {credential.username}
                                        </span>

                                    </div>


                                    {/* ==========================
                                        PASSWORD
                                    ========================== */}

                                    <div className="credential-row password-row">

                                        <span className="label">
                                            Password
                                        </span>

                                        <div className="password-value">

                                            <span>

                                                {visible
                                                    ? credential.password
                                                    : "••••••••••••"}

                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    togglePassword(
                                                        credential.shareId
                                                    )
                                                }
                                                title={
                                                    visible
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >

                                                {visible
                                                    ? <FaEyeSlash />
                                                    : <FaEye />}

                                            </button>

                                        </div>

                                    </div>


                                    {/* ==========================
                                        SHARED BY
                                    ========================== */}

                                    <div className="shared-by">

                                        <span className="label">
                                            Shared by
                                        </span>

                                        <strong>
                                            {credential.sharedBy}
                                        </strong>

                                    </div>


                                    {/* ==========================
                                        EXPIRY
                                    ========================== */}

                                    <div className="expiry-row">

                                        <FaClock />

                                        {expired ? (

                                            <span className="expired-text">
                                                Share Expired
                                            </span>

                                        ) : credential.expiresAt ? (

                                            <span>

                                                Expires:{" "}

                                                {formatDate(
                                                    credential.expiresAt
                                                )}

                                            </span>

                                        ) : (

                                            <span>
                                                No Expiry
                                            </span>

                                        )}

                                    </div>


                                    {/* ==========================
                                        NOTES
                                    ========================== */}

                                    {credential.notes && (

                                        <div className="shared-notes">

                                            <span className="label">
                                                Notes
                                            </span>

                                            <p>
                                                {credential.notes}
                                            </p>

                                        </div>

                                    )}


                                    {/* ==========================
                                        ACTIONS
                                    ========================== */}

                                    <div className="shared-actions">


                                        {/* VIEW */}

                                        <button
                                            type="button"
                                            className="shared-view-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/credential/${credential.credentialId}`
                                                )
                                            }
                                            disabled={expired}
                                        >

                                            <FaEye />

                                            View

                                        </button>


                                        {/* EDIT ONLY IF EDIT ACCESS */}

                                        {canEdit && !expired && (

                                            <button
                                                type="button"
                                                className="shared-edit-btn"
                                                onClick={() =>
                                                    navigate(
                                                        `/edit-credential/${credential.credentialId}`
                                                    )
                                                }
                                            >

                                                <FaEdit />

                                                Edit

                                            </button>

                                        )}

                                    </div>


                                    {/* ==========================
                                        VIEW ONLY MESSAGE
                                    ========================== */}

                                    {!canEdit && !expired && (

                                        <div className="view-only-message">

                                            <FaLock />

                                            <span>
                                                View only access
                                            </span>

                                        </div>

                                    )}


                                </div>

                            );

                        })}

                    </div>

                )}


            </div>

        </MainLayout>

    );

}


export default SharedCredentials;