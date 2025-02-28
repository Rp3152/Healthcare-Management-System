import "./All.css";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Options from "./Options";

const dataSchema = Yup.object({
    name: Yup.string()
        .min(2, "Minimum 2 characters!")
        .max(50, "Maximum 30 characters!")
        .required("Required!"),
    email: Yup.string().email("Invalid email!").required("Required!"),
    message: Yup.string()
        .min(1, "Mininum 1 character!")
        .max(50, "Maximum 50 characters!")
        .required("Required!"),
});

const startingValue = {
    name: "",
    email: "",
    message: "",
};

function InviteFriends() {
    const [counter, setCounter] = useState(1);
    const navigate = useNavigate();
    const { id } = useParams();

    const inviteUser = async (values, action) => {
        try {
            const data = {
                inviteEmail: values.email,
                inviteMessage: values.message,
                inviteName: values.name,
            };
            const response = await axios.post(
                `http://127.0.0.5:3000/user/${id}/invite-friends`,
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
                action.resetForm();
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

    const Formik = useFormik({
        initialValues: startingValue,
        validationSchema: dataSchema,
        onSubmit: (values, action) => {
            inviteUser(values, action);
        },
    });

    return (
        <div className="dashboard-wrapper">
            <div id="friend-dashboard">
                <div className="user-wrapper">
                    <div id="friends-header">
                        <img
                            id="left-arrow"
                            src="/left-arrow.png"
                            onClick={() => navigate(`/user/${id}/friends`)}
                        />
                        <h2>Friends</h2>
                    </div>
                    <p id="friends-header-paragraph">
                        Invites some friends Jasmine, show them your Waves and
                        let’s see what they can do!
                    </p>
                    <div id="friends-container">
                        <div id="friend-count">
                            <h4>Friend #{counter}</h4>
                        </div>
                        <div id="friend">
                            <form
                                id="invite-friends-form"
                                onSubmit={Formik.handleSubmit}
                            >
                                <div id="name-email-wrapper">
                                    <div id="friend-details">
                                        <label htmlFor="name">Full Name</label>
                                        <br />
                                        <div className="friend-details-container">
                                            <input
                                                name="name"
                                                type="text"
                                                placeholder="Full Name"
                                                value={Formik.values.name}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}
                                            />
                                        </div>
                                        {Formik.errors.name &&
                                        Formik.touched.name ? (
                                            <p className="form-errors">
                                                {Formik.errors.name}
                                            </p>
                                        ) : null}
                                    </div>
                                    <div id="friend-details">
                                        <label htmlFor="email">
                                            Email Address
                                        </label>
                                        <br />
                                        <div className="friend-details-container">
                                            <input
                                                name="email"
                                                type="email"
                                                placeholder="Email"
                                                value={Formik.values.email}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}
                                            />
                                        </div>
                                        {Formik.errors.email &&
                                        Formik.touched.email ? (
                                            <p className="form-errors">
                                                {Formik.errors.email}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                                <div id="message-container">
                                    <label htmlFor="message">Message</label>
                                    <br />
                                    <div className="friend-details-container">
                                        <input
                                            id="message"
                                            name="message"
                                            type="text"
                                            placeholder="Message"
                                            value={Formik.values.message}
                                            onChange={Formik.handleChange}
                                            onBlur={Formik.handleBlur}
                                        />
                                    </div>
                                    {Formik.errors.message &&
                                    Formik.touched.message ? (
                                        <p className="form-errors">
                                            {Formik.errors.message}
                                        </p>
                                    ) : null}
                                </div>
                                <div id="add-more">
                                    <p>+ Add More</p>
                                </div>
                                <div id="friends-button-container">
                                    <button type="submit" id="update-button">
                                        Friends
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Options />
        </div>
    );
}

export default InviteFriends;
