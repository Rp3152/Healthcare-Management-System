import "./waveInfo.css";

function WaveInfo({ closeModel, waveImage, waveMessage, userName, userIcon }) {
    return (
        <>
            <div id="wave-model-wrapper" onClick={closeModel}></div>
            <div id="wave-info-model">
                <div id="user-data-container">
                    <img
                        id="user-image"
                        src={userIcon ? userIcon : "/user.png"}
                        alt="icon"
                    />
                    <h3>{userName}</h3>
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
                <div id="wave-message-div">
                    <div id="wave-message">
                        <h3>Message</h3>
                        <p>{waveMessage}</p>
                    </div>
                    <span id="image-height-line"></span>
                    <div id="image">
                        <img src={waveImage} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default WaveInfo;
