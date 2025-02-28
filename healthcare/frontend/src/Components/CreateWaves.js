import "./All.css";
import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Options from "./Options";

function CreateWaves() {
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageName, setSelectedImageName] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const [name, setName] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [userName, setUserName] = useState("");
    const [isPosted, setIsPosted] = useState(false);
    const [waveList, setWaveList] = useState([]);
    const [searchWaveList, setSearchWaveList] = useState([]);

    const { id } = useParams();
    const navigate = useNavigate();

    const fetchIcon = async () => {
        try {
            let response = await axios.get(`http://127.0.0.5:3000/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setUserName(response.data.data.userName);
            setName(response.data.data.fullName);
            setProfilePhoto(response.data.data.profileIcon);
        } catch (err) {}
    };

    const getWaveList = async () => {
        try {
            const response = await axios.get(
                `http://127.0.0.5:3000/user/${id}/waves`,
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
                setSearchWaveList(response.data.data);
            }
        } catch (err) {}
    };

    const postWave = async ({ message }, action) => {
        const formData = new FormData();
        selectedImage && formData.append("image", selectedImage);
        formData.append("message", message);

        try {
            const response = await axios.post(
                `http://127.0.0.5:3000/user/${id}/waves`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (response.data.status) {
                setIsPosted(!isPosted);
                toast.success(response.data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 300,
                });
                action.resetForm();
                setSelectedImageName(null);
                setSelectedImage(null);
            }
        } catch (err) {
            toast.error(err.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 300,
            });
        }
    };

    const updateStatus = async (waveId, waveStatus) => {
        try {
            const response = await axios.put(
                `http://127.0.0.5:3000/user/${id}/waves`,
                { status: !waveStatus, id: waveId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (response.data.status) {
                setIsActive(!isActive);
            }
        } catch (err) {}
    };

    useEffect(() => {
        fetchIcon();
    }, []);

    useEffect(() => {
        getWaveList();
    }, [isPosted, isActive]);

    const schema = Yup.object({
        message: Yup.string()
            .min(5, "Minimum 5 characters!")
            .max(150, "Maximum 150 characters!")
            .required("Required!"),
    });

    const initialValues = {
        message: "",
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
        setSelectedImageName(event.target.files[0].name);
    };

    const handleShowImageInput = () => {
        fileInputRef.current.click();
    };

    const handleStatusChange = (id, status) => {
        updateStatus(id, status);
    };

    const handleWaveSearch = (event) => {
        const filteredWave = waveList.filter((item) =>
            item.message
                .toLowerCase()
                .includes(event.target.value.toLowerCase())
        );
        setSearchWaveList(filteredWave);
    };

    const Formik = useFormik({
        initialValues: initialValues,
        validationSchema: schema,
        onSubmit: (values, action) => {
            postWave(values, action);
        },
    });

    return (
        <div className="dashboard-wrapper">
            <div className="user-wrapper">
                <div id="preferences-header">
                    <img
                        id="left-arrow"
                        src="/left-arrow.png"
                        alt="Go Back"
                        onClick={() => {
                            navigate(`/user/${id}`);
                        }}
                    />
                    <h2>Create Waves</h2>
                </div>
                <div id="wave-container">
                    <div id="wave-img-container">
                        <img
                            id="profile-user-icon"
                            src={profilePhoto ? profilePhoto : "/user.png"}
                            alt="icon"
                        />
                        <div id="upload-photo">
                            <h3 id="wave-username">{name}</h3>
                        </div>
                    </div>
                    <div id="wave-input">
                        <p id="wave-label">What do you want to share?</p>
                        <form onSubmit={Formik.handleSubmit}>
                            <input
                                type="file"
                                accept="image/*"
                                id="imageUpload"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />
                            <input
                                type="text"
                                id="wave-image-input"
                                onClick={handleShowImageInput}
                                placeholder={
                                    selectedImageName
                                        ? selectedImageName
                                        : "Upload Photos"
                                }
                                readOnly
                            />
                            <textarea
                                id="wave-message-input"
                                name="message"
                                placeholder="Write something..."
                                onChange={Formik.handleChange}
                                onBlur={Formik.handleBlur}
                                value={Formik.values.message}
                            />
                            {Formik.errors.message && Formik.touched.message ? (
                                <p className="form-errors formik-errors">
                                    {Formik.errors.message}
                                </p>
                            ) : null}

                            <button type="submit" id="create-wave-button">
                                Create Wave
                            </button>
                        </form>
                        <div id="search-wave">
                            <img
                                id="search-icon"
                                src="/search.png"
                                alt="Search"
                            />
                            <input
                                id="input-search-wave"
                                type="text"
                                placeholder="Search"
                                onChange={handleWaveSearch}
                            />
                        </div>
                        {searchWaveList.map((item, key) => (
                            <div key={key} id="parent-user">
                                <div id="wave-history-container">
                                    <img
                                        src={
                                            profilePhoto
                                                ? profilePhoto
                                                : "/user.png"
                                        }
                                        alt="Icon"
                                    />
                                    <div id="invited-user-detail">
                                        <p id="user-name">{userName}</p>
                                        <p id="wave-message">{item.message}</p>
                                    </div>
                                    <div
                                        id="status"
                                        style={{
                                            background: item.status
                                                ? "#02480d"
                                                : "#B50E03",
                                        }}
                                        onClick={() =>
                                            handleStatusChange(
                                                item.id,
                                                item.status
                                            )
                                        }
                                    >
                                        <p>
                                            {item.status
                                                ? "Active"
                                                : "In Active"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Options />
        </div>
    );
}

export default CreateWaves;
