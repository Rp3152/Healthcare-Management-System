import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import "./waveEdit.css";
import { useRef, useState } from "react";
import { Form, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

function WaveEdit({
    waveId,
    closeModel,
    waveImage,
    waveMessage,
    userName,
    userIcon,
    isUpdated,
    setIsUpdated,
    setWaveMessage,
}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const { id } = useParams();

    const updateWave = async ({ message }, action) => {
        const formData = new FormData();
        selectedFile && formData.append("image", selectedFile);
        formData.append("message", message);

        try {
            const response = await axios.put(
                `http://127.0.0.5:3000/admin/${id}/update-wave/${waveId}`,
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
                Formik.setValues({ message: message });
                toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 300,
                });
                setIsUpdated(!isUpdated);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message, {
                position: "bottom-right",
                autoClose: 300,
            });
        }
    };

    const schema = Yup.object({
        message: Yup.string()
            .min(5, "Minimum 5 characters!")
            .max(150, "Maximum 150 characters!")
            .required("Required!"),
    });

    const initialValues = {
        message: waveMessage,
    };
    const Formik = useFormik({
        initialValues: initialValues,
        validationSchema: schema,
        onSubmit: (values, action) => {
            updateWave(values, action);
        },
    });

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleShowImageInput = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            <div id="wave-model-wrapper" onClick={closeModel}></div>
            <div id="wave-info-model">
                <div id="user-data-container">
                    <img
                        id="user-image"
                        src={userIcon ? userIcon : "/user.png"}
                        alt="icon"
                    />
                    <h3>{userName}</h3>
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
                <form onSubmit={Formik.handleSubmit}>
                    <div id="wave-message-div">
                        <div id="wave-msg-container">
                            <h3>Message</h3>
                            <textarea
                                id="wave-message-edit"
                                name="message"
                                placeholder="Edit Message"
                                value={Formik.values.message}
                                onChange={Formik.handleChange}
                                onBlur={Formik.handleBlur}
                            />
                            {Formik.errors.message && Formik.touched.message ? (
                                <p id="form-errors">{Formik.errors.message}</p>
                            ) : null}
                        </div>
                        <div id="image">
                            <img
                                src={
                                    selectedFile
                                        ? URL.createObjectURL(selectedFile)
                                        : waveImage
                                }
                            />
                            <div id="svg-container">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={66}
                                    height={66}
                                    viewBox="0 0 48 48"
                                    onClick={handleShowImageInput}
                                >
                                    <path
                                        fill="none"
                                        stroke="black"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={4}
                                        d="M11.678 20.271C7.275 21.318 4 25.277 4 30c0 5.523 4.477 10 10 10c.947 0 1.864-.132 2.733-.378m19.322-19.351c4.403 1.047 7.677 5.006 7.677 9.729c0 5.523-4.477 10-10 10c-.947 0-1.864-.132-2.732-.378M36 20c0-6.627-5.373-12-12-12s-12 5.373-12 12m5.065 7.881L24 20.924L31.132 28M24 38V24.462"
                                    ></path>
                                </svg>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                id="imageUpload"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>
                    <button id="update-wave-btn" type="submit">
                        Update
                    </button>
                </form>
            </div>
        </>
    );
}

export default WaveEdit;
