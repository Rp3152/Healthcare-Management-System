import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./All.css";
import OptionsModel from "./OptionsModel";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Options({ profileIcon, isUpdated }) {
    const [openModel, setOpenModel] = useState(false);
    const [userName, setUserName] = useState(null);
    const [userIcon, setUserIcon] = useState();
    const [time, setTime] = useState("");
    const navigate = useNavigate();
    const closeModel = () => setOpenModel(false);
    const { id } = useParams();

    const checkCurrentTime = () => {
        const currentHour = new Date().getHours();
        if (currentHour >= 5 && currentHour < 12) {
            setTime("Morning");
        } else if (currentHour >= 12 && currentHour < 18) {
            setTime("Afternoon");
        } else {
            setTime("Evening");
        }
    };

    useEffect(() => {
        checkCurrentTime();

        const intervalId = setInterval(() => {
            checkCurrentTime();
        }, 30000);

        return () => clearInterval(intervalId);
    });

    const fetchIcon = async () => {
        try {
            let response = await axios.get(`http://127.0.0.5:3000/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setUserName(response.data.data.userName);
            setUserIcon(response.data.data.profileIcon);
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                toast.error(err.response.data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 300,
                });
            }
            toast.error(err.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 300,
            });
        }
    };

    useEffect(() => {
        fetchIcon();
    }, [isUpdated]);

    return (
        <div id="parent-user">
            <div className="user-options">
                <div id="logo-container">
                    <img id="logo" src="/Logo.png" alt="Logo" />
                </div>
                <div
                    id="dashboard"
                    className="options"
                    onClick={() => navigate(`/user/${id}`)}
                >
                    <div id="circle">
                        <div id="upper-circle">
                            <span></span>
                            <span></span>
                        </div>
                        <div id="lower-circle">
                            <span id="light-circle"></span>
                            <span></span>
                        </div>
                    </div>
                    <p className="options-text">Dashboard</p>
                </div>
                <div
                    className="options"
                    onClick={() => navigate(`/user/${id}/profile`)}
                >
                    <div id="option-image">
                        <img src="/chart.png" alt="icon"></img>
                    </div>
                    <p className="options-text">My Profile</p>
                </div>
                <div
                    className="options"
                    onClick={() => navigate(`/user/${id}/preferences`)}
                >
                    <div id="option-image">
                        <img src="/chart.png" alt="icon"></img>
                    </div>
                    <p className="options-text">Preferences</p>
                </div>
                <div
                    className="options"
                    onClick={() => navigate(`/user/${id}/friends`)}
                >
                    <div id="option-image">
                        <img src="/chart.png" alt="icon"></img>
                    </div>
                    <p className="options-text">Friends</p>
                </div>
                <div
                    className="options"
                    onClick={() => navigate(`/user/${id}/waves`)}
                >
                    <div id="option-image">
                        <img src="/chart.png" alt="icon"></img>
                    </div>
                    <p className="options-text">Create Waves</p>
                </div>
                <div
                    className="options"
                    onClick={() => navigate(`/user/${id}/change-password`)}
                >
                    <div id="option-image">
                        <img src="/chart.png" alt="icon"></img>
                    </div>
                    <p className="options-text">Change Password</p>
                </div>
                <div
                    className="options"
                    id="logout"
                    onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login");
                    }}
                >
                    <div id="option-image">
                        <img src="/logout-icon.png" alt="icon"></img>
                    </div>
                    <p className="options-text">Log Out</p>
                </div>
            </div>
            <div id="navbaar">
                <img
                    id="user-icon"
                    src={
                        profileIcon
                            ? profileIcon
                            : userIcon
                            ? userIcon
                            : "/user.png"
                    }
                    onClick={() => setOpenModel(!openModel)}
                ></img>
                <div id="user-name">
                    <p id="greeting">Good {time}</p>
                    <p id="name" onClick={() => setOpenModel(!openModel)}>
                        {userName}
                    </p>
                </div>
                {openModel && <OptionsModel closeModel={closeModel} id={id} />}
            </div>
            <ToastContainer />
        </div>
    );
}

export default Options;
