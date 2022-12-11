import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserDetailsContext } from "../context/userDetails.js";

function UserDetails() {
    const { userDetails } = useContext(UserDetailsContext);

    return (
        <div className="UserDetails">
            <Link to={`/${userDetails?.nameForUrl}`} ><img id="profile-picture" src={userDetails?.imageUrl} alt="user profile"/></Link>
            <p className="label">USERNAME</p><p>{userDetails?.name}</p>
            <p className="label">E-MAIL</p><p>{userDetails?.email}</p>
            <p className="label">DESCRIPTION</p><p>{userDetails?.description}</p>
            <p className="label">LOCATION</p><p>{userDetails?.location}</p>
        </div>
    )
}

export default UserDetails;
