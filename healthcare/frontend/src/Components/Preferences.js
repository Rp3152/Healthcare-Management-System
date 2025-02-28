import "./All.css";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Options from "./Options";

function Preferences() {
    const { id } = useParams();
    const [isUpdated, setIsUpdated] = useState(false);
    const navigate = useNavigate();

    const getPrefernceData = async () => {
        try {
            let response = await axios.get(
                `http://127.0.0.5:3000/user/${id}/preferences`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (response.data.status) {
                Formik.setValues({
                    language: response.data.data.language,
                    breakfast: response.data.data.breakfast,
                    lunch: response.data.data.lunch,
                    dinner: response.data.data.dinner,
                    wakeTime: response.data.data.wakeTime,
                    bedTime: response.data.data.bedTime,
                    weight: response.data.data.weight,
                    height: response.data.data.height,
                    bloodGlucose: response.data.data.bloodGlucose,
                    cholesterol: response.data.data.cholesterol,
                    bloodPressure: response.data.data.bloodPressure,
                    distance: response.data.data.distance,
                    systemEmails: response.data.data.systemEmails,
                    memberServiceEmails: response.data.data.memberServiceEmails,
                    sms: response.data.data.sms,
                    phoneCall: response.data.data.phoneCall,
                    post: response.data.data.post,
                });
            }
        } catch (err) {}
    };

    useEffect(() => {
        getPrefernceData();
    }, [isUpdated]);

    const postPreferences = async (values) => {
        try {
            const response = await axios.post(
                `http://127.0.0.5:3000/user/${id}/preferences`,
                values,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (response.data.status) {
                toast.success(response.data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 300,
                });
                setIsUpdated(!isUpdated);
            }
        } catch (err) {
            toast.error(err.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 300,
            });
        }
    };

    const startingValue = {
        language: "English",
        breakfast: "00:00",
        lunch: "00:00",
        dinner: "00:00",
        wakeTime: "00:00",
        bedTime: "00:00",
        weight: null,
        height: null,
        bloodGlucose: null,
        cholesterol: null,
        bloodPressure: null,
        distance: null,
        systemEmails: false,
        memberServiceEmails: false,
        sms: false,
        phoneCall: false,
        post: false,
    };

    const Formik = useFormik({
        initialValues: startingValue,
        onSubmit: (values) => {
            postPreferences(values);
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
                    <h2>Preferences</h2>
                </div>
                <div id="preferences-container">
                    <form id="preference-form" onSubmit={Formik.handleSubmit}>
                        <div id="preference-details">
                            <div id="preference-1">
                                <label htmlFor="language">Language</label>
                                <br />
                                <select
                                    id="language"
                                    name="language"
                                    onChange={Formik.handleChange}
                                    onBlur={Formik.handleBlur}
                                    value={Formik.values.language}
                                >
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi</option>
                                </select>
                            </div>
                            <div id="preference-2">
                                <label htmlFor="breakfast">Breakfast</label>
                                <br />
                                <input
                                    id="breakfast"
                                    className="breakfast"
                                    name="breakfast"
                                    type="time"
                                    onChange={Formik.handleChange}
                                    onBlur={Formik.handleBlur}
                                    value={Formik.values.breakfast}
                                />
                            </div>
                        </div>
                        <div id="preference-details">
                            <div id="preference-1">
                                <label htmlFor="lunch">Lunch</label>
                                <br />
                                <input
                                    id="lunch"
                                    className="lunch"
                                    name="lunch"
                                    type="time"
                                    onChange={Formik.handleChange}
                                    onBlur={Formik.handleBlur}
                                    value={Formik.values.lunch}
                                />
                            </div>
                            <div id="preference-2">
                                <label htmlFor="dinner">Dinner</label>
                                <br />
                                <input
                                    id="dinner"
                                    className="dinner"
                                    name="dinner"
                                    type="time"
                                    onChange={Formik.handleChange}
                                    onBlur={Formik.handleBlur}
                                    value={Formik.values.dinner}
                                />
                            </div>
                        </div>
                        <div id="preference-details">
                            <div id="preference-1">
                                <label htmlFor="wake-time">Wake Time</label>
                                <br />
                                <input
                                    id="wake-time"
                                    className="wake-time"
                                    name="wakeTime"
                                    type="time"
                                    onChange={Formik.handleChange}
                                    onBlur={Formik.handleBlur}
                                    value={Formik.values.wakeTime}
                                />
                            </div>
                            <div id="preference-2">
                                <label htmlFor="bed-time">Bed Time</label>
                                <br />
                                <input
                                    id="bed-time"
                                    className="bed-time"
                                    name="bedTime"
                                    type="time"
                                    onChange={Formik.handleChange}
                                    onBlur={Formik.handleBlur}
                                    value={Formik.values.bedTime}
                                />
                            </div>
                        </div>
                        <div id="preference-details">
                            <div id="preference-1">
                                <label htmlFor="weight">Weight</label>
                                <br />
                                <div id="radio-button">
                                    <div id="radio-button-input">
                                        <input
                                            id="weight"
                                            className="weight"
                                            name="weight"
                                            type="radio"
                                            onChange={Formik.handleChange}
                                            onBlur={Formik.handleBlur}
                                            value="Kg"
                                            checked={
                                                Formik.values.weight === "Kg"
                                            }
                                        />
                                        <p>Kg</p>
                                    </div>
                                    <div id="radio-button-input">
                                        <input
                                            id="weight"
                                            className="weight"
                                            name="weight"
                                            type="radio"
                                            onChange={Formik.handleChange}
                                            onBlur={Formik.handleBlur}
                                            value="lbs"
                                            checked={
                                                Formik.values.weight === "lbs"
                                            }
                                        />
                                        <p>lbs</p>
                                    </div>
                                </div>
                            </div>
                            <div id="preference-2">
                                <label htmlFor="height">Height</label>
                                <br />
                                <div id="radio-button">
                                    <div id="radio-button-input">
                                        <input
                                            id="height"
                                            className="height"
                                            name="height"
                                            type="radio"
                                            onChange={Formik.handleChange}
                                            onBlur={Formik.handleBlur}
                                            value="cm"
                                            checked={
                                                Formik.values.height === "cm"
                                            }
                                        />
                                        <p>cm</p>
                                    </div>
                                    <div id="radio-button-input">
                                        <input
                                            id="height"
                                            className="height"
                                            name="height"
                                            type="radio"
                                            onChange={Formik.handleChange}
                                            onBlur={Formik.handleBlur}
                                            value="ft/inches"
                                            checked={
                                                Formik.values.height ===
                                                "ft/inches"
                                            }
                                        />
                                        <p>ft/inches</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="preference-details">
                            <div id="preference-1">
                                <label htmlFor="bloodGlucose">
                                    Blood Glucose
                                </label>
                                <br />
                                <div id="radio-button">
                                    <div id="radio-button-input">
                                        <input
                                            id="glucose"
                                            className="glucose"
                                            name="bloodGlucose"
                                            type="radio"
                                            onChange={Formik.handleChange}
                                            onBlur={Formik.handleBlur}
                                            value="mmo/l"
                                            checked={
                                                Formik.values.bloodGlucose ===
                                                "mmo/l"
                                            }
                                        />
                                        <p>mmo/l</p>
                                    </div>
                                    <div id="radio-button-input">
                                        <input
                                            id="glucose"
                                            className="glucose"
                                            name="bloodGlucose"
                                            type="radio"
                                            onChange={Formik.handleChange}
                                            onBlur={Formik.handleBlur}
                                            value="mg/dl"
                                            checked={
                                                Formik.values.bloodGlucose ===
                                                "mg/dl"
                                            }
                                        />
                                        <p>mg/dl</p>
                                    </div>
                                </div>
                            </div>
                            <div id="preference-2">
                                <label htmlFor="cholesterol">Cholesterol</label>
                                <br />
                                <div id="radio-button">
                                    <div id="radio-button-input">
                                        <input
                                            id="cholesterol"
                                            className="cholesterol"
                                            name="cholesterol"
                                            type="radio"
                                            onChange={Formik.handleChange}
                                            onBlur={Formik.handleBlur}
                                            value="mmo/l"
                                            checked={
                                                Formik.values.cholesterol ===
                                                "mmo/l"
                                            }
                                        />
                                        <p>mmo/l</p>
                                    </div>
                                    <div id="radio-button-input">
                                        <input
                                            id="cholesterol"
                                            className="cholesterol"
                                            name="cholesterol"
                                            type="radio"
                                            onChange={Formik.handleChange}
                                            onBlur={Formik.handleBlur}
                                            value="mg/dl"
                                            checked={
                                                Formik.values.cholesterol ===
                                                "mg/dl"
                                            }
                                        />
                                        <p>mg/dl</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="preference-details">
                            <div id="preference-1">
                                <label htmlFor="bloodPressure">
                                    Blood Pressure
                                </label>
                                <br />
                                <div id="radio-button">
                                    <div id="radio-button-input">
                                        <input
                                            id="blood-pressure"
                                            className="blood-pressure"
                                            name="bloodPressure"
                                            type="radio"
                                            onChange={Formik.handleChange}
                                            onBlur={Formik.handleBlur}
                                            value="kPa"
                                            checked={
                                                Formik.values.bloodPressure ===
                                                "kPa"
                                            }
                                        />
                                        <p>kPa</p>
                                    </div>
                                    <div id="radio-button-input">
                                        <input
                                            id="blood-pressure"
                                            className="blood-pressure"
                                            name="bloodPressure"
                                            type="radio"
                                            onChange={Formik.handleChange}
                                            onBlur={Formik.handleBlur}
                                            value="mmHg"
                                            checked={
                                                Formik.values.bloodPressure ===
                                                "mmHg"
                                            }
                                        />
                                        <p>mmHg</p>
                                    </div>
                                </div>
                            </div>
                            <div id="preference-2">
                                <label htmlFor="distance">Distance</label>
                                <br />
                                <div id="radio-button">
                                    <div id="radio-button-input">
                                        <input
                                            id="distance"
                                            className="distance"
                                            name="distance"
                                            type="radio"
                                            onChange={Formik.handleChange}
                                            onBlur={Formik.handleBlur}
                                            value="km"
                                            checked={
                                                Formik.values.distance === "km"
                                            }
                                        />
                                        <p>km</p>
                                    </div>
                                    <div id="radio-button-input">
                                        <input
                                            id="distance"
                                            className="distance"
                                            name="distance"
                                            type="radio"
                                            onChange={Formik.handleChange}
                                            onBlur={Formik.handleBlur}
                                            value="miles"
                                            checked={
                                                Formik.values.distance ===
                                                "miles"
                                            }
                                        />
                                        <p>miles</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="communication-type">
                            <span></span>
                            <p id="communication">Communication Type</p>
                            <span></span>
                        </div>
                        <div
                            id="preference-details"
                            className="communication-details"
                        >
                            <div id="preference-1">
                                <label htmlFor="SystemEmails">
                                    System Emails
                                </label>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        name="systemEmails"
                                        onChange={Formik.handleChange}
                                        onBlur={Formik.handleBlur}
                                        checked={Formik.values.systemEmails}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div id="preference-2">
                                <label htmlFor="MemberServicesEmails">
                                    Member Services Emails
                                </label>
                                <label className="switch">
                                    <input
                                        name="memberServiceEmails"
                                        type="checkbox"
                                        onChange={Formik.handleChange}
                                        onBlur={Formik.handleBlur}
                                        checked={
                                            Formik.values.memberServiceEmails
                                        }
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                        <div
                            id="preference-details"
                            className="communication-details"
                        >
                            <div id="preference-1">
                                <label htmlFor="sms">SMS</label>
                                <label className="switch">
                                    <input
                                        name="sms"
                                        type="checkbox"
                                        onChange={Formik.handleChange}
                                        onBlur={Formik.handleBlur}
                                        checked={Formik.values.sms}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div id="preference-2">
                                <label htmlFor="phoneCall">Phone Call</label>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        name="phoneCall"
                                        onChange={Formik.handleChange}
                                        onBlur={Formik.handleBlur}
                                        checked={Formik.values.phoneCall}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                        <div
                            id="preference-details"
                            className="communication-details"
                        >
                            <div id="preference-1">
                                <label htmlFor="Post">Post</label>
                                <label className="switch">
                                    <input
                                        name="post"
                                        type="checkbox"
                                        onChange={Formik.handleChange}
                                        onBlur={Formik.handleBlur}
                                        checked={Formik.values.post}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                        <div id="button-container">
                            <button type="submit" id="update-preference-btn">
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Options />
        </div>
    );
}

export default Preferences;
