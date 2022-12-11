import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.js";
import { UserDetailsContext } from "../context/userDetails.js";

function Navigation() {
    const { isLoggedIn, logoutUser } = useContext(AuthContext);
    const { userDetails, resetUserDetails } = useContext(UserDetailsContext);

    function handleLogoutClick() {
        logoutUser();
        resetUserDetails();
    }

    return (
        <div className="Navigation">
            <div className="navigation-content">
                {isLoggedIn ?
                    <span id="user-logged-in-dashboard-waves">
                        <Link className="font-accent" to="/dashboard"><img id="logo" src="/images/icons/7a.png" alt="waveland logo"/></Link>
                        
                    </span> :
                    <Link className="font-accent" to="/"><img id="logo" src="/images/icons/7a.png" alt="waveland logo"/></Link>
                }
                {isLoggedIn ? 
                <span id="user-logged-in-profile-logout">
                    <Link className="font-accent" to="/waves">Waves</Link>
                    <Link className="link" to="/" onClick={handleLogoutClick}>Logout</Link>
                    <Link to={`/${userDetails?.nameForUrl}`} ><img id="profile-picture" src={userDetails?.imageUrl} alt="user profile"/></Link>
                </span> :
                <span id="user-logged-in-profile-logout">
                    <Link className="link" to="/login">Login</Link>
                    <Link className="link" to="/signup">Sign Up</Link>
                </span>}
            </div>
        </div>
    );
}

export default Navigation;
