import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserDetailsContext } from "../context/userDetails.js";
import axios from "axios";

function UploadForm() {
    const { userDetails, getUserDetails } = useContext(UserDetailsContext);

    const API_URL = process.env.REACT_APP_API_URL;

    const [name, setName] = useState("");
    const [tag, setTag] = useState("");
    const [description, setDescription] = useState("");
    const [imageToUpload, setImageToUpload] = useState(undefined);
    const [uploadImageLabel, setUploadImageLabel] = useState("Select image");
    const [trackToUpload, setTrackToUpload] = useState(undefined);
    const [chooseTrackLabel, setChooseTrackLabel] = useState("Select Wave");
    const [uploadTrackLabel, setUploadTrackLabel] = useState("Upload Wave");
    const [trackUrl, setTrackUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState(undefined);

    const storedToken = localStorage.getItem('authToken');

    const navigate = useNavigate();

    // Upload track
    function handleUploadTrackButtonClick(e) {
        e.preventDefault();
        setUploadTrackLabel("Uploading Wave")

        const uploadTrackData = new FormData();
        uploadTrackData.append("trackUrl", trackToUpload);

        axios.post(`${API_URL}/api/trackUpload`, uploadTrackData, { headers: { Authorization: `Bearer ${storedToken}` } })
        .then(response => {
            setTrackUrl(response.data.trackUrl);
            setUploadTrackLabel("Wave uploaded");
        })
        .catch(err => {
            const errorDescription = err.response.data.message;
            setErrorMessage(errorDescription);
        })
    }

    // Submit uploaded track including metadata
    function handleSubmit(e) {
        e.preventDefault();

        const uploadImageData = new FormData();
        uploadImageData.append("imageUrl", imageToUpload);

        // Upload track image
        axios.post(`${API_URL}/api/imageUpload`, uploadImageData, { headers: { Authorization: `Bearer ${storedToken}` } })
        .then(response => {
            const user = userDetails._id;
            const imageUrl = response.data.imageUrl;

            // Create track
            const requestBody = { name, tag, description, imageUrl, trackUrl, user }
            axios.post(`${API_URL}/api/tracks`, requestBody, { headers: { Authorization: `Bearer ${storedToken}` } })
            .then((response) => {
                let tracks = userDetails.tracks.slice();
                tracks.push(response.data.track._id);
                const requestBody = { tracks };
                
                // Update user tracks
                axios.patch(`${API_URL}/api/users/${userDetails._id}/tracks`, requestBody, { headers: { Authorization: `Bearer ${storedToken}` } })
                .then(() => {
                    getUserDetails();
                    navigate("/dashboard");
                })
                .catch(err => {
                    const errorDescription = err.response.data.message;
                    setErrorMessage(errorDescription);
                })
            })
            .catch(err => {
                const errorDescription = err.response.data.message;
                setErrorMessage(errorDescription);
            })
        })
        .catch(err => {
            const errorDescription = err.response.data.message;
            setErrorMessage(errorDescription);
        })
    };

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleTagChange(e) {
        setTag(e.target.value);
    }

    function handleDescriptionChange(e) {
        setDescription(e.target.value);
    }

    function handleImageUploadButtonClick(e) {
        document.getElementById("upload-image").click();
    }
    
    function handleImageToUploadChange(e) {
        const file = e.target.files[0];
        setImageToUpload(file);
        setUploadImageLabel(file.name);
    }

    function handleChooseTrackButtonClick(e) {
        document.getElementById("choose-track").click();
    }
    
    function handleTrackToUploadChange(e) {
        const file = e.target.files[0];
        setTrackToUpload(file);
        setChooseTrackLabel(file.name);
    }

    return (
        <div className="UploadForm">
            <form onSubmit={handleSubmit}>
                <span>
                    <input type="text" placeholder="Name" value={name} onChange={handleNameChange}></input>
                    <input type="text" placeholder="Tag" value={tag} onChange={handleTagChange}></input>
                </span>
                <span>
                    <input type="text" placeholder="Description" value={description} onChange={handleDescriptionChange}></input>
                    <input id="upload-image-button" type="button" value={uploadImageLabel} onClick={(e) => handleImageUploadButtonClick(e)}/>
                    <input id="upload-image" type="file" onChange={(e) => handleImageToUploadChange(e)}></input>
                </span>
                <span id="upload-track-container">
                    <input type="button" id="choose-track-button" value={chooseTrackLabel} onClick={(e) => handleChooseTrackButtonClick(e)}/>
                    <input id="choose-track" type="file" onChange={(e) => handleTrackToUploadChange(e)}></input>
                    
                    <button id="upload-track-button" onClick={handleUploadTrackButtonClick}>{uploadTrackLabel}</button>
                </span>
                <button className="primary-button" type="submit">Submit Wave</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    )
}

export default UploadForm
