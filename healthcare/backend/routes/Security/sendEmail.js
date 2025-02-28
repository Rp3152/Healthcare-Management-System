const nodemailer = require("nodemailer");

// Create a transporter object
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "amitpandey9195@gmail.com",
        pass: "qygp ctda ttms rmep",
    },
});

// Function to generate a unique tracking link
function generateTrackingLink(userId) {
    // Replace this with your actual tracking link generation logic
    return `http://localhost:3000/?userId=${userId}`;
}

function sendTrackedEmail(recipientEmail, userId) {
    const trackingLink = generateTrackingLink(userId);
    // Create a mail object
    const mailOptions = {
        from: "amitpandey9195@gmail.com",
        to: recipientEmail,
        subject: "Email subject",
        text: "Email >>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<body",
        html: "",
    };

    // Send the mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent successfully!");
        }
    });
}

const recipientEmail = "pandeysaurav878@gmail.com";
const userId = 123;
sendTrackedEmail(recipientEmail, userId);
