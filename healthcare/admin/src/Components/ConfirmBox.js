import "./confirmBox.css";

function ConfirmBox({ closeModel, waveId, deleteWave, userId, deleteUser }) {
    return (
        <>
            <div id="confirm-model-wrapper" onClick={closeModel}></div>
            <div id="confirm-model">
                <div id="confirm-box-container">
                    <svg
                        id="close-model-icon"
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
                    <div id="confirm-message">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={102}
                            height={102}
                            viewBox="0 0 26 26"
                        >
                            <path
                                fill="#ff0000"
                                d="M23.633 5.028a1.074 1.074 0 0 0-.777-.366c-2.295-.06-5.199-2.514-7.119-3.477C14.551.592 13.769.201 13.18.098a1.19 1.19 0 0 0-.359.001c-.589.103-1.372.494-2.556 1.087c-1.921.962-4.825 3.417-7.121 3.476c-.295.008-.577.14-.777.366a1.167 1.167 0 0 0-.291.834c.494 10.023 4.088 16.226 10.396 19.831c.164.093.346.141.528.141s.364-.048.528-.141c6.308-3.605 9.902-9.808 10.396-19.831a1.167 1.167 0 0 0-.291-.834m-6.576 11.056l-.974.973a.46.46 0 0 1-.649 0L13 14.623l-2.434 2.434a.458.458 0 0 1-.649-.002l-.975-.971a.462.462 0 0 1 0-.65l2.434-2.433l-2.434-2.434a.46.46 0 0 1 0-.648l.974-.974a.456.456 0 0 1 .649 0L13 11.379l2.434-2.434a.455.455 0 0 1 .648 0l.975.972a.462.462 0 0 1 0 .65l-2.434 2.434l2.434 2.433a.464.464 0 0 1 0 .65"
                            ></path>
                        </svg>
                        <h2>Are you sure you want to delete?</h2>
                        <p>You will not be able to recover them afterwards</p>
                        <div id="button-container">
                            <button
                                type="submit"
                                id="confirm-btn"
                                onClick={() => {
                                    closeModel();
                                    if (waveId) {
                                        deleteWave(waveId);
                                    } else {
                                        deleteUser(userId);
                                    }
                                }}
                            >
                                Confirm
                            </button>
                            <br />
                            <button
                                type="submit"
                                id="cancel-btn"
                                onClick={() => {
                                    closeModel();
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ConfirmBox;
