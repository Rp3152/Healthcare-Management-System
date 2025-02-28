import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./userList.css";
import { useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import EditUser from "./EditUser";
import ConfirmBox from "./ConfirmBox";

function UserList({ isChanged, setIsChanged }) {
    const [userList, setUserList] = useState([]);
    const [filteredUserList, setFilteredUserList] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    const [nameSign, setNameSign] = useState(true);
    const [emailSign, setEmailSign] = useState(true);
    const [showModel, setShowModel] = useState(false);
    const [editUser, setEditUser] = useState(false);
    const [userId, setUserId] = useState(null);
    const [showConfirmBox, setShowConfirmBox] = useState(false);

    const { id } = useParams();

    const getUsers = async () => {
        try {
            let response = await axios.get(
                `http://127.0.0.5:3000/admin/${id}/users`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            setUserList(response.data.data);
            setFilteredUserList(response.data.data);
        } catch (err) {
            toast.error(err.response.data.message, {
                position: "bottom-right",
                autoClose: 300,
            });
        }
    };

    const updateStatus = async (userId, userStatus) => {
        try {
            const response = await axios.put(
                `http://127.0.0.5:3000/admin/${id}/users`,
                { status: !userStatus, id: userId },
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

    const deleteUser = async (userId) => {
        try {
            const response = await axios.delete(
                `http://127.0.0.5:3000/admin/${id}/users`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    data: { id: userId },
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
            console.log(err);
            toast.error(err.response.data.message, {
                position: "bottom-right",
                autoClose: 300,
            });
        }
    };

    const handleStatusChange = (userId, userStatus) => {
        updateStatus(userId, userStatus);
    };

    const handleDelete = (userId) => {
        setUserId(userId);
        setShowConfirmBox(true);
        // deleteUser(userId);
    };

    const handleNameListReverse = () => {
        setNameSign(!nameSign);
        const reversedList = filteredUserList.reverse();
        setFilteredUserList([...reversedList]);
    };

    const handleEmailListReverse = () => {
        setEmailSign(!emailSign);
        const reversedList = filteredUserList.reverse();
        setFilteredUserList([...reversedList]);
    };

    const handleUserFilter = (event) => {
        const searchedUser = userList.filter((item) => {
            return (
                item.name
                    .toLowerCase()
                    .includes(event.target.value.toLowerCase()) ||
                item.email
                    .toLowerCase()
                    .includes(event.target.value.toLowerCase()) ||
                item.phoneNumber
                    .toLowerCase()
                    .includes(event.target.value.toLowerCase())
            );
        });

        setFilteredUserList([...searchedUser]);
    };

    const closeModel = () => setShowModel(!showModel);
    const closeEditModel = () => setEditUser(!editUser);
    const closeConfirmBox = () => setShowConfirmBox(false);

    useEffect(() => {
        getUsers();
    }, [isUpdated]);

    return (
        <div id="users-page">
            <div id="users-heading">
                <h6>USERS</h6>
                <h2>Manage Users List</h2>
            </div>
            <div id="search-user">
                <input
                    type="text"
                    placeholder="Search with name, email, number"
                    onChange={handleUserFilter}
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
            {filteredUserList.length > 0 ? (
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
                                <th onClick={handleNameListReverse}>
                                    Name
                                    {!nameSign ? (
                                        <em> &#x25B2;</em>
                                    ) : (
                                        <em> &#x25BC;</em>
                                    )}
                                </th>
                                <th onClick={handleEmailListReverse}>
                                    Email
                                    {!emailSign ? (
                                        <em> &#x25B2;</em>
                                    ) : (
                                        <em> &#x25BC;</em>
                                    )}
                                </th>
                                <th>Mobile</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUserList.map((item, key) => (
                                <tr key={key} className="users-table-row">
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                        ></input>
                                    </td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phoneNumber}</td>
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
                                                setUserId(item.id);
                                                setShowModel(!showModel);
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
                                                setUserId(item.id);
                                                setEditUser(!editUser);
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
                <h1 className="not-found">No users yet!</h1>
            )}
            {showModel ? (
                <UserInfo userId={userId} closeModel={closeModel} />
            ) : null}
            {editUser ? (
                <EditUser userId={userId} closeModel={closeEditModel} />
            ) : null}
            {showConfirmBox ? (
                <ConfirmBox
                    closeModel={closeConfirmBox}
                    userId={userId}
                    deleteUser={deleteUser}
                />
            ) : null}
        </div>
    );
}

export default UserList;
