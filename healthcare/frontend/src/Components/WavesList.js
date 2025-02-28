import "./All.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WaveInfo from "./WaveInfo";

function WavesList() {
    const { id } = useParams();
    const [openModel, setOpenModel] = useState(false);
    const [waveList, setWaveList] = useState([]);
    const closeModel = () => setOpenModel(false);
    const [waveId, setWaveId] = useState(null);
    const [posterName, setPosterName] = useState(null);
    const [posterIcon, setPosterIcon] = useState(null);
    const [waveImage, setWaveImage] = useState(null);
    const [waveMessage, setWaveMessage] = useState(null);

    const fetchWaves = async () => {
        try {
            let response = await axios.get(
                `http://127.0.0.5:3000/user/${id}/wave-list`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (response.data.status) {
                setWaveList(response.data.data);
            }
        } catch (err) {
            toast.error(err.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 300,
            });
        }
    };

    useEffect(() => {
        fetchWaves();
    }, []);

    return (
        <div className="wave-list-container">
            <p>Making waves</p>
            <div id="user-wave-container">
                {waveList.map((item, key) => (
                    <div
                        key={key}
                        id="user-waves"
                        onClick={() => {
                            setWaveId(item.id);
                            setWaveImage(item.image);
                            setWaveMessage(item.message);
                            setPosterName(`${item.firstName} ${item.lastName}`);
                            setPosterIcon(item.profileIcon);
                            setOpenModel(true);
                        }}
                    >
                        <img
                            id="user-img"
                            src={
                                item.profileIcon
                                    ? item.profileIcon
                                    : "/user.png"
                            }
                            alt="user"
                        />
                        <div id="user-wave-details">
                            <p id="user-id">{item.firstName}</p>
                            <p id="user-message">
                                {item.message.length > 20
                                    ? item.message.slice(0, 20) + " ...."
                                    : item.message}
                            </p>
                            <p id="follow-button">Follow</p>
                        </div>
                        {(key + 1) % 3 !== 0 ? <span id="line"></span> : null}
                    </div>
                ))}
                {waveList.length === 0 ? (
                    <h1 id="no-friends">No active waves!</h1>
                ) : null}
            </div>
            {openModel && (
                <WaveInfo
                    closeModel={closeModel}
                    waveId={waveId}
                    waveImage={waveImage}
                    waveMessage={waveMessage}
                    posterIcon={posterIcon}
                    posterName={posterName}
                />
            )}
        </div>
    );
}

export default WavesList;
