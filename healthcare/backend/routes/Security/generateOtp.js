const generateOtp = (digit) => {
    let OTP = "";
    for (let i = 0; i < digit; i++) {
        let randomNumber = Math.floor(Math.random() * 10);
        OTP += randomNumber;
    }
    return parseInt(OTP);
};

module.exports = generateOtp;
