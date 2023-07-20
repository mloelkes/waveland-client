import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth.js";
import { Link } from "react-router-dom";
import { UserDetailsContext } from "../context/userDetails.js";
import axios from "axios";

function TrackDetails(props) {
    const { user } = useContext(AuthContext);
    const { userDetails, getUserDetails } = useContext(UserDetailsContext);

    const API_URL = process.env.REACT_APP_API_URL;

    const heartFilledUrl = "/images/icons/baseline_favorite_black_48dp.png";
    const heartOutlinedUrl = "/images/icons/baseline_favorite_border_black_48dp.png";

    const storedToken = localStorage.getItem('authToken');

    const [trackLiked, setTrackLiked] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);

    async function handleTrackDetailsClick(e) {
        console.log(e.target.parentNode.attributes)
        const trackUrl = e.target.parentNode.attributes.trackurl.value;
        const trackImage = e.target.parentNode.attributes.trackimage.value;
        const trackName = e.target.parentNode.attributes.trackname.value;

        const artistID = e.target.parentNode.attributes.artistid.value;
        const response = await axios.get(`${API_URL}/api/users/${artistID}`, { headers: { Authorization: `Bearer ${storedToken}` } });
        const artistName = response.data.name;

        props.handlePlayTrack(trackUrl, trackImage, trackName, artistName);
    }

    useEffect(() => {
        userDetails?.likes.forEach(like => {
            if (like._id === props.track._id) {
                setTrackLiked(true);
            }
        })
    }, []);

    function handleLikeButtonClick(e) {
        e.preventDefault();

        if (trackLiked) {
            removeLike();
            getUserDetails();
        } else {
            addLike();
            getUserDetails();
        }
    }

    function addLike() {
        callAxiosPatchForLike(`${API_URL}/api/users/${user._id}/likes`);
        setTrackLiked(true);
    }

    function removeLike() {
        callAxiosPatchForLike(`${API_URL}/api/users/${user._id}/likes/remove`);
        setTrackLiked(false);
    }

    function callAxiosPatchForLike(route) {
        const likesFormData = {
            trackId: props.track._id
        };

        axios.patch(route, likesFormData, { headers: { Authorization: `Bearer ${storedToken}` } })
        .then(response => {
        })
        .catch(err => {
            const errorDescription = err.response.data.message;
            setErrorMessage(errorDescription);
        })
    }

    return (
        <div className="TrackDetails">
            <div className="col-1">
                <div className="col-1">
                    <button trackurl={props.track?.trackUrl} trackimage={props.track?.imageUrl} trackname={props.track?.name} artistid={props.track?.user} onClick={handleTrackDetailsClick}>
                        <img id="track-cover" src={props.track?.imageUrl} alt="track cover"/>
                    </button>
                </div>
                <div className="col-2">
                    {props.track.name && <p className="label">TITLE</p>}
                    <p className="content">{props.track?.name}</p>
                    {props.track.tag && <p className="label">TAG</p>}
                    <p className="content">{props.track?.tag}</p>
                    {props.track.description && <p className="label">DESCRIPTION</p>}
                    <p className="content">{props.track?.description}</p>
                    {!(props.track?.user?._id === user._id) && <button id="like-button" onClick={handleLikeButtonClick}><img id="like-button-img" src={trackLiked ? heartFilledUrl : heartOutlinedUrl} alt="like-button"/></button>}
                </div>
            </div>
            <div className="col-2">
                {window.location.href.includes("waves") && 
                <>
                    <Link to={`/${props.track?.user?.nameForUrl}`} ><img id="artist-image" src={props.track?.user?.imageUrl} alt="artist"/></Link>
                </>
                }
            </div>
    </div>
    )
}

export default TrackDetails;
