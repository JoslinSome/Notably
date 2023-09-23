import React from 'react';
import './App.css';

function App() {
    return (
        <div className="app">
            <div className="menu-bar">
                <img src={require("./media/notably-black.png")} alt="Logo" className="logo" onClick={() => window.location.href = "/"} />
                <button className="login-button-top">
                    Login
                </button>
            </div>

            <div className="content">
                <div className="left-content">
                    <img src={require("./media/notably-graphic.png")} alt="Background" className="background-image" />
                </div>
                <div className="right-content">
                    <button className="get-started-button">
                        Get Started
                    </button>
                    <button className="login-button">
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
