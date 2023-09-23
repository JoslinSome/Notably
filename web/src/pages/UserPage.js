import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import {api} from "../config/Api";
import {useNavigate} from "react-router-dom";

function UserPage() {
    const [showCreationForm, setShowCreationForm] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [notebooks, setNotebooks] = useState([]);  // State to store fetched notebooks

    useEffect(() => {
        // Fetch user's notebooks from the backend
        const fetchNotebooks = async () => {
            try {
                const response = await axios.get(api + `/notebooks`);  // Replace with the actual endpoint
                setNotebooks(response.data);
            } catch (error) {
                console.log("Error fetching notebooks", error);
            }
        };

        fetchNotebooks();
    }, []);

    const handleCreateNotebook = async () => {
        try {
            const response = await axios.post(api + `/notebook/create`, {
                title: title,
                description: description
            });
            setMessage("Notebook Created!")
            setShowCreationForm(false);
            navigate('/user');
        } catch (error) {
            console.log("Error", error);
        }
        setShowCreationForm(false);
        navigate('/user');
    };

    return (
        <div className="container">
            {/* Menu bar */}
            <div className="menu-bar">
                <img src={require("../media/notably-black.png")} alt="Logo" className="logo" onClick={() => navigate('/')} />
            </div>

            {/* Page Content */}
            <div className="content">
                {/* Left 2/3 */}
                <div className="left-content">
                    <h1 className="my-notebooks-title">My Notebooks</h1>

                    {/* Display Notebooks */}
                    <div className="notebooks-grid">
                        {notebooks.map(notebook => (
                            <div key={notebook.id} className="notebook-card">
                                <img src={notebook.imageURL} alt={notebook.title} />
                                <h3>{notebook.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right 1/3 */}
                <div className="right-content">
                    {!showCreationForm ? (
                        <button className="create-notebook-button" onClick={() => setShowCreationForm(true)}>Create Notebook</button>
                    ) : (
                        <div className="notebook-form">
                            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                            <button onClick={handleCreateNotebook}>Create</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserPage;

