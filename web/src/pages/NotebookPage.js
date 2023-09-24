import React, {useEffect, useState} from 'react';
import '../App.css';
import axios from 'axios';
import { api } from "../config/Api";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function NotebookPage() {
    const [showAddNoteForm, setShowAddNoteForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [noteTitle, setNoteTitle] = useState("");
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();
    const location = useLocation()
    const [error, setError] = useState("");
    const notebookId = location.state.notebookId
    const user = location.state.user

    useEffect(() => {
        // Fetch user's notebooks from the backend
        const fetchNotebooks = async () => {
            try {
                const response = await axios.get(api + `/notes//get-by-notebook/${notebookId}`
                ).then((response) => {
                    if (response.data.hasOwnProperty("message")) {
                        setError(response.data.message);
                    } else {
                        setNotes(response.data);
                        console.log("Note data: ", response.data)                    }
                })  // Replace with the actual endpoint
            } catch (error) {
                console.log("Error fetching notebooks", error);
            }
        };
        fetchNotebooks();
    }, []);
    const handleAddNote = () => {
        // Handle the logic for adding a note
    };

    const handleEditNotebook = () => {
        // Handle the logic for editing the notebook
    };

    const handleDeleteNotebook = () => {
        // Handle the logic for deleting the notebook
    };

    async function handleNoteClick(noteId) {
        try {
            const response = await axios.get(api + `/notes/get-by-id`, {
                id: noteId,
            }).then((response) => {
                navigate('/notes', {state: {noteId: noteId}});
            })
        } catch (error) {
            console.log("Error", error);
        }
    };

    return (
        <div className="container">
            <div className="menu-bar">
                <img src={require("../media/notably-black.png")} alt="Logo" className="logo" onClick={() => navigate('/')} />
            </div>

            {/* Page Content */}
            <div className="content">
                {/* Left 2/3 */}
                <div className="left-content">
                    <h1 className="notebook-title">Notebook Title</h1>
                    <p className="notebook-description">Notebook Description</p>
                    <h2 className="my-notes-title">My Notes</h2>

                    {/* Display Notes */}
                    <div className="notes-grid">
                        {notes.map(note => (
                            <div key={note.id} className="note-card">
                                <button className="note-button" onClick={() => handleNoteClick(note.id)}>
                                    <img src={require("../media/note-icon.png")} alt="Note Icon" className="note-icon" />
                                    <h3>{note.title}</h3>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right 1/3 */}
                <div className="right-content">
                    {showAddNoteForm ? (
                        <>
                            <input type="text" placeholder="Title" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
                            {/* Drag and Drop Area */}
                            <div className="drag-drop-area">
                                Drag & Drop Files Here
                            </div>
                            {/* Upload File Button */}
                            <button className="upload-file-button">Upload File</button>
                        </>
                    ) : (
                        <button className="add-note-button" onClick={() => setShowAddNoteForm(true)}>Add Note</button>
                    )}

                    {showEditForm ? (
                        <>
                            {/* Edit Notebook Form */}
                            <input type="text" placeholder="New Title" />
                            <textarea placeholder="New Description"></textarea>
                            <button onClick={handleEditNotebook}>Save Changes</button>
                        </>
                    ) : (
                        <button className="edit-notebook-button" onClick={() => setShowEditForm(true)}>Edit Notebook</button>
                    )}

                    <button className="delete-notebook-button" onClick={handleDeleteNotebook}>Delete Notebook</button>
                </div>
            </div>
        </div>
    );
}

export default NotebookPage;
