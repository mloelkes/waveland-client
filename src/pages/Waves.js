import { useEffect, useContext, useState } from "react";
import TrackList from "../components/TrackList.js";
import axios from "axios";
import { UserDetailsContext } from "../context/userDetails.js";
import { AuthContext } from "../context/auth.js";

function Waves(props) {
    const { userDetails } = useContext(UserDetailsContext);
    const { user } = useContext(AuthContext);

    const API_URL = process.env.REACT_APP_API_URL;

    const [tracks, setTracks] = useState([]);
    const [errorMessage, setErrorMessage] = useState(undefined);

    const storedToken = localStorage.getItem('authToken');

    function getTracksByFollowedUsers() {
        axios.get(`${API_URL}/api/users/${user?._id}/following/tracks`, { headers: { Authorization: `Bearer ${storedToken}` } })
        .then(response => {
            setTracks(response.data);
        })
        .catch(err => {
            const errorDescription = err.response.data.message;
            setErrorMessage(errorDescription);
        })
    }

    function handlePlayTrack (trackUrl, trackImage, trackName, artistName) {
        props?.handlePlayTrack(trackUrl, trackImage, trackName, artistName);
    }

    useEffect(() => {
        getTracksByFollowedUsers();
    }, [user]);

    return (
        <div className="Waves">
            {tracks.length > 0 ?
            <TrackList page="waves" tracks={tracks} handlePlayTrack={handlePlayTrack}></TrackList> :
            <p>No Tracks to display.</p>
            }
        </div>
    )
}

export default Waves;
