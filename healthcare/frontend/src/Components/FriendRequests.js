import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FriendInfo from "./FriendInfo";

function FriendRequests({ isAccepted, setIsAccepted }) {
    const [openModel, setOpenModel] = useState(false);
    const closeModel = () => setOpenModel(false);
    const [friendId, setFriendId] = useState(null);
    const [requests, setRequests] = useState([]);
    const { id } = useParams();

    const fetchRequests = async () => {
        try {
            let response = await axios.get(
                `http://127.0.0.5:3000/user/${id}/friend-requests`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (response && response.data.status) {
                setRequests(response.data.data);
            }
        } catch (err) {
            if (err.response.status === 404) {
                setRequests([]);
            } else {
                toast.error(err.response.data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 300,
                });
            }
        }
    };

    const approveRequest = async (requestID) => {
        try {
            const response = await axios.put(
                `http://127.0.0.5:3000/user/${id}/friend-requests`,
                { id: requestID },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (response.data.status) {
                setIsAccepted(!isAccepted);
            }
        } catch (err) {}
    };

    useEffect(() => {
        fetchRequests();
    }, [isAccepted]);

    const handleRequestApproval = (requestId) => {
        approveRequest(requestId);
    };

    return (
        <div id="friends-container-main">
            <p id="friend-label">Requests</p>
            <div id="parent-user">
                {requests.map((item, key) => (
                    <div key={key} id="invited-user-container">
                        <img
                            src={item.icon ? item.icon : "/user.png"}
                            onClick={() => {
                                setFriendId(item.inviterId);
                                setOpenModel(true);
                            }}
                        />
                        <div
                            id="invited-user-detail"
                            onClick={() => {
                                setFriendId(item.inviterId);
                                setOpenModel(true);
                            }}
                        >
                            <p id="user-name">{item.name}</p>
                            <p id="user-email">{item.email}</p>
                        </div>
                        <div
                            id="status"
                            style={{
                                background: item.isAccepted
                                    ? "#49A15C"
                                    : "#b18d4b",
                            }}
                            onClick={() => {
                                handleRequestApproval(item.id);
                            }}
                        >
                            <p>{item.isAccepted ? "Accepted" : "Confirm"}</p>
                        </div>
                    </div>
                ))}
                {requests.length === 0 ? (
                    <h1 id="no-friends">No requests yet!</h1>
                ) : null}
            </div>
            {openModel && (
                <FriendInfo closeModel={closeModel} friendId={friendId} />
            )}
        </div>
    );
}

export default FriendRequests;
