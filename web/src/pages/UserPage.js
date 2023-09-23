import React from 'react';
import '../App.css';

function UserPage() {
    return (
        <div>
            {/* Menu bar */}
            <div className="menu-bar">
                <img src={require("../media/notably-black.png")} alt="Logo" className="logo" onClick={() => window.location.href = "/"} />
            </div>

            {/* Page Content */}
            <div className="user-content">
                <h1 className="">My Notebooks</h1>
                <h1 className="my-notebooks-title">My Notebooks</h1>
                <button className="create-notebook-button">Create Notebook</button>
                {/* ... Other user content ... */}
            </div>
        </div>
    );
}

export default UserPage;


