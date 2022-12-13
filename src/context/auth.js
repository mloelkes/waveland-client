import React, { useState, useEffect } from "react";
import axios from "axios";

const AuthContext = React.createContext();

const API_URL = process.env.REACT_APP_API_URL;

function AuthProviderWrapper(props) {
	const [user, setUser] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const storeToken = token => {
		// store this token in local storage
		localStorage.setItem("authToken", token);
	}

	const verifyStoredToken = () => {
		// check local storage if there is a token
		const storedToken = localStorage.getItem("authToken")
		if (storedToken) {
			return axios.get(`${API_URL}/api/auth/verify`, { headers: { Authorization: `Bearer ${storedToken}` } })
				.then(response => {
					const user = response.data
					setUser(user)
					setIsLoggedIn(true)
					setIsLoading(false)
				})
				.catch(err => {
					// the token is invalid
					setIsLoggedIn(false)
					setUser(null)
					setIsLoading(false)
				})
		} else {
			// there is no token in local storage
			setIsLoading(false)
		}
	}

	const logoutUser = () => {
		// remove the token from local storage
		localStorage.removeItem("authToken");
		setIsLoggedIn(false);
		setUser(null);
	}

	useEffect(() => {
		verifyStoredToken();
	}, [])

	return (
		<AuthContext.Provider value={{ isLoggedIn, user, isLoading, storeToken, verifyStoredToken, logoutUser }}>
			{props.children}
		</AuthContext.Provider>
	)
}

export { AuthProviderWrapper, AuthContext }
