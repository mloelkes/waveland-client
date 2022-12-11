import { Link } from "react-router-dom";

function Following(props) {
    return (
        <div className="Following">
            <p className="headline">Following</p>
            <div className="following-content">
                {props.user?.following.map(followed => (
                    <Link key={followed._id} to={`/${followed?.nameForUrl}`} className="followed">
                        <img id="followed-image" src={followed?.imageUrl} alt="followed"/>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Following;
