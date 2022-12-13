import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileDetails from "../components/ProfileDetails.js";
import TrackList from "../components/TrackList.js";
import Followers from "../components/Followers.js";
import Following from "../components/Following.js";
import Likes from "../components/Likes.js";

function Profile (props) {
    const { nameForUrl } = useParams();

    const API_URL = process.env.REACT_APP_API_URL;

    const [user, setUser] = useState(undefined);
    const [tracks, setTracks] = useState(undefined);

    const storedToken = localStorage.getItem('authToken');

    function initializeData() {
        axios.get(`${API_URL}/api/users?nameForUrl=${nameForUrl}`, { headers: { Authorization: `Bearer ${storedToken}` } })
        .then(response => {
            setUser(response.data);
            getUserTracks(response.data._id);
        })
        .catch(err => {
            console.log(err);
        })
    }

    function getUserTracks(id) {
        axios.get(`${API_URL}/api/users/${id}/tracks`, { headers: { Authorization: `Bearer ${storedToken}` } })
        .then(response => {
            setTracks(response.data);
        })
        .catch(err => {
            console.log(err)
        })
    }

    function handlePlayTrack (trackUrl, trackImage, trackName, artistName) {
        props.handlePlayTrack(trackUrl, trackImage, trackName, artistName);
    }

    useEffect(() => {
        initializeData();
    }, [nameForUrl]);
    
    return (
        <div className="Profile">
            <div className="col-1">
                <div className="profile-details-container">
                    <ProfileDetails user={user}></ProfileDetails>
                </div>
            </div>
            <div className="col-2">
                <TrackList page="profile" tracks={tracks} handlePlayTrack={handlePlayTrack}></TrackList>
            </div>
            <div className="col-3">
                <Followers user={user}></Followers>
                {user?.following?.length > 0 && <Following user={user}></Following>}
                {user?.likes?.length > 0 && <Likes tracks={user?.likes} handlePlayTrack={handlePlayTrack}></Likes>}
            </div>
        </div>
    )
}

export default Profile;