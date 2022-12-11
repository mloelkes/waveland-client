import { Link } from "react-router-dom";

function Followers(props) {
    return (
        <div className="Followers">
            <p className="headline">Followers</p>
            <div className="followers-content">
                {props.user?.followers.map(follower => (
                    <Link key={follower._id} to={`/${follower?.nameForUrl}`} className="follower">
                        <img id="follower-image" src={follower?.imageUrl} alt="follower"/>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Followers;
