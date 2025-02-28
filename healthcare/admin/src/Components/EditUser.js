import "./userInfo.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./Profile";

function EditUser({ closeModel, userId }) {
    return (
        <>
            <div id="user-model-wrapper" onClick={closeModel}></div>
            <div id="user-info-model">
                <div id="cover-color">
                    <h1>Profile</h1>
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
                <div id="user-info-container">
                    <Profile userId={userId} />
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

export default EditUser;
