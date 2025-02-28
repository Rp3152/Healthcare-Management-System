import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./dashboardOverview.css";
import { useEffect, useState } from "react";

function DashboardOverview({ isChanged }) {
    const navigate = useNavigate();
    const [totalUser, setTotalUser] = useState("");
    const [activeUser, setActiveUser] = useState("");
    const [inactiveUser, setInactiveUser] = useState("");
    const [totalWaves, setTotalWaves] = useState("");

    const { id } = useParams();

    const getCount = async () => {
        try {
            let response = await axios.get(
                `http://127.0.0.5:3000/admin/${id}/count`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            setTotalUser(response.data.data.totalUsers);
            setActiveUser(response.data.data.activeUsers);
            setInactiveUser(response.data.data.inactiveUsers);
            setTotalWaves(response.data.data.totalWaves);
        } catch (err) {
            toast.error(err.response.data.message, {
                position: "bottom-right",
                autoClose: 300,
            });
        }
    };

    useEffect(() => {
        getCount();
    }, [isChanged]);

    return (
        <div id="overview-page">
            <div id="overview-heading">
                <h6>DASHBOARD</h6>
                <h2>Overview</h2>
            </div>
            <div id="overview-detail-container">
                <div className="overview-card">
                    <h4>TOTAL USERS</h4>
                    <h4>{totalUser}</h4>
                </div>
                <div className="overview-card">
                    <h4>ACTIVE USERS</h4>
                    <h4>{activeUser}</h4>
                </div>
                <div className="overview-card">
                    <h4>INACTIVE USERS</h4>
                    <h4>{inactiveUser}</h4>
                </div>
                <div className="overview-card">
                    <h4>TOTAL WAVES</h4>
                    <h4>{totalWaves}</h4>
                </div>
            </div>
        </div>
    );
}

export default DashboardOverview;
