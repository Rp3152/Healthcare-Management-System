import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./waveList.css";
import { useEffect, useState } from "react";
import WaveInfo from "./WaveInfo";
import WaveEdit from "./WaveEdit";
import ConfirmBox from "./ConfirmBox";

function WaveList({ isChanged, setIsChanged }) {
    const [openConfirmBox, setOpenConfirmBox] = useState(false);
    const [waveList, setWaveList] = useState([]);
    const [filteredWaveList, setFilteredWaveList] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    const [nameSign, setNameSign] = useState(true);
    const [createdOnSign, setCreatedOnSign] = useState(true);
    const [showWaveInfo, setShowWaveInfo] = useState(false);
    const [editWave, setEditWave] = useState(false);
    const [waveId, setWaveId] = useState("");
    const [waveMessage, setWaveMessage] = useState("");
    const [waveImage, setWaveImage] = useState(null);
    const [userName, setUserName] = useState("");
    const [userIcon, setUserIcon] = useState(null);
    const [deleteWaveId, setDeleteWaveId] = useState("");
    const { id } = useParams();

    const getWaves = async () => {
        try {
            let response = await axios.get(
                `http://127.0.0.5:3000/admin/${id}/waves`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            setWaveList(response.data.data);
            setFilteredWaveList(response.data.data);
        } catch (err) {
            toast.error(err.response.data.message, {
                position: "bottom-right",
                autoClose: 300,
            });
        }
    };

    const updateStatus = async (waveId, waveStatus) => {
        try {
            const response = await axios.put(
                `http://127.0.0.5:3000/admin/${id}/waves/${waveId}`,
                { status: !waveStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (response.data.status) {
                setIsUpdated(!isUpdated);
                toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 300,
                });
            }
        } catch (err) {
            toast.error(err.response.data.message, {
                position: "bottom-right",
                autoClose: 300,
            });
        }
    };

    const deleteWave = async (waveId) => {
        try {
            const response = await axios.delete(
                `http://127.0.0.5:3000/admin/${id}/waves/${waveId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (response.data.status) {
                setIsUpdated(!isUpdated);
                setIsChanged(!isChanged);
                toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 300,
                });
            }
        } catch (err) {
            toast.error(err.response.data.message, {
                position: "bottom-right",
                autoClose: 300,
            });
        }
    };

    const handleStatusChange = (waveId, waveStatus) => {
        updateStatus(waveId, waveStatus);
    };

    const handleDelete = (waveId) => {
        setDeleteWaveId(waveId);
        setOpenConfirmBox(true);
    };

    const reverseWaveByName = () => {
        setNameSign(!nameSign);
        const reversedList = filteredWaveList.reverse();
        setFilteredWaveList([...reversedList]);
    };

    const reverseWaveByDate = () => {
        setCreatedOnSign(!createdOnSign);
        const reversedList = filteredWaveList.reverse();
        setFilteredWaveList([...reversedList]);
    };

    const handleWaveSearch = (event) => {
        const searchedWaves = waveList.filter((item) => {
            const name = item.firstName + " " + item.lastName;
            return (
                name.toLowerCase().includes(event.target.value.toLowerCase()) ||
                item.message
                    .toLowerCase()
                    .includes(event.target.value.toLowerCase())
            );
        });

        setFilteredWaveList([...searchedWaves]);
    };

    const closeModel = () => setShowWaveInfo(!showWaveInfo);
    const closeEditModel = () => setEditWave(!editWave);
    const closeConfirmBox = () => setOpenConfirmBox(!openConfirmBox);

    useEffect(() => {
        getWaves();
    }, [isUpdated]);

    return (
        <div id="wave-page">
            <div id="users-heading">
                <h6>Waves</h6>
                <h2>Manage Waves List</h2>
            </div>
            <div id="search-user">
                <input
                    type="text"
                    placeholder="Search with name, message"
                    onChange={handleWaveSearch}
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={30}
                    height={30}
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="none"
                        stroke="#0033ff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0m18 11l-6-6"
                    ></path>
                </svg>
            </div>
            {filteredWaveList.length > 0 ? (
                <div id="users-detail-container">
                    <table>
                        <thead>
                            <tr className="users-table-row">
                                <th>
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                    ></input>
                                </th>
                                <th onClick={reverseWaveByName}>
                                    Name
                                    {!nameSign ? (
                                        <em> &#x25B2;</em>
                                    ) : (
                                        <em> &#x25BC;</em>
                                    )}
                                </th>
                                <th>Wave Message</th>
                                <th onClick={reverseWaveByDate}>
                                    Created At
                                    {!createdOnSign ? (
                                        <em> &#x25B2;</em>
                                    ) : (
                                        <em> &#x25BC;</em>
                                    )}
                                </th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWaveList.map((item, key) => (
                                <tr key={key} className="users-table-row">
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                        ></input>
                                    </td>
                                    <td>
                                        {item.firstName + " " + item.lastName}
                                    </td>
                                    <td>
                                        {item.message.length > 20
                                            ? `${item.message.slice(0, 20)}...`
                                            : item.message}
                                    </td>
                                    <td>{item.createdAt}</td>
                                    <td className="switch">
                                        <input
                                            type="checkbox"
                                            id="switch"
                                            className="checkbox-switch"
                                            checked={item.status}
                                            readOnly
                                        />

                                        <label
                                            htmlFor="switch"
                                            className="toggle"
                                            onClick={() => {
                                                handleStatusChange(
                                                    item.id,
                                                    item.status
                                                );
                                            }}
                                        ></label>
                                    </td>
                                    <td id="action">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="1em"
                                            height="1em"
                                            viewBox="0 0 32 32"
                                            onClick={() => {
                                                setWaveImage(item.image);
                                                setWaveMessage(item.message);
                                                setUserName(
                                                    item.firstName +
                                                        " " +
                                                        item.lastName
                                                );
                                                setUserIcon(item.profileIcon);
                                                setShowWaveInfo(!showWaveInfo);
                                            }}
                                        >
                                            <circle
                                                cx={16}
                                                cy={16}
                                                r={4}
                                                fill="#0033ff"
                                            ></circle>
                                            <path
                                                fill="#0033ff"
                                                d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5"
                                            ></path>
                                        </svg>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="1em"
                                            height="1em"
                                            viewBox="0 0 24 24"
                                            onClick={() => {
                                                setWaveId(item.id);
                                                setWaveImage(item.image);
                                                setWaveMessage(item.message);
                                                setUserName(
                                                    item.firstName +
                                                        " " +
                                                        item.lastName
                                                );
                                                setUserIcon(item.profileIcon);
                                                setEditWave(!editWave);
                                            }}
                                        >
                                            <path
                                                fill="#0033ff"
                                                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"
                                            ></path>
                                        </svg>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="1em"
                                            height="1em"
                                            viewBox="0 0 48 48"
                                            onClick={() => {
                                                handleDelete(item.id);
                                            }}
                                        >
                                            <path
                                                fill="#0033ff"
                                                d="M20 10.5v.5h8v-.5a4 4 0 0 0-8 0m-2.5.5v-.5a6.5 6.5 0 1 1 13 0v.5h11.25a1.25 1.25 0 1 1 0 2.5h-2.917l-2 23.856A7.25 7.25 0 0 1 29.608 44H18.392a7.25 7.25 0 0 1-7.224-6.644l-2-23.856H6.25a1.25 1.25 0 1 1 0-2.5zm4 9.25a1.25 1.25 0 1 0-2.5 0v14.5a1.25 1.25 0 1 0 2.5 0zM27.75 19c-.69 0-1.25.56-1.25 1.25v14.5a1.25 1.25 0 1 0 2.5 0v-14.5c0-.69-.56-1.25-1.25-1.25"
                                            ></path>
                                        </svg>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <h1 className="not-found">No waves yet!</h1>
            )}
            {showWaveInfo ? (
                <WaveInfo
                    waveMessage={waveMessage}
                    waveImage={waveImage}
                    userName={userName}
                    userIcon={userIcon}
                    closeModel={closeModel}
                />
            ) : null}
            {editWave ? (
                <WaveEdit
                    waveId={waveId}
                    waveMessage={waveMessage}
                    waveImage={waveImage}
                    userName={userName}
                    userIcon={userIcon}
                    closeModel={closeEditModel}
                    isUpdated={isUpdated}
                    setIsUpdated={setIsUpdated}
                    setWaveMessage={setWaveMessage}
                />
            ) : null}
            {openConfirmBox ? (
                <ConfirmBox
                    closeModel={closeConfirmBox}
                    waveId={deleteWaveId}
                    deleteWave={deleteWave}
                />
            ) : null}
        </div>
    );
}

export default WaveList;
