import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./dashboard.css";
import { useEffect, useState } from "react";
import DashboardOverview from "./DashboardOverview";
import UserList from "./UserList";
import WaveList from "./WaveList";

function Dashboard() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [adminName, setAdminName] = useState("");
    const [isChanged, setIsChanged] = useState(false);

    const getadminData = async () => {
        try {
            let response = await axios.get(
                `http://127.0.0.5:3000/admin/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            setAdminName(response.data.data.name);
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");

                toast.error(err.response.data.message, {
                    position: "bottom-right",
                    autoClose: 300,
                });
            }
            toast.error(err.response.data.message, {
                position: "bottom-right",
                autoClose: 300,
            });
        }
    };

    useEffect(() => {
        getadminData();
    }, []);

    const handleLogout = () => {
        navigate("/login");
        localStorage.removeItem("token");
    };

    return (
        <div id="dashboard-page">
            <div id="dashboard">
                <div id="navbaar">
                    <h3>Welcome</h3>
                    <h3>&nbsp;&lt;&nbsp;{adminName}&nbsp;&gt;</h3>
                    <h3 id="logout-btn" onClick={handleLogout}>
                        Logout
                    </h3>
                </div>
            </div>
            <DashboardOverview isChanged={isChanged} />
            <UserList isChanged={isChanged} setIsChanged={setIsChanged} />
            <WaveList isChanged={isChanged} setIsChanged={setIsChanged} />
            <ToastContainer />
        </div>
    );
}

export default Dashboard;
