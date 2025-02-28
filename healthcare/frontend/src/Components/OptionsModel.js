import { Link, useNavigate } from "react-router-dom";
import "./All.css";

function OptionsModel({ closeModel, id }) {
    const navigate = useNavigate();

    return (
        <>
            <div id="options-model-wrapper" onClick={closeModel}></div>
            <div id="options-model">
                <Link className="options-text" to={`/user/${id}/profile`}>
                    My Profile
                </Link>
                <br />
                <Link className="options-text" to={`/user/${id}/preferences`}>
                    Preferences
                </Link>
                <br />
                <Link className="options-text" to={`/user/${id}/friends`}>
                    Friends
                </Link>
                <br />
                <Link className="options-text" to={`/user/${id}/waves`}>
                    Create Waves
                </Link>
                <br />
                <Link
                    className="options-text"
                    to={`/user/${id}/change-password`}
                >
                    Change Password
                </Link>
                <br />
                <button
                    className="options-text"
                    id="logout-btn"
                    onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login");
                    }}
                >
                    Log Out
                </button>
            </div>
        </>
    );
}

export default OptionsModel;
