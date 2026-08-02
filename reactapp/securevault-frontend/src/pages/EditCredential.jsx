import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import "./AddCredential.css";

function EditCredential() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: "",
        website: "",
        username: "",
        password: "",
        category: "",
        notes: ""
    });

    const [message, setMessage] = useState("");

    useEffect(() => {

        async function loadCredential() {

            try {

                const response = await API.get(`/credentials/${id}`);

                setFormData({
                    title: response.data.title || "",
                    website: response.data.website || "",
                    username: response.data.username || "",
                    password: response.data.password || "",
                    category: response.data.category || "",
                    notes: response.data.notes || ""
                });

            } catch (error) {

                console.error(error);

                alert("Unable to load credential.");

                navigate("/vault");

            } finally {

                setLoading(false);

            }

        }

        loadCredential();

    }, [id, navigate]);

    function handleChange(e) {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    }

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            const response = await API.put(

                `/credentials/${id}`,

                formData

            );

            alert(response.data.message);

            navigate("/vault");

        } catch (error) {

            setMessage(

                error.response?.data?.message ||

                "Update Failed"

            );

        }

    }

    if (loading) {

        return (

            <div className="add-container">

                <h2>Loading...</h2>

            </div>

        );

    }

    return (

        <div className="add-container">

            <form

                className="add-form"

                onSubmit={handleSubmit}

            >

                <h2>Edit Credential</h2>

                <input

                    name="title"

                    placeholder="Title"

                    value={formData.title}

                    onChange={handleChange}

                    required

                />

                <input

                    name="website"

                    placeholder="Website"

                    value={formData.website}

                    onChange={handleChange}

                    required

                />

                <input

                    name="username"

                    placeholder="Username"

                    value={formData.username}

                    onChange={handleChange}

                    required

                />

                <input

                    type="password"

                    name="password"

                    placeholder="Password"

                    value={formData.password}

                    onChange={handleChange}

                    required

                />

                <input

                    name="category"

                    placeholder="Category"

                    value={formData.category}

                    onChange={handleChange}

                />

                <textarea

                    name="notes"

                    rows="4"

                    placeholder="Notes"

                    value={formData.notes}

                    onChange={handleChange}

                />

                {message && (

                    <p className="error">

                        {message}

                    </p>

                )}

                <div className="buttons">

                    <button type="submit">

                        Update Credential

                    </button>

                    <button

                        type="button"

                        className="cancel-btn"

                        onClick={() => navigate("/vault")}

                    >

                        Cancel

                    </button>

                </div>

            </form>

        </div>

    );

}

export default EditCredential;