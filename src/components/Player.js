import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/auth.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Player (props) {
    const playIcon = "/images/icons/baseline_play_arrow_white_48dp.png";
    const pauseIcon = "/images/icons/baseline_pause_white_24dp.png";
    const speakerIcon = "/images/icons/baseline_volume_up_white_24dp.png";
    const speakerMuteIcon = "/images/icons/baseline_volume_mute_white_48dp.png";

    const API_URL = process.env.REACT_APP_API_URL;

    const isInitialMount = useRef(true);
    let audioReference = useRef(0);

    const storedToken = localStorage.getItem('authToken');

    const { isLoggedIn } = useContext(AuthContext);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [trackImage, setTrackImage] = useState("");
    const [artistName, setArtistName] = useState("");
    const [trackName, setTrackName] = useState("");
    const [trackUrl, setTrackUrl] = useState("");

    const navigate = useNavigate();

    function handlePlayTrack() {
        setTrackImage(props.trackImage);
        setArtistName(props.artistName);
        setTrackName(props.trackName);
        setTrackUrl(props.trackUrl);

        audioReference.current.pause();
        audioReference.current.setAttribute("src", props.trackUrl);
        audioReference.current.load();
        audioReference.current.play();
        
        setIsPlaying(true);
    }

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            handlePlayTrack();
        }
    }, [props.trackUrl])

    function handlePlayPauseToggle() {
        if (trackUrl) {
            setIsPlaying(!isPlaying);
            isPlaying ? audioReference.current.pause() : audioReference.current.play();
        }
    }

    function handleMuteToggle() {
        audioReference.current.muted = !audioReference.current.muted;
        setIsMuted(!isMuted);
    }

    function handleRandomButtonClick() {
        axios.get(`${API_URL}/api/users/all`, { headers: { Authorization: `Bearer ${storedToken}` } })
        .then(response => {
            const users = response.data;
            const random = Math.floor(Math.random() * users.length);
            navigate(`/${users[random].nameForUrl}`);
        })
    };

    return (
        <>
            {isLoggedIn &&
            <div className="Player">
                <audio ref={audioReference}>
                </audio>

                <div className="player-container">
                    {trackImage && <img id="track-image" src={trackImage} alt="track cover"/>}
                    {trackName ? <p>{artistName} – {trackName}</p> : <p>Please select a Wave</p>}
                    <button onClick={handlePlayPauseToggle}><img id="player-play" src={isPlaying ? pauseIcon : playIcon} alt="play-pause"/></button>
                    <button onClick={handleMuteToggle}><img id="player-mute" src={isMuted ? speakerMuteIcon : speakerIcon} alt="mute toggle"/></button>
                </div>
                <div onClick={handleRandomButtonClick} id="random-button"></div>
            </div>
            }
        </>
    )
}

export default Player;
