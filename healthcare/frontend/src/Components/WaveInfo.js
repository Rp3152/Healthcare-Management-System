import "./All.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function WaveInfo({
    closeModel,
    waveId,
    waveImage,
    waveMessage,
    posterIcon,
    posterName,
}) {
    const [addComment, setAddComment] = useState(false);
    const [isCommentPosted, setIsCommentPosted] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [commentId, setCommentId] = useState(null);
    const { id } = useParams();

    const fetchComments = async () => {
        try {
            let response = await axios.get(
                `http://127.0.0.5:3000/user/${waveId}/waves/comments`,

                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (response && response.data && response.data.status) {
                setCommentList(response.data.data);
            }
        } catch (err) {
            toast.error(err.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 300,
            });
        }
    };

    const postComment = async ({ comment }, action) => {
        try {
            const data = {
                waveId: waveId,
                comment: comment,
            };
            const response = await axios.post(
                `http://127.0.0.5:3000/user/${id}/waves/comments`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (response.data.status) {
                setIsCommentPosted(!isCommentPosted);
                toast.success(response.data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 300,
                });
            }
        } catch (err) {
            toast.error(err.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 300,
            });
        }
    };

    const deleteComment = async (commentId) => {
        try {
            const response = await axios.delete(
                `http://127.0.0.5:3000/user/${id}/waves/comments`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    data: { id: commentId },
                }
            );
            if (response.data.status) {
                setIsDeleted(!isDeleted);
                toast.success(response.data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 300,
                });
            }
        } catch (err) {
            toast.error(err.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 300,
            });
        }
    };

    const updateComment = async (comment) => {
        try {
            const response = await axios.put(
                `http://127.0.0.5:3000/user/${id}/waves/comments`,
                { id: commentId, comment: comment },
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
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 300,
                });
            }
        } catch (err) {
            toast.error(err.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 300,
            });
        }
    };

    useEffect(() => {
        fetchComments();
    }, [isCommentPosted, isDeleted, isUpdated]);

    const handleCommentDelete = (commentId) => {
        deleteComment(commentId);
    };

    const handleCommentUpdate = (comment) => {
        updateComment(comment);
        setIsEdit(false);
    };

    const schema = Yup.object({
        comment: Yup.string()
            .min(5, "Minimum 5 characters!")
            .max(100, "Maximum 100 characters!")
            .required("Required!"),
    });

    const initialValues = {
        comment: "",
    };

    const Formik = useFormik({
        initialValues: initialValues,
        validationSchema: schema,
        onSubmit: (values, action) => {
            isEdit ? handleCommentUpdate(values.comment) : postComment(values);
            action.resetForm();
            setAddComment(false);
        },
    });
    return (
        <>
            <div id="model-wrapper" onClick={closeModel}></div>
            <div id="wave-model">
                <div id="cover-color">
                    <h1>Details</h1>
                    <div id="user-profile">
                        <img
                            id="wave-user-icon"
                            src={posterIcon ? posterIcon : "/user.png"}
                            alt="user"
                        />
                        <div id="creator-details">
                            <p id="creator-name">{posterName}</p>
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
                <div id="wave-message-container">
                    <div id="message">
                        <h3>Message</h3>
                        <p>{waveMessage}</p>
                    </div>
                    <span id="image-height-line"></span>
                    <div id="image">
                        <img src={waveImage} />
                    </div>
                </div>
                <div id="add-button-container">
                    <button
                        id="add-comment"
                        type="button"
                        style={{ display: addComment ? "none" : "" }}
                        onClick={() => setAddComment(true)}
                    >
                        Add Comments
                    </button>
                    <form
                        id="comment-input"
                        style={{ display: !addComment ? "none" : "" }}
                        onSubmit={Formik.handleSubmit}
                    >
                        <div id="input-box">
                            <input
                                type="text"
                                name="comment"
                                id="comment"
                                placeholder="Write something.."
                                value={Formik.values.comment}
                                onChange={Formik.handleChange}
                                onBlur={Formik.handleBlur}
                            />
                            {Formik.errors.comment && Formik.touched.comment ? (
                                <p
                                    id="errors"
                                    className="form-errors formik-errors"
                                >
                                    {Formik.errors.comment}
                                </p>
                            ) : null}
                        </div>
                        <button
                            type="button"
                            id="post-comment"
                            onClick={() => {
                                setAddComment(false);
                                setIsEdit(false);
                                Formik.handleReset();
                            }}
                        >
                            Cancel
                        </button>
                        <button type="submit" id="post-comment">
                            Post
                        </button>
                    </form>
                </div>
                {commentList.map((item, key) => (
                    <div key={key} id="comment-details">
                        <p id="commenter-message">
                            <b id="commenter-name">{item.firstName} :</b>{" "}
                            {item.comment}
                        </p>
                        {item.isSameUser ? (
                            <div id="button-container">
                                <p
                                    id="edit-button"
                                    onClick={() => {
                                        Formik.setValues({
                                            comment: item.comment,
                                        });
                                        setIsEdit(true);
                                        setAddComment(true);
                                        setCommentId(item.id);
                                    }}
                                >
                                    Edit&nbsp;|&nbsp;
                                </p>
                                <p
                                    id="delete-button"
                                    onClick={() => handleCommentDelete(item.id)}
                                >
                                    Delete
                                </p>
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        </>
    );
}

export default WaveInfo;
