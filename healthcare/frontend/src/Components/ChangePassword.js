import "./All.css";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Options from "./Options";

const dataSchema = Yup.object({
    old_password: Yup.string().required("Required!"),
    new_password: Yup.string()
        .min(4, "Minimum 4 characters!")
        .max(30, "Maximum 30 characters!")
        .matches(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w]).*$/,
            "Password must include a number, lowercase and uppercase letter, and a symbol"
        )
        .required("Required!"),
    confirm_password: Yup.string()
        .oneOf(
            [Yup.ref("new_password"), null],
            "Password must be the same as new password!"
        )
        .required("Required!"),
});

const startingValue = {
    old_password: "",
    new_password: "",
    confirm_password: "",
};

function ChangePassword() {
    const { id } = useParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const changePassword = async (data) => {
        try {
            const response = await axios.put(
                `http://127.0.0.5:3000/user/${id}`,
                {
                    password: data.new_password,
                    old_password: data.old_password,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            toast.success(response.data.message, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 300,
            });
            setTimeout(() => {
                navigate(`/user/${id}`);
            }, 1000);
        } catch (err) {
            toast.error(err.response.data.message, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 300,
            });
        }
    };

    const Formik = useFormik({
        initialValues: startingValue,
        validationSchema: dataSchema,
        onSubmit: (values, action) => {
            changePassword(values);
            action.resetForm();
        },
    });

    return (
        <div className="dashboard-wrapper">
            <div className="user-wrapper">
                <div id="change-password-header">
                    <img
                        id="left-arrow"
                        src="/left-arrow.png"
                        alt="Go Back"
                        onClick={() => {
                            navigate(`/user/${id}`);
                        }}
                    />
                    <h2>Change Passwords</h2>
                </div>
                <div id="change-password-container">
                    <form
                        id="change-password-form"
                        onSubmit={Formik.handleSubmit}
                    >
                        <div id="password-details">
                            <label htmlFor="password">Old Password</label>
                            <br />
                            <div className="password-container">
                                <input
                                    className="userPassword"
                                    name="old_password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Old Password"
                                    maxLength="30"
                                    minLength="1"
                                    value={Formik.values.old_password}
                                    onChange={Formik.handleChange}
                                    onBlur={Formik.handleBlur}
                                />
                                <img
                                    src={
                                        showPassword
                                            ? "/open_eye.png"
                                            : "/close_eye.png"
                                    }
                                    alt="Show Me/Hide Me"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="eye-icon"
                                />
                            </div>
                            {Formik.errors.old_password &&
                            Formik.touched.old_password ? (
                                <p className="form-errors">
                                    {Formik.errors.old_password}
                                </p>
                            ) : null}
                        </div>
                        <div id="password-details">
                            <label htmlFor="password">New Password</label>
                            <br />
                            <div className="password-container">
                                <input
                                    className="userPassword"
                                    name="new_password"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    maxLength="30"
                                    minLength="1"
                                    value={Formik.values.new_password}
                                    onChange={Formik.handleChange}
                                    onBlur={Formik.handleBlur}
                                />
                                <img
                                    src={
                                        showNewPassword
                                            ? "/open_eye.png"
                                            : "/close_eye.png"
                                    }
                                    alt="Show Me/Hide Me"
                                    onClick={() =>
                                        setShowNewPassword(!showNewPassword)
                                    }
                                    className="eye-icon"
                                />
                            </div>
                            {Formik.errors.new_password &&
                            Formik.touched.new_password ? (
                                <p className="form-errors">
                                    {Formik.errors.new_password}
                                </p>
                            ) : null}
                        </div>
                        <div id="password-details">
                            <label htmlFor="password">Confirm Password</label>
                            <br />
                            <div className="password-container">
                                <input
                                    className="userPassword"
                                    name="confirm_password"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm Password"
                                    maxLength="30"
                                    minLength="1"
                                    value={Formik.values.confirm_password}
                                    onChange={Formik.handleChange}
                                    onBlur={Formik.handleBlur}
                                />
                                <img
                                    src={
                                        showConfirmPassword
                                            ? "/open_eye.png"
                                            : "/close_eye.png"
                                    }
                                    alt="Show Me/Hide Me"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="eye-icon"
                                />
                            </div>
                            {Formik.errors.confirm_password &&
                            Formik.touched.confirm_password ? (
                                <p className="form-errors">
                                    {Formik.errors.confirm_password}
                                </p>
                            ) : null}
                        </div>
                        <div id="button-container">
                            <button type="submit" id="update-button">
                                Update
                            </button>
                        </div>
                    </form>
                    <img id="locker-img" src="/protection.png" alt="icon" />
                </div>
            </div>
            <Options />
            <ToastContainer />
        </div>
    );
}

export default ChangePassword;
