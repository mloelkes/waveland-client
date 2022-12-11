import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDetailsContext = React.createContext();

function UserDetailsContextProvider(props) {
    const [userDetails, setUserDetails] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	function getUserDetails () {
		const storedToken = getStoredToken();

		if (storedToken) {
			return axios.get("/api/auth/verify", { headers: { Authorization: `Bearer ${storedToken}` } })
			.then(response => {
				const user = response.data;

                axios.get(`api/users/${user._id}`, { headers: { Authorization: `Bearer ${storedToken}` } })
                .then(response => {
                    setUserDetails(response.data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.log("Error occured when getting userDetails: ", err);
                    setUserDetails(null);
                    setIsLoading(false);
                })
			})
			.catch(err => {
				console.log("Error occured when getting user: ", err);
				setIsLoading(false)
			})
		} else {
			// there is no token in local storage
            setUserDetails(null);
			setIsLoading(false)
		}
	}

    function resetUserDetails() {
        setUserDetails(null);
    }

    function getStoredToken() {
        return localStorage.getItem("authToken");
    }

	useEffect(() => {
		getUserDetails();
	}, [])

	return (
		<UserDetailsContext.Provider value={{ userDetails, getUserDetails, resetUserDetails, getStoredToken }}>
			{props.children}
		</UserDetailsContext.Provider>
	)
}

export { UserDetailsContextProvider, UserDetailsContext }
