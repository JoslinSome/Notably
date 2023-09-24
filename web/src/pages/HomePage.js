import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {api} from "../config/Api";
import '../App.css';
import{useCookies} from "react-cookie"

function HomePage() {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showSignUpForm, setShowSignUpForm] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [userNameLogin, setUserNameLogin] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [cookies,setCookie] = useCookies(["access-token","username"])
    console.log(cookies)

    const navigate = useNavigate();

    async function signUp() {
        if(firstName.length===0 || lastName.length===0 || userName.length===0 || password.length ===0){
            setError("Please fill out all fields");
            return;
        }
        if(userName.length<5 || password.length<6){
            setError("Username or Password too short");
            return;
        }
        if(password!==rePassword){
            setError("Passwords do not match");
            return;
        }
        const response = await axios.post(api+`/user/register`, {
            firstname: firstName,
            lastname: lastName,
            username: userName,
            password
        });
        setShowLoginForm(false)
        setShowSignUpForm(false)
        setMessage("Sign Up Successful!")
        navigate("/"); // Navigate back to home page after successful sign-up
    }

    async function signIn() {
        try {
            const response = await axios.post(`${api}/user/login`, {
                username: userNameLogin,
                password
            }).then((response) => {
                if (response.data.hasOwnProperty("message")) {
                    setError(response.data.message);
                } else {
                    setCookie("access-token", response.data.token);
                    setCookie("username", response.data.username);
                    setMessage("Sign In Successful!")
                    navigate('/user', {state: {user: response.data.user}});  // Navigate to user page after successful login
                }
            })
        } catch (error) {
            console.log("Error", error);
        }
    }
        return (
        <div className="app">
            <div className="menu-bar">
                <img src={require("../media/notably-black.png")} alt="Logo" className="logo" onClick={() => window.location.href = "/"} />
            </div>
            <div className="content">
                <div className="left-content">
                    <img src={require("../media/notably-graphic.png")} alt="Background" className="background-image" />
                </div>
                <div className="right-content">
                    {showLoginForm ? (
                        <>
                            <input type="text" placeholder="User ID" className="login-input" onChange={e=>setUserNameLogin(e.target.value)} />
                            <input type="password" placeholder="Password" className="login-input" onChange={e=>setPassword(e.target.value)} />
                            {error && <div className="error-message">{error}</div>}
                            <button className="login-submit-button" onClick={signIn}>Sign In</button>
                        </>
                    ) : showSignUpForm ? (
                        <>
                            <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} className="login-input" />
                            <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} className="login-input" />
                            <input type="text" placeholder="User Name" value={userName} onChange={e => setUserName(e.target.value)} className="login-input" />
                            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="login-input" />
                            <input type="password" placeholder="Re-Enter Password" value={rePassword} onChange={e => setRePassword(e.target.value)} className="login-input" />
                            {error && <div className="error-message">{error}</div>}
                            <button className="sign-up-button" onClick={signUp}>Sign Up</button>
                        </>
                    ) : (
                        <>
                            {message && <div className="message">{message}</div>}
                            <button className="get-started-button">
                                Get Started
                            </button>
                            <button className="login-button" onClick={() => setShowLoginForm(true)}>
                                Sign In
                            </button>
                            <button className="sign-up-button" onClick={() => setShowSignUpForm(true)}>
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePage;
