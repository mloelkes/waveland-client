import TrackDetails from "./TrackDetails.js";

function TrackList (props) {
    function handlePlayTrack(trackUrl, trackImage, trackName, artistName) {
        props.handlePlayTrack(trackUrl, trackImage, trackName, artistName);
    }

    return (
        <div className="TrackList">
            {props.tracks?.map(track => (
                <TrackDetails key={track._id} handlePlayTrack={handlePlayTrack} track={track}></TrackDetails>
            ))}
        </div>
    )
}

export default TrackList;
