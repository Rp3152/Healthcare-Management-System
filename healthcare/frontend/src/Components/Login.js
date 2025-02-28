import "./All.css";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const dataSchema = Yup.object({
    email: Yup.string().email("Invalid email!").required("Required!"),
    password: Yup.string().required("Required!"),
});

const startingValue = {
    email: "",
    password: "",
};

function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const verifyData = async (data) => {
        try {
            let response = await axios.post(
                "http://127.0.0.5:3000/login",
                data
            );
            let id = response.data.data.id;
            localStorage.setItem("token", response.data.data.token);
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
        onSubmit: (values) => {
            verifyData(values);
        },
    });

    return (
        <div className="signup-page" id="login-page">
            <div className="left-part"></div>
            <div className="right-part">
                <h1 id="signup-header">Login Your Account</h1>
                <span id="rectangle-line"></span>
                <form id="signup-form" onSubmit={Formik.handleSubmit}>
                    <div id="login-details">
                        <label htmlFor="email">Email Address</label>
                        <br />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            maxLength="50"
                            minLength="1"
                            value={Formik.values.email}
                            onChange={Formik.handleChange}
                            onBlur={Formik.handleBlur}
                        />
                        <br />
                        {Formik.errors.email && Formik.touched.email ? (
                            <p className="form-errors">{Formik.errors.email}</p>
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
                                maxLength="30"
                                minLength="1"
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
                    </div>
                    <div>
                        <Link to="/" id="login-signup-link">
                            SignUp
                        </Link>
                    </div>
                    <button type="submit" id="login-signup-button">
                        LOGIN
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Login;
