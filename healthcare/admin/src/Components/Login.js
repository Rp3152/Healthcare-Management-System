import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

function Login() {
    const navigate = useNavigate();

    const dataSchema = Yup.object({
        email: Yup.string().email("Invalid email!").required("Required!"),
        password: Yup.string().required("Required!"),
    });

    const startingValue = {
        email: "",
        password: "",
    };

    const verifyData = async (data) => {
        try {
            let response = await axios.post(
                "http://127.0.0.5:3000/admin/login",
                data
            );
            let id = response.data.data.id;
            localStorage.setItem("token", response.data.data.token);
            toast.success(response.data.message, {
                position: "top-center",
                autoClose: 300,
            });

            setTimeout(() => {
                navigate(`/admin/${id}`);
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
            verifyData(values);
        },
    });
    return (
        <div id="login-page">
            <div id="login-form">
                <div id="login-header">
                    <h5>SIGNIN FORM</h5>
                    <h1>Login</h1>
                </div>
                <form
                    id="login-details-container"
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
                    <label htmlFor="password" className="input-labels">
                        Password <em className="star">*</em>
                    </label>
                    <br />
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        onChange={Formik.handleChange}
                        onBlur={Formik.handleBlur}
                        value={Formik.values.password}
                    />
                    <br />
                    {Formik.errors.password && Formik.touched.password ? (
                        <p className="form-errors">{Formik.errors.password}</p>
                    ) : null}

                    <button type="submit" id="login-btn">
                        Login
                    </button>
                    <p id="register-paragraph">
                        Don't have an account?&nbsp;
                        <Link to="/" id="register-link">
                            Register
                        </Link>
                    </p>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Login;
