import "./All.css";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Options from "./Options";
import WavesList from "./WavesList";
import FriendList from "./FriendList";
import FriendRequests from "./FriendRequests";

function Dashboard() {
    const [isAccepted, setIsAccepted] = useState(false);

    return (
        <div className="dashboard-wrapper">
            <div id="friend-dashboard">
                <div className="user-wrapper">
                    <WavesList />
                    <FriendList isAccepted={isAccepted} />
                    <FriendRequests
                        isAccepted={isAccepted}
                        setIsAccepted={setIsAccepted}
                    />
                </div>
            </div>
            <Options />
        </div>
    );
}

export default Dashboard;
