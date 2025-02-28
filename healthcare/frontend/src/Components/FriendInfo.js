import "./All.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FriendInfo({ closeModel, friendId }) {
    const [friendInfo, setFriendInfo] = useState({});

    const fetchFriendDetail = async () => {
        try {
            let response = await axios.get(
                `http://127.0.0.5:3000/user/${friendId}/friend-details`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (response && response.data && response.data.status) {
                setFriendInfo(response.data.data);
            }
        } catch (err) {
            toast.error(err.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 300,
            });
        }
    };

    useEffect(() => {
        fetchFriendDetail();
    }, []);

    return (
        <>
            <div id="model-wrapper" onClick={closeModel}></div>
            <div id="wave-model">
                <div id="friend-cover-color">
                    <h1>Details</h1>
                    <div id="user-profile">
                        <img
                            id="friend-user-icon"
                            src={
                                friendInfo.profileIcon
                                    ? friendInfo.profileIcon
                                    : "/user.png"
                            }
                            alt="user"
                        />
                        <div id="creator-details">
                            <p id="friend-name">{friendInfo.name}</p>
                            {/* <p id="creator-id">@carmen_G12</p> */}
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="23"
                            height="25"
                            viewBox="0 0 23 25"
                            fill="none"
                            onClick={closeModel}
                        >
                            <ellipse
                                cx="11.4194"
                                cy="12.6786"
                                rx="10.7319"
                                ry="11.7643"
                                fill="#DECAA5"
                            />
                            <line
                                y1="-0.5"
                                x2="15.924"
                                y2="-0.5"
                                transform="matrix(0.673947 0.738779 -0.673947 0.738779 6.64966 7.44995)"
                                stroke="#B18D4B"
                            />
                            <line
                                y1="-0.5"
                                x2="15.924"
                                y2="-0.5"
                                transform="matrix(-0.673947 0.738779 0.673947 0.738779 17.3816 7.44995)"
                                stroke="#B18D4B"
                            />
                        </svg>
                    </div>
                </div>
                <div id="friend-detail-container">
                    <h3 id="friend-detail-heading">Basic Details</h3>
                    <div id="friend-details-main">
                        <div className="grid-container">
                            <div className="item1">Name: </div>
                            <div className="item2">{friendInfo.name}</div>
                            <div className="item3">DOB: </div>
                            <div className="item4">{friendInfo.dob}</div>
                            <div className="item5">Email&nbsp;ID: </div>
                            <div className="item6">{friendInfo.email}</div>
                            <div className="item7">Social&nbsp;Security: </div>
                            <div className="item8">{friendInfo.ssn}</div>
                            <div className="item9">Mobile&nbsp;No.: </div>
                            <div className="item10">
                                {friendInfo.phoneNumber}
                            </div>
                            <div className="item11">Address: </div>
                            <div className="item12">{friendInfo.address}</div>
                            <div className="item13">Gender: </div>
                            <div className="item14">{friendInfo.gender}</div>
                            <div className="item15">City: </div>
                            <div className="item16">{friendInfo.city}</div>
                            <div className="item17">State: </div>
                            <div className="item18">{friendInfo.state}</div>
                            <div className="item19">Zip&nbsp;Code: </div>
                            <div className="item20">{friendInfo.zip}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FriendInfo;
