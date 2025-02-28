import "./editUser.css";
import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function Profile({ userId }) {
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isBasicDetails, setIsBasicDetails] = useState(true);
    const [isUpdated, setIsUpdated] = useState(false);
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [ssn, setSsn] = useState(null);
    const [phone_number, setPhoneNumber] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [marital_status, setMaritalStatus] = useState("");
    const [social, setSocial] = useState("");
    const [kids, setKids] = useState("");
    const [profileIcon, setProfileIcon] = useState(null);
    const { id } = useParams();

    const navigate = useNavigate();

    const fetchBasicData = async () => {
        try {
            const response = await axios.get(
                `http://127.0.0.5:3000/admin/${id}/users/${userId}/user-info`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (response.data.status) {
                setFirstName(response.data.data.firstName);
                setLastName(response.data.data.lastName);
                setEmail(response.data.data.email);
                setSsn(response.data.data.ssn);
                setPhoneNumber(response.data.data.phoneNumber);
                setAddress1(response.data.data.address1);
                setAddress2(response.data.data.address2);
                setCity(response.data.data.city);
                setState(response.data.data.state);
                setZip(response.data.data.zip);
                setDob(response.data.data.dob);
                setGender(response.data.data.gender);
                setMaritalStatus(response.data.data.maritalStatus);
                setSocial(response.data.data.social);
                setKids(response.data.data.kids);
                setProfileIcon(response.data.data.profileIcon);
            }
        } catch (err) {
            toast.error(err.response.data.message, {
                position: "bottom-right",
                autoClose: 300,
            });
        }
    };

    useEffect(() => {
        fetchBasicData();
    }, [isUpdated]);

    const postImage = async (file) => {
        const formData = new FormData();
        formData.append("profileIcon", file);

        try {
            const response = await axios.put(
                `http://127.0.0.5:3000/admin/${id}/users/${userId}`,
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
                setProfileIcon(response.data.data.profileIcon);
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

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
        postImage(file);
    };

    const handleShowImageInput = () => {
        fileInputRef.current.click();
    };

    function BasicDetails() {
        const basicDetails = Yup.object({
            first_name: Yup.string()
                .min(2, "Minimum 2 characters!")
                .max(30, "Maximum 30 characters!")
                .required("Required!"),
            last_name: Yup.string().max(30, "Maximum 30 characters!"),
            email: Yup.string().email("Invalid email!").required("Required!"),
            ssn: Yup.string().matches(
                /^[0-9]\d{5}$/,
                "Invalid security number!"
            ),
            phone_number: Yup.string().matches(
                /^[6-9]\d{9}$/,
                "Invalid phone number!"
            ),
            address1: Yup.string()
                .min(2, "Minimum 2 characters!")
                .max(100, "Maximum 100 characters!")
                .required("Required!"),
            address2: Yup.string().max(100, "Maximum 100 characters!"),
            city: Yup.string()
                .min(1, "Minimum 1 characters!")
                .max(30, "Maximum 30 characters!")
                .required("Required!"),
            state: Yup.string()
                .min(1, "Minimum 1 characters!")
                .max(30, "Maximum 30 characters!")
                .required("Required!"),
            zip: Yup.number("Invalid Zip code!")
                .integer("Invalid Zip code!")
                .positive("Invalid Zip code!")
                .max(999999, "Length cannot be greater than 6!")
                .required("Required!"),
        });

        const basicValues = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            ssn: ssn ? ssn : "",
            phone_number: phone_number ? phone_number : "",
            address1: address1,
            address2: address2,
            city: city,
            state: state,
            zip: zip ? zip : "",
        };

        const updateBasicDetails = async (values) => {
            const data = {
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                ssn: parseInt(values.ssn),
                phone_number: `${values.phone_number}`,
                address1: values.address1,
                address2: values.address2,
                city: values.city,
                state: values.state,
                zip: values.zip,
            };
            try {
                const response = await axios.put(
                    `http://127.0.0.5:3000/admin/${id}/users/${userId}/basic-details`,
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
                    setIsUpdated(!isUpdated);
                }
                toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 300,
                });
            } catch (err) {
                toast.error(err.response.data.message, {
                    position: "bottom-right",
                    autoClose: 300,
                });
            }
        };

        const BasicFormik = useFormik({
            initialValues: basicValues,
            validationSchema: basicDetails,
            onSubmit: (values) => {
                updateBasicDetails(values);
            },
        });

        return (
            <div id="basic-detail-container">
                <form id="basic-info-form" onSubmit={BasicFormik.handleSubmit}>
                    <div id="basic-informations">
                        <div id="basic-details-1">
                            <p
                                id="basic-detail-label"
                                onClick={() => setIsBasicDetails(true)}
                            >
                                Basic Details
                            </p>
                            {isBasicDetails && (
                                <span id="basic-details-bottom-line"></span>
                            )}
                        </div>
                        <div id="basic-details-1">
                            <p
                                id="personal-detail-label"
                                onClick={() => setIsBasicDetails(false)}
                            >
                                Personal Details
                            </p>
                            {!isBasicDetails && (
                                <span id="personal-details-bottom-line"></span>
                            )}
                        </div>
                    </div>
                    <div className="basic-details">
                        <div id="basic-details-1">
                            <label htmlFor="first_name">
                                First Name <em>*</em>
                            </label>
                            <br />
                            <input
                                id="first_name"
                                name="first_name"
                                type="text"
                                placeholder="First Name"
                                onChange={BasicFormik.handleChange}
                                onBlur={BasicFormik.handleBlur}
                                value={BasicFormik.values.first_name}
                            />
                            {BasicFormik.errors.first_name &&
                            BasicFormik.touched.first_name ? (
                                <p className="form-errors">
                                    {BasicFormik.errors.first_name}
                                </p>
                            ) : null}
                        </div>
                        <div id="basic-details-1">
                            <label htmlFor="last_name">Last Name</label>
                            <br />
                            <input
                                id="last_name"
                                name="last_name"
                                type="text"
                                placeholder="Last Name"
                                onChange={BasicFormik.handleChange}
                                onBlur={BasicFormik.handleBlur}
                                value={BasicFormik.values.last_name}
                            />
                            {BasicFormik.errors.last_name &&
                            BasicFormik.touched.last_name ? (
                                <p className="form-errors">
                                    {BasicFormik.errors.last_name}
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <div className="basic-details">
                        <div id="basic-details-1">
                            <label htmlFor="email">
                                Enter Email <em>*</em>
                            </label>
                            <br />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                onChange={BasicFormik.handleChange}
                                onBlur={BasicFormik.handleBlur}
                                value={BasicFormik.values.email}
                            />
                            {BasicFormik.errors.email &&
                            BasicFormik.touched.email ? (
                                <p className="form-errors">
                                    {BasicFormik.errors.email}
                                </p>
                            ) : null}
                        </div>
                        <div id="basic-details-1">
                            <label htmlFor="ssn">
                                Social Security (Numbers Only)
                            </label>
                            <br />
                            <input
                                id="ssn"
                                name="ssn"
                                type="number"
                                placeholder="452873"
                                onChange={BasicFormik.handleChange}
                                onBlur={BasicFormik.handleBlur}
                                value={BasicFormik.values.ssn}
                            />
                            {BasicFormik.errors.ssn &&
                            BasicFormik.touched.ssn ? (
                                <p className="form-errors">
                                    {BasicFormik.errors.ssn}
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <div className="basic-details">
                        <div id="basic-details-1">
                            <label htmlFor="phone_number">Mobile Number</label>
                            <br />
                            <input
                                id="phone_number"
                                name="phone_number"
                                type="number"
                                placeholder="9987889999"
                                onChange={BasicFormik.handleChange}
                                onBlur={BasicFormik.handleBlur}
                                value={BasicFormik.values.phone_number}
                            />
                            {BasicFormik.errors.phone_number &&
                            BasicFormik.touched.phone_number ? (
                                <p className="form-errors">
                                    {BasicFormik.errors.phone_number}
                                </p>
                            ) : null}
                        </div>
                        <div id="basic-details-1">
                            <label htmlFor="address1">
                                Address One <em>*</em>
                            </label>
                            <br />
                            <input
                                id="address1"
                                name="address1"
                                type="text"
                                placeholder="Address"
                                onChange={BasicFormik.handleChange}
                                onBlur={BasicFormik.handleBlur}
                                value={BasicFormik.values.address1}
                            />
                            {BasicFormik.errors.address1 &&
                            BasicFormik.touched.address1 ? (
                                <p className="form-errors">
                                    {BasicFormik.errors.address1}
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <div className="basic-details">
                        <div id="basic-details-1">
                            <label htmlFor="address2">Address Two</label>
                            <br />
                            <input
                                id="address2"
                                name="address2"
                                type="text"
                                placeholder="Address"
                                onChange={BasicFormik.handleChange}
                                onBlur={BasicFormik.handleBlur}
                                value={BasicFormik.values.address2}
                            />
                            {BasicFormik.errors.address2 &&
                            BasicFormik.touched.address2 ? (
                                <p className="form-errors">
                                    {BasicFormik.errors.address2}
                                </p>
                            ) : null}
                        </div>
                        <div id="basic-details-1">
                            <label htmlFor="city">
                                City <em>*</em>
                            </label>
                            <br />
                            <input
                                id="city"
                                name="city"
                                type="text"
                                placeholder="City"
                                onChange={BasicFormik.handleChange}
                                onBlur={BasicFormik.handleBlur}
                                value={BasicFormik.values.city}
                            />
                            {BasicFormik.errors.city &&
                            BasicFormik.touched.city ? (
                                <p className="form-errors">
                                    {BasicFormik.errors.city}
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <div className="basic-details">
                        <div id="basic-details-1">
                            <label htmlFor="state">
                                State <em>*</em>
                            </label>
                            <br />
                            <input
                                id="state"
                                name="state"
                                type="text"
                                placeholder="State"
                                onChange={BasicFormik.handleChange}
                                onBlur={BasicFormik.handleBlur}
                                value={BasicFormik.values.state}
                            />
                            {BasicFormik.errors.state &&
                            BasicFormik.touched.state ? (
                                <p className="form-errors">
                                    {BasicFormik.errors.state}
                                </p>
                            ) : null}
                        </div>
                        <div id="basic-details-1">
                            <label htmlFor="zip">
                                Home Zip Code <em>*</em>
                            </label>
                            <br />
                            <input
                                id="zip"
                                name="zip"
                                type="number"
                                placeholder="123456"
                                onChange={BasicFormik.handleChange}
                                onBlur={BasicFormik.handleBlur}
                                value={BasicFormik.values.zip}
                            />
                            {BasicFormik.errors.zip &&
                            BasicFormik.touched.zip ? (
                                <p className="form-errors">
                                    {BasicFormik.errors.zip}
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <div id="update-button-container">
                        <button type="submit" id="update-profile-btn">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    function PersonalDetails() {
        const personalDetails = Yup.object({
            dob: Yup.date("Invalid Date!").required("Required!"),
            gender: Yup.string().required("Required!"),
            marital_status: Yup.string(),
            ssn: Yup.string().matches(
                /^[0-9]\d{5}$/,
                "Invalid security number!"
            ),
            social: Yup.string().max(50, "Maximum 50 characters!"),
            kids: Yup.number("Invalid detail!")
                .integer("Invalid detail!")
                .positive("Invalid detail!")
                .nullable(true)
                .min(0, "Invalid detail!"),
        });

        const personalValues = {
            dob: dob,
            gender: gender ? gender : "Male",
            marital_status: marital_status ? marital_status : "Unmarried",
            ssn: ssn ? ssn : "",
            social: social,
            kids: kids ? kids : 0,
        };

        const updatePersonalDetails = async (values) => {
            try {
                const data = {
                    dob: values.dob,
                    gender: values.gender,
                    marital_status: values.marital_status,
                    ssn: parseInt(values.ssn),
                    social: values.social,
                    kids: parseInt(values.kids),
                };
                const response = await axios.put(
                    `http://127.0.0.5:3000/admin/${id}/users/${userId}/personal-details`,
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
                    setIsUpdated(!isUpdated);
                }
                toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 300,
                });
            } catch (err) {
                toast.error(err.response.data.message, {
                    position: "bottom-right",
                    autoClose: 300,
                });
            }
        };

        const PersonalFormik = useFormik({
            initialValues: personalValues,
            validationSchema: personalDetails,
            onSubmit: (values) => {
                updatePersonalDetails(values);
            },
        });
        return (
            <div id="basic-detail-container">
                <form
                    id="basic-info-form"
                    onSubmit={PersonalFormik.handleSubmit}
                >
                    <div id="basic-informations">
                        <div id="basic-details-1">
                            <p
                                id="basic-detail-label"
                                onClick={() => setIsBasicDetails(true)}
                            >
                                Basic Details
                            </p>
                            {isBasicDetails && (
                                <span id="basic-details-bottom-line"></span>
                            )}
                        </div>
                        <div id="basic-details-1">
                            <p
                                id="personal-detail-label"
                                onClick={() => setIsBasicDetails(false)}
                            >
                                Personal Details
                            </p>
                            {!isBasicDetails && (
                                <span id="personal-details-bottom-line"></span>
                            )}
                        </div>
                    </div>
                    <div className="basic-details">
                        <div id="basic-details-1">
                            <label htmlFor="dob">
                                DOB <em>*</em>
                            </label>
                            <br />
                            <input
                                id="dob"
                                name="dob"
                                type="date"
                                onChange={PersonalFormik.handleChange}
                                onBlur={PersonalFormik.handleBlur}
                                value={PersonalFormik.values.dob}
                            />
                            {PersonalFormik.errors.dob &&
                            PersonalFormik.touched.dob ? (
                                <p className="form-errors">
                                    {PersonalFormik.errors.dob}
                                </p>
                            ) : null}
                        </div>
                        <div id="basic-details-1">
                            <label htmlFor="gender">
                                Gender <em>*</em>
                            </label>
                            <br />
                            <select
                                id="gender"
                                name="gender"
                                onChange={PersonalFormik.handleChange}
                                onBlur={PersonalFormik.handleBlur}
                                value={PersonalFormik.values.gender}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {PersonalFormik.errors.gender &&
                            PersonalFormik.touched.gender ? (
                                <p className="form-errors">
                                    {PersonalFormik.errors.gender}
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <div className="basic-details">
                        <div id="basic-details-1">
                            <label htmlFor="marital_status">
                                Martial Status
                            </label>
                            <br />
                            <select
                                id="marital_status"
                                name="marital_status"
                                onChange={PersonalFormik.handleChange}
                                onBlur={PersonalFormik.handleBlur}
                                value={PersonalFormik.values.marital_status}
                            >
                                <option value="Unmarried">Unmarried</option>
                                <option value="Married">Married</option>
                            </select>
                            {PersonalFormik.errors.marital_status &&
                            PersonalFormik.touched.marital_status ? (
                                <p className="form-errors">
                                    {PersonalFormik.errors.marital_status}
                                </p>
                            ) : null}
                        </div>
                        <div id="basic-details-1">
                            <label htmlFor="ssn">
                                Social Security (Numbers Only)
                            </label>
                            <br />
                            <input
                                id="ssn"
                                name="ssn"
                                type="number"
                                placeholder="452873"
                                onChange={PersonalFormik.handleChange}
                                onBlur={PersonalFormik.handleBlur}
                                value={PersonalFormik.values.ssn}
                            />
                            {PersonalFormik.errors.ssn &&
                            PersonalFormik.touched.ssn ? (
                                <p className="form-errors">
                                    {PersonalFormik.errors.ssn}
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <div className="basic-details">
                        <div id="basic-details-1">
                            <label htmlFor="social">Social</label>
                            <br />
                            <input
                                id="social"
                                name="social"
                                type="text"
                                placeholder="Facebook"
                                value={PersonalFormik.values.social}
                                onChange={PersonalFormik.handleChange}
                                onBlur={PersonalFormik.handleBlur}
                            />
                            {PersonalFormik.errors.social &&
                            PersonalFormik.touched.social ? (
                                <p className="form-errors">
                                    {PersonalFormik.errors.social}
                                </p>
                            ) : null}
                        </div>
                        <div id="basic-details-1">
                            <label htmlFor="kids">Kids (If Any)</label>
                            <br />
                            <input
                                id="kids"
                                name="kids"
                                type="number"
                                placeholder="0"
                                value={PersonalFormik.values.kids}
                                onChange={PersonalFormik.handleChange}
                                onBlur={PersonalFormik.handleBlur}
                            />
                            {PersonalFormik.errors.kids &&
                            PersonalFormik.touched.kids ? (
                                <p className="form-errors">
                                    {PersonalFormik.errors.kids}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div id="update-button-container">
                        <button type="submit" id="update-profile-btn">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="user-info-wrapper">
            <div id="user-img-container">
                <img
                    id="user-profile-icon"
                    src={profileIcon ? profileIcon : "/user.png"}
                    alt="icon"
                />
                <div id="upload-photo-div">
                    <h3>Upload a new photo</h3>
                    <p>
                        {selectedImage && selectedImage.name
                            ? selectedImage.name
                            : "Profile-pic.jpg"}
                    </p>
                    <input
                        type="file"
                        accept="image/*"
                        id="imageUpload"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                    />
                </div>
                <button id="change-picture" onClick={handleShowImageInput}>
                    Change Picture
                </button>
            </div>
            <div>
                <p id="change-info-label">Change Information</p>
            </div>
            {isBasicDetails ? <BasicDetails /> : <PersonalDetails />}
        </div>
    );
}

export default Profile;
