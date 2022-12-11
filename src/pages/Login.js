import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.js";
import { UserDetailsContext } from "../context/userDetails.js";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(undefined);

    const navigate = useNavigate();

    const { storeToken, verifyStoredToken } = useContext(AuthContext);
    const { getUserDetails } = useContext(UserDetailsContext);

    function handleEmail(e) {
        setEmail(e.target.value);
    }

    function handlePassword(e) {
        setPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        const requestBody = { email, password }

        axios.post("/api/auth/login", requestBody)
        .then(response => {
            const token = response.data.authToken;
            storeToken(token);
            verifyStoredToken()
					.then(() => {
                        getUserDetails();
						navigate("/dashboard");
					})
        })
        .catch(err => {
            const errorDescription = err.response.data.message;
            setErrorMessage(errorDescription);
        });
    };

	return (
        <div className="Login">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>

                    <input type="text" placeholder="E-Mail" value={email} onChange={handleEmail}></input>
                    <input type="password" placeholder="Password" value={password} onChange={handlePassword}></input>

                <button className="primary-button" type="submit">Login</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
		    
        </div>
	)
}

export default Login;
