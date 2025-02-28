import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FriendInfo from "./FriendInfo";

function FriendList({ isAccepted }) {
    const [friends, setFriends] = useState([]);
    const [openModel, setOpenModel] = useState(false);
    const closeModel = () => setOpenModel(false);
    const [friendId, setFriendId] = useState(null);
    const { id } = useParams();

    const fetchFriends = async () => {
        try {
            let response = await axios.get(
                `http://127.0.0.5:3000/user/${id}/friends`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (response && response.data.status) {
                setFriends(response.data.data);
            }
        } catch (err) {
            if (err.response.status === 404) {
                setFriends([]);
            }
        }
    };

    useEffect(() => {
        fetchFriends();
    }, [isAccepted]);

    return (
        <div id="friends-container-main">
            <p id="friend-label">Friends</p>
            <div id="parent-user">
                {friends.map((item, key) => (
                    <div
                        key={key}
                        id="invited-user-container"
                        onClick={() => {
                            setFriendId(item.friendId);
                            setOpenModel(true);
                        }}
                    >
                        <img src={item.icon ? item.icon : "/user.png"} />
                        <div id="invited-user-detail">
                            <p id="user-name">{item.name}</p>
                            <p id="user-email">{item.email}</p>
                        </div>
                        <div
                            id="status"
                            style={{
                                background: "#49A15C",
                            }}
                        >
                            <p>Friends</p>
                        </div>
                    </div>
                ))}
                {friends.length === 0 ? (
                    <h1 id="no-friends">No friends yet!</h1>
                ) : null}
            </div>
            {openModel && (
                <FriendInfo closeModel={closeModel} friendId={friendId} />
            )}
        </div>
    );
}

export default FriendList;
