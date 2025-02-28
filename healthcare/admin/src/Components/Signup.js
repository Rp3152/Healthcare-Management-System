import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./signup.css";

function Signup() {
    const navigate = useNavigate();

    const dataSchema = Yup.object({
        name: Yup.string()
            .min(2, "Minimum 2 characters!")
            .max(60, "Maximum 30 characters!")
            .required("Required!"),

        email: Yup.string().email("Invalid email!").required("Required!"),
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
        name: "",
        email: "",
        password: "",
        confirm_password: "",
    };

    const postAdminData = async (data) => {
        try {
            let response = await axios.post(
                "http://127.0.0.5:3000/admin",
                data
            );
            toast.success(response.data.message, {
                position: "top-center",
                autoClose: 300,
            });
            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (err) {
            toast.error(err.response.data.message, {
                position: "top-center",
                autoClose: 300,
            });
        }
    };

    const Formik = useFormik({
        initialValues: startingValue,
        validationSchema: dataSchema,
        onSubmit: (values) => {
            postAdminData(values);
        },
    });
    return (
        <div id="signup-page">
            <div id="signup-form">
                <div id="signup-header">
                    <h5>SIGNUP FORM</h5>
                    <h1>Register</h1>
                </div>
                <form
                    id="signup-details-container"
                    onSubmit={Formik.handleSubmit}
                >
                    <label htmlFor="email" className="input-labels">
                        Email <em className="star">*</em>
                    </label>
                    <br />
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        onChange={Formik.handleChange}
                        onBlur={Formik.handleBlur}
                        value={Formik.values.email}
                    />
                    <br />
                    {Formik.errors.email && Formik.touched.email ? (
                        <p className="form-errors">{Formik.errors.email}</p>
                    ) : null}
                    <label htmlFor="new-password" className="input-labels">
                        New Password <em className="star">*</em>
                    </label>
                    <br />
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="New Password"
                        onChange={Formik.handleChange}
                        onBlur={Formik.handleBlur}
                        value={Formik.values.password}
                    />
                    <br />
                    {Formik.errors.password && Formik.touched.password ? (
                        <p className="form-errors">{Formik.errors.password}</p>
                    ) : null}
                    <label htmlFor="confirm-password" className="input-labels">
                        Confirm Password <em className="star">*</em>
                    </label>
                    <br />
                    <input
                        type="password"
                        name="confirm_password"
                        id="confirm_password"
                        placeholder="Confirm Password"
                        onChange={Formik.handleChange}
                        onBlur={Formik.handleBlur}
                        value={Formik.values.confirm_password}
                    />
                    <br />
                    {Formik.errors.confirm_password &&
                    Formik.touched.confirm_password ? (
                        <p className="form-errors">
                            {Formik.errors.confirm_password}
                        </p>
                    ) : null}
                    <label htmlFor="name" className="input-labels">
                        Full Name <em className="star">*</em>
                    </label>
                    <br />
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter Full Name"
                        onChange={Formik.handleChange}
                        onBlur={Formik.handleBlur}
                        value={Formik.values.name}
                    />
                    <br />
                    {Formik.errors.name && Formik.touched.name ? (
                        <p className="form-errors">{Formik.errors.name}</p>
                    ) : null}
                    <button type="submit" id="register-btn">
                        Register Now
                    </button>
                    <p id="login-paragraph">
                        If you already have an account?&nbsp;
                        <Link to="/login" id="login-link">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Signup;
