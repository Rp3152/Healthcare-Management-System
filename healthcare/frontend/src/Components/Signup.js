import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./All.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const dataSchema = Yup.object({
    firstName: Yup.string()
        .min(2, "Minimum 2 characters!")
        .max(30, "Maximum 30 characters!")
        .required("Required!"),
    lastName: Yup.string().max(30, "Maximum 30 characters!"),
    email: Yup.string().email("Invalid email!").required("Required!"),
    phoneNumber: Yup.number("Invalid number!")
        .integer("Number cannot be in decimals!")
        .positive("Number cannot be negative!")
        .test(
            "len",
            "Invalid Phone Number!",
            (val) => val && val.toString().length === 10
        )
        .required("Required!"),
    password: Yup.string()
        .min(4, "Minimum 4 characters!")
        .max(30, "Maximum 30 characters!")
        .matches(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w]).*$/,
            "Password must include a number, lowercase and uppercase letter, and a symbol"
        )
        .required("Required!"),
    confirm_password: Yup.string()
        .oneOf([Yup.ref("password"), null], "Password must be the same!")
        .required("Required!"),
});

const startingValue = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirm_password: "",
};

function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const postSignupData = async (data) => {
        try {
            const signupData = {
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                phone_number: `${data.phoneNumber}`,
                password: data.password,
            };
            let response = await axios.post(
                "http://127.0.0.5:3000",
                signupData
            );
            toast.success(response.data.message, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 300,
            });
            setTimeout(() => {
                navigate("/login");
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
        onSubmit: (values) => {
            postSignupData(values);
        },
    });

    return (
        <div className="signup-page">
            <div className="left-part"></div>
            <div className="right-part">
                <h1 id="signup-header">Sign Up</h1>
                <span id="rectangle-line"></span>
                <form id="signup-form" onSubmit={Formik.handleSubmit}>
                    <div id="name">
                        <div>
                            <label htmlFor="first-name">First Name</label>
                            <br />
                            <input
                                id="first-name"
                                name="firstName"
                                type="text"
                                placeholder="First Name"
                                value={Formik.values.firstName}
                                onChange={Formik.handleChange}
                                onBlur={Formik.handleBlur}
                            />
                            {Formik.errors.firstName &&
                            Formik.touched.firstName ? (
                                <p className="form-errors">
                                    {Formik.errors.firstName}
                                </p>
                            ) : null}
                        </div>
                        <div>
                            <label htmlFor="last-name">Last Name</label>
                            <br />
                            <input
                                id="last-name"
                                name="lastName"
                                type="text"
                                placeholder="Last Name"
                                value={Formik.values.lastName}
                                onChange={Formik.handleChange}
                                onBlur={Formik.handleBlur}
                            />
                            {Formik.errors.lastName &&
                            Formik.touched.lastName ? (
                                <p className="form-errors">
                                    {Formik.errors.lastName}
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <div id="other-details">
                        <label htmlFor="email">Enter Email</label>
                        <br />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            maxLength="50"
                            value={Formik.values.email}
                            onChange={Formik.handleChange}
                            onBlur={Formik.handleBlur}
                        />
                        <br />
                        {Formik.errors.email && Formik.touched.email ? (
                            <p className="form-errors">{Formik.errors.email}</p>
                        ) : null}
                        <label htmlFor="phone">Enter Phone No.</label>
                        <br />
                        <input
                            id="number"
                            name="phoneNumber"
                            type="number"
                            placeholder="Phone Number"
                            value={Formik.values.phoneNumber}
                            onChange={Formik.handleChange}
                            onBlur={Formik.handleBlur}
                        />
                        <br />
                        {Formik.errors.phoneNumber &&
                        Formik.touched.phoneNumber ? (
                            <p className="form-errors">
                                {Formik.errors.phoneNumber}
                            </p>
                        ) : null}
                        <label htmlFor="password">Password</label>
                        <br />

                        <div className="password-container">
                            <input
                                id="password"
                                className="userPassword"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={Formik.values.password}
                                onChange={Formik.handleChange}
                                onBlur={Formik.handleBlur}
                            />
                            <img
                                src={
                                    showPassword
                                        ? "open_eye.png"
                                        : "close_eye.png"
                                }
                                alt="Show Me/Hide Me"
                                onClick={() => setShowPassword(!showPassword)}
                                className="eye-icon"
                            />
                        </div>
                        {Formik.errors.password && Formik.touched.password ? (
                            <p className="form-errors">
                                {Formik.errors.password}
                            </p>
                        ) : null}

                        <label htmlFor="confirm-password">
                            Confirm Password
                        </label>
                        <br />
                        <div className="password-container">
                            <input
                                id="confirm-password"
                                name="confirm_password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={Formik.values.confirm_password}
                                onChange={Formik.handleChange}
                                onBlur={Formik.handleBlur}
                            />
                            <img
                                src={
                                    showConfirmPassword
                                        ? "open_eye.png"
                                        : "close_eye.png"
                                }
                                alt="Show Me/Hide Me"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
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
                    <div>
                        <Link to="/login" id="login-signup-link">
                            Login
                        </Link>
                    </div>
                    <button type="submit" id="login-signup-button">
                        SIGN UP
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Signup;
