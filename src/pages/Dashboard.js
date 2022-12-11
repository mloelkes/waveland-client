import { Link } from "react-router-dom";
import UserDetails from "../components/UserDetails.js";

function Dashboard() {
	return (
        <div className="Dashboard">
            <div className="col-1">
                <UserDetails></UserDetails>
            </div>
            <div className="col-2">
                <Link id="link" to="/upload">Upload Waves</Link>
            </div>

        </div>
	)
}

export default Dashboard;
