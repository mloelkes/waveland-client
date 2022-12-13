import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [imageToUpload, setImageToUpload] = useState(undefined);
    const [uploadImageLabel, setUploadImageLabel] = useState("Choose profile picture");
    const [errorMessage, setErrorMessage] = useState(undefined);

    const API_URL = process.env.REACT_APP_API_URL;

    const navigate = useNavigate();

    function handleEmail(e) {
        setEmail(e.target.value);
    }

    function handlePassword(e) {
        setPassword(e.target.value);
    }

    function handleName(e) {
        setName(e.target.value);
    }

    function handleLocation(e) {
        setLocation(e.target.value);
    }

    function handleDescription(e) {
        setDescription(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();

        // Upload file
        const uploadData = new FormData();
        uploadData.append("imageUrl", imageToUpload);

        axios.post(`${API_URL}/api/auth/imageUpload`, uploadData)
        .then(response => {
            const imageUrl = response.data.imageUrl;

            const nameForUrl = name.toLowerCase().split(" ").join("");
            const tracks = [];
            const followers = [];
            const following = [];
            const likes = [];

            console.log("NAME FOR URL: ", nameForUrl)

            // Create user
            const requestBody = { email, password, name, nameForUrl, location, description, imageUrl, tracks, followers, following, likes }
            axios.post(`${API_URL}/api/auth/signup`, requestBody)
            .then(() => {
                navigate("/login");
            })
            .catch(err => {
                const errorDescription = err.response.data.message;
                setErrorMessage(errorDescription);
            })
        })
        .catch(err => {
            const errorDescription = err.response.data.message;
            setErrorMessage(errorDescription);
        });
    };

    function handleImageUploadButtonClick(e) {
        e.target.id = "upload-image-button-disabled";
        document.getElementById("upload-image").click();
    }
    
    function handleImageToUploadChange(e) {
        const file = e.target.files[0];
        setImageToUpload(file);
        setUploadImageLabel(file.name);
    }

	return (
        <div className="Signup">

		    <h1>Create your Waveland account</h1>
            <form onSubmit={handleSubmit}>
                <span>
                    <input type="text" placeholder="E-Mail" value={email} onChange={handleEmail}></input>
                    <input type="password" placeholder="Password" value={password} onChange={handlePassword}></input>
                </span>
                <span>
                    <input type="text" placeholder="Name" value={name} onChange={handleName}></input>
                    <input type="text" placeholder="Location" value={location} onChange={handleLocation}></input>
                </span>
                <span>
                    <input placeholder="Description" value={description} onChange={handleDescription}></input>
                    <input type="button" id="upload-image-button" value={uploadImageLabel} onClick={(e) => handleImageUploadButtonClick(e)}/>
                    <input id="upload-image" type="file" onChange={(e) => handleImageToUploadChange(e)}></input>
                </span>
                <button className="primary-button" type="submit">Sign Up</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
	)
}

export default Signup;
