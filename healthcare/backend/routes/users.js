const express = require("express");
const router = express.Router();
const db = require("../models");
const validateData = require("./Security/validateSignupData");
const { verifyToken } = require("./Security/jwt");
const { Sequelize, Op } = require("sequelize");
const upload = require("./Security/fileUpload");
const waveUpload = require("./Security/waveUpload");

const users = db.users;
const preferences = db.preference;
const waves = db.waves;
const comments = db.comments;
const friends = db.friends;

//Route to fetch userName and userIcon
router.get("/:id", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;
    try {
        const userDetails = await users.findByPk(req.user.id);
        if (userDetails.dataValues) {
            status = 200;
            message = "Data fetched successfully!";
            data = {
                userName: userDetails.dataValues.first_name,
                fullName: `${userDetails.dataValues.first_name} ${userDetails.dataValues.last_name}`,
                profileIcon: userDetails.dataValues.profileIcon
                    ? `http://127.0.0.5:3000/${userDetails.dataValues.profileIcon}`
                    : null,
            };
        } else {
            status = 404;
            message = "Data not found!";
        }
    } catch (err) {
        message = "Internal server error!";
        status = 500;
    }

    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

// Router to change the password
router.put("/:id", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    const { old_password, password } = req.body;

    let isValid = validateData.validatePassword(req.body);

    if (isValid.error) {
        status = 400;
        message = "Invalid Data!";
        data = isValid.error.details;
    } else {
        try {
            const userPassword = await users.findByPk(req.user.id);

            if (userPassword.dataValues.password !== old_password) {
                status = 400;
                message = "Invalid old password!";
            } else {
                const result = await users.update(
                    { password: password },
                    {
                        where: { id: req.user.id },
                    }
                );
                if (result) {
                    status = 200;
                    message = "Password updated!";
                } else {
                    status = 400;
                    message = "Something went wrong!";
                }
            }
        } catch (err) {
            message = "Internal server error!";
            status = 500;
        }
    }
    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

// Route to get user's basic details
router.get("/:id/profile", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        const userDetails = await users.findByPk(req.user.id);
        if (userDetails.dataValues) {
            status = 200;
            message = "User data fetched successfully!";
            data = {
                first_name: userDetails.dataValues.first_name || "",
                last_name: userDetails.dataValues.last_name || "",
                email: userDetails.dataValues.email || "",
                ssn: userDetails.dataValues.ssn || null,
                phone_number: userDetails.dataValues.phone_number || "",
                address1: userDetails.dataValues.address1 || "",
                address2: userDetails.dataValues.address2 || "",
                city: userDetails.dataValues.city || "",
                state: userDetails.dataValues.state || "",
                zip: userDetails.dataValues.zip || "",
                dob: userDetails.dataValues.dob || "",
                gender: userDetails.dataValues.gender || "",
                marital_status: userDetails.dataValues.marital_status || "",
                social: userDetails.dataValues.social || "",
                kids: userDetails.dataValues.kids || null,
                profileIcon: userDetails.dataValues.profileIcon
                    ? `http://127.0.0.5:3000/${userDetails.dataValues.profileIcon}`
                    : null,
            };
        } else {
            status = 404;
            message = "Data not found!";
        }
    } catch (err) {
        message = "Internal server error!";
        status = 500;
    }

    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

// Route to update user icon
router.put(
    "/:id/icon",
    upload.single("profileIcon"),
    verifyToken,
    async (req, res) => {
        let status = null;
        let message = null;
        let data = null;

        const file = req.file;

        try {
            const result = await users.update(
                { profileIcon: file.filename || null },
                {
                    where: { id: req.user.id },
                }
            );
            if (result) {
                status = 200;
                message = "Icon updated!";
                data = {
                    profileIcon: `http://127.0.0.5:3000/${file.filename}`,
                };
            } else {
                status = 400;
                message = "Something went wrong!";
            }
        } catch (err) {
            message = "Internal server error!";
            status = 500;
        }

        res.status(status).json({
            status: status === 200 ? true : false,
            message,
            data,
        });
    }
);

// Route to update user's basic details
router.put("/:id/profile/basic-details", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    let isValid = validateData.validateBasicDetails(req.body);
    if (isValid.error) {
        status = 400;
        message =
            isValid.error && isValid.error.details[0].message
                ? isValid.error.details[0].message
                : "Invalid Data!";
        data = isValid.error.details;
    } else {
        try {
            const result = await users.update(req.body, {
                where: { id: req.user.id },
            });
            if (result) {
                status = 200;
                message = "Details updated successfully!";
            } else {
                status = 400;
                message = "Invalid or incorrect data!";
            }
        } catch (err) {
            message = "Internal server error!";
            status = 500;
        }
    }
    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

// Route to update user's personal details
router.put("/:id/profile/personal-details", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    let isValid = validateData.validatePersonalDetails(req.body);
    if (isValid.error) {
        status = 400;
        message = "Invalid Data!";
        data = isValid.error.details;
    } else {
        try {
            const result = await users.update(req.body, {
                where: { id: req.user.id },
            });
            if (result) {
                status = 200;
                message = "Details updated successfully!";
            } else {
                status = 400;
                message = "Invalid or incorrect data!";
            }
        } catch (err) {
            message = "Internal server error!";
            status = 500;
        }
    }
    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

// Route to get user's preference details
router.get("/:id/preferences", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        const preferenceDetails = await preferences.findOne({
            where: { userID: req.user.id },
        });

        if (preferenceDetails && preferenceDetails.dataValues) {
            status = 200;
            message = "Prefernce data fetched successfully!";
            data = {
                language: preferenceDetails.dataValues.language,
                breakfast: preferenceDetails.dataValues.breakfast,
                lunch: preferenceDetails.dataValues.lunch,
                dinner: preferenceDetails.dataValues.dinner,
                wakeTime: preferenceDetails.dataValues.wakeTime,
                bedTime: preferenceDetails.dataValues.bedTime,
                weight: preferenceDetails.dataValues.weight,
                height: preferenceDetails.dataValues.height,
                bloodGlucose: preferenceDetails.dataValues.bloodGlucose,
                cholesterol: preferenceDetails.dataValues.cholesterol,
                bloodPressure: preferenceDetails.dataValues.bloodPressure,
                distance: preferenceDetails.dataValues.distance,
                systemEmails: preferenceDetails.dataValues.systemEmails,
                memberServiceEmails:
                    preferenceDetails.dataValues.memberServiceEmails,
                sms: preferenceDetails.dataValues.sms,
                phoneCall: preferenceDetails.dataValues.phoneCall,
                post: preferenceDetails.dataValues.post,
            };
        } else {
            status = 404;
            message = "Preference data not found!";
        }
    } catch (err) {
        message = "Internal server error!";
        status = 500;
    }

    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

// Route to post user's preference details
router.post("/:id/preferences", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        const preferenceDetails = await preferences.findOne({
            where: { userID: req.user.id },
        });

        const values = ({
            language,
            breakfast,
            lunch,
            dinner,
            wakeTime,
            bedTime,
            weight,
            height,
            bloodGlucose,
            cholesterol,
            bloodPressure,
            distance,
            systemEmails,
            memberServiceEmail,
            sms,
            phoneCall,
            post,
        } = req.body);

        const dataValues = { userId: req.user.id, ...values };

        if (!preferenceDetails) {
            const result = await preferences.create(dataValues, {
                where: { userID: req.user.id },
            });
            if (result) {
                status = 200;
                message = "Data Saved successfully!";
            } else {
                status = 400;
                message = "Invalid or incorrect data!";
            }
        } else {
            try {
                const result = await preferences.update(dataValues, {
                    where: { userId: req.user.id },
                });
                if (result) {
                    status = 200;
                    message = "Data updated successfully!";
                } else {
                    status = 400;
                    message = "Invalid or incorrect data!";
                }
            } catch (err) {
                message = "Internal server error!";
                status = 500;
            }
        }
    } catch (err) {
        message = "Internal server error!";
        status = 500;
    }

    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

// Route to post waves
router.post(
    "/:id/waves",
    verifyToken,
    waveUpload.single("image"),
    async (req, res) => {
        let status = null;
        let message = null;
        let data = null;

        try {
            const values = {
                image: req.file && req.file.filename,
                message: req.body.message,
                userId: req.user.id,
            };

            let newWave = await waves.create(values);
            if (newWave) {
                status = 200;
                message = "Wave posted!";
            } else {
                status = 400;
                message = "Something is wrong!";
            }
        } catch (err) {
            message = "Internal server error!";
            status = 500;
        }
        res.status(status).json({
            status: status === 200 ? true : false,
            message,
            data,
        });
    }
);

// Route to get posted wave lists
router.get("/:id/waves", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        const waveList = await waves.findAll({
            where: { userID: req.user.id, deletedAt: null },
        });

        if (waveList) {
            status = 200;
            message = "Wave list fetched successfully!";
            data = [];
            for (let i = 0; i < waveList.length; i++) {
                data.push({
                    id: waveList[i].dataValues.id,
                    message: waveList[i].dataValues.message,
                    status: waveList[i].dataValues.status,
                });
            }
        } else {
            status = 404;
            message = "No waves!";
        }
    } catch (err) {
        message = "Internal server error!";
        status = 500;
    }

    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

//Route to change the wave status
router.put("/:id/waves", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        const result = await waves.update(
            { status: req.body.status },
            {
                where: { id: req.body.id },
            }
        );
        if (result) {
            status = 200;
            message = "Status changed!";
        } else {
            status = 400;
            message = "Something went wrong!";
        }
    } catch (err) {
        message = "Internal server error!";
        status = 500;
    }

    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

// Route to get all wave lists
router.get("/:id/wave-list", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        const waveList = await waves.findAll({
            attributes: ["id", "userID", "message", "image"],
            where: {
                deletedAt: null,
                status: true,
            },
            order: [["id", "DESC"]],
        });

        if (waveList) {
            status = 200;
            message = "Wave list fetched successfully!";
            data = [];
            for (let i = 0; i < waveList.length; i++) {
                const userDetails = await users.findByPk(
                    waveList[i].dataValues.userID,
                    {
                        attributes: ["first_name", "last_name", "profileIcon"],
                    }
                );

                data.push({
                    id: waveList[i].dataValues.id,
                    message: waveList[i].dataValues.message,
                    image: waveList[i].dataValues.image
                        ? `http://127.0.0.5:3000/${waveList[i].dataValues.image}`
                        : null,
                    firstName: userDetails.dataValues.first_name,
                    lastName: userDetails.dataValues.last_name,
                    profileIcon: userDetails.dataValues.profileIcon
                        ? `http://127.0.0.5:3000/${userDetails.dataValues.profileIcon}`
                        : null,
                });
            }
        } else {
            status = 404;
            message = "No waves!";
        }
    } catch (err) {
        message = "Internal server error!";
        status = 500;
    }

    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

// Route to get all comment lists
router.get("/:waveId/waves/comments", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        const commentsList = await comments.findAll({
            attributes: ["id", "commenterId", "commenterFirstName", "comment"],
            where: {
                waveId: req.params.waveId,
                deletedAt: null,
                status: true,
            },
            order: [["id", "DESC"]],
        });

        if (commentsList) {
            status = 200;
            message = "Comments fetched successfully!";
            data = [];
            for (let i = 0; i < commentsList.length; i++) {
                data.push({
                    id: commentsList[i].dataValues.id,
                    firstName: commentsList[i].dataValues.commenterFirstName,
                    comment: commentsList[i].dataValues.comment,
                    isSameUser:
                        commentsList[i].dataValues.commenterId === req.user.id
                            ? true
                            : false,
                });
            }
        } else {
            status = 404;
            message = "No comments!";
        }
    } catch (err) {
        message = "Internal server error!";
        status = 500;
    }

    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

// Route to post comment
router.post("/:id/waves/comments", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        const userDetails = await users.findByPk(req.user.id, {
            attributes: ["first_name", "last_name"],
        });
        const values = {
            waveId: req.body.waveId,
            comment: req.body.comment,
            commenterId: req.user.id,
            commenterFirstName: userDetails.dataValues.first_name,
            commenterLastName: userDetails.dataValues.last_name,
        };

        let newWave = await comments.create(values);
        if (newWave) {
            status = 200;
            message = "Comment posted!";
        } else {
            status = 400;
            message = "Something is wrong!";
        }
    } catch (err) {
        message = "Internal server error!";
        status = 500;
    }
    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

// Route to delete comment
router.delete("/:id/waves/comments", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        function getCurrentDateTime() {
            let now = new Date();
            let date = `${now.getFullYear()}-${
                now.getMonth() + 1
            }-${now.getDate()}`;
            let time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            let dateTime = date + " " + time;
            return dateTime;
        }

        const result = await comments.update(
            { deletedAt: getCurrentDateTime() },
            {
                where: { id: req.body.id },
            }
        );

        if (result) {
            status = 200;
            message = "Comment Deleted!";
        } else {
            status = 400;
            message = "Something is wrong!";
        }
    } catch (err) {
        message = "Internal server error!";
        status = 500;
    }
    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

// Route to edit comment
router.put("/:id/waves/comments", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        const result = await comments.update(
            { comment: req.body.comment },
            {
                where: { id: req.body.id },
            }
        );

        if (result) {
            status = 200;
            message = "Comment Updated!";
        } else {
            status = 400;
            message = "Something is wrong!";
        }
    } catch (err) {
        message = "Internal server error!";
        status = 500;
    }
    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

// Route to post invited user details
router.post("/:id/invite-friends", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        let isValid = validateData.validateInviteRequest(req.body);

        if (isValid.error) {
            status = 400;
            message = "Invalid request!";
            data = isValid.error.details;
        } else {
            let isInvited = await friends.findOne({
                where: {
                    inviteEmail: req.body.inviteEmail,
                    inviterId: req.user.id,
                },
            });

            if (isInvited) {
                status = 403;
                message = "Already invited!";
            } else {
                let isEmailExists = await users.findOne({
                    where: { email: req.body.inviteEmail, deletedAt: null },
                });

                const values = {
                    inviterId: req.user.id,
                    inviteEmail: req.body.inviteEmail,
                    inviteMessage: req.body.inviteMessage,
                    inviteName: req.body.inviteName,
                    status: isEmailExists ? true : false,
                };

                let invite = await friends.create(values);
                if (invite) {
                    status = 200;
                    message = "Invite sent!";
                } else {
                    status = 400;
                    message = "Something is wrong!";
                }
            }
        }
    } catch (err) {
        message = "Internal server error!";
        status = 500;
    }
    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

// Route to get invited user details
router.get("/:id/invite-friends", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        let invitedUsers = await friends.findAll({
            attributes: [
                "id",
                "inviteEmail",
                "inviteName",
                "status",
                "isAccepted",
            ],
            where: {
                inviterId: req.user.id,
                deletedAt: null,
            },
            order: [["id", "DESC"]],
        });

        if (invitedUsers) {
            data = [];
            let id = null;
            let name = "";
            let icon = null;
            let email = "";
            let isAccepted = false;

            if (invitedUsers.length > 0) {
                status = 200;
                message = "Invited user list fetched successfully!";

                for (let i = 0; i < invitedUsers.length; i++) {
                    id = invitedUsers[i].dataValues.id;
                    isAccepted = invitedUsers[i].dataValues.isAccepted;
                    email = invitedUsers[i].dataValues.inviteEmail;

                    if (invitedUsers[i].dataValues.status) {
                        const fetchActualDetail = await users.findOne({
                            attributes: [
                                "first_name",
                                "last_name",
                                "profileIcon",
                            ],
                            where: {
                                email: invitedUsers[i].dataValues.inviteEmail,
                                deletedAt: null,
                            },
                        });
                        if (fetchActualDetail) {
                            name = `${fetchActualDetail.dataValues.first_name} ${fetchActualDetail.dataValues.last_name}`;
                            icon = fetchActualDetail.dataValues.profileIcon
                                ? `http://127.0.0.5:3000/${fetchActualDetail.dataValues.profileIcon}`
                                : null;
                        } else {
                            name = invitedUsers[i].dataValues.inviteName;
                            icon = null;
                        }
                    } else {
                        name = invitedUsers[i].dataValues.inviteName;
                        icon = null;
                    }

                    data.push({
                        id,
                        name,
                        email,
                        icon,
                        isAccepted,
                    });
                }
            } else {
                status = 404;
                message = "Not invited yet!";
            }
        } else {
            message = "Something is wrong!";
            status = 500;
        }
    } catch (err) {
        message = "Internal server error!";
        status = 500;
    }
    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

// Route to get friend requests
router.get("/:id/friend-requests", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        const fetchMyMail = await users.findByPk(req.user.id, {
            attributes: ["email"],
        });
        const currentUserEmail = fetchMyMail.dataValues.email;

        let invitersId = await friends.findAll({
            attributes: ["id", "inviterId", "isAccepted"],
            where: {
                inviteEmail: currentUserEmail,
                isAccepted: false,
                deletedAt: null,
            },
            order: [["id", "DESC"]],
        });

        if (invitersId.length > 0) {
            data = [];

            for (let i = 0; i < invitersId.length; i++) {
                const fetchActualDetail = await users.findByPk(
                    invitersId[i].dataValues.inviterId,
                    {
                        attributes: [
                            "email",
                            "first_name",
                            "last_name",
                            "profileIcon",
                        ],
                    }
                );
                if (fetchActualDetail) {
                    data.push({
                        id: invitersId[i].dataValues.id,
                        inviterId: invitersId[i].dataValues.inviterId,
                        name: `${fetchActualDetail.dataValues.first_name} ${fetchActualDetail.dataValues.last_name}`,
                        email: fetchActualDetail.dataValues.email,
                        icon: fetchActualDetail.dataValues.profileIcon
                            ? `http://127.0.0.5:3000/${fetchActualDetail.dataValues.profileIcon}`
                            : null,
                        isAccepted: invitersId[i].dataValues.isAccepted,
                    });
                }
            }

            status = 200;
            message = "Request fetched successfully!";
        } else {
            data = [];
            status = 404;
            message = "Not invited yet!";
        }
    } catch (err) {
        message = "Internal server error!";
        status = 500;
    }
    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

// Route to approve friend requests
router.put("/:id/friend-requests", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        const result = await friends.update(
            { isAccepted: true },
            {
                where: { id: req.body.id },
            }
        );

        if (result) {
            status = 200;
            message = "Request accepted!";
        } else {
            status = 400;
            message = "Something is wrong!";
        }
    } catch (err) {
        message = "Internal server error!";
        status = 500;
    }
    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

// Route to get friends information
router.get("/:id/friends", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        const fetchMyMail = await users.findByPk(req.user.id, {
            attributes: ["email"],
        });
        const currentUserEmail = fetchMyMail.dataValues.email;

        let friendsInfo = await friends.findAll({
            attributes: [
                [
                    Sequelize.fn(
                        "DISTINCT",
                        Sequelize.literal('CONCAT(inviterId, ">", inviteEmail)')
                    ),
                    "uniquePair",
                ],
                "id",
            ],
            where: {
                [Op.and]: [
                    {
                        isAccepted: true,
                        deletedAt: null,
                    },
                    {
                        [Op.or]: [
                            {
                                inviterId: req.user.id,
                                inviteEmail: { [Op.ne]: currentUserEmail },
                            },
                            {
                                inviteEmail: currentUserEmail,
                                inviterId: { [Op.ne]: req.user.id },
                            },
                        ],
                    },
                ],
            },
            order: [["id", "DESC"]],
        });

        let uniquePairs = friendsInfo.map((friend) => {
            const [inviterId, inviteEmail] =
                friend.dataValues.uniquePair.split(">");

            return { inviterId, inviteEmail };
        });

        const fetchUserDetails = async (userId, email) => {
            return await users.findOne({
                attributes: [
                    "id",
                    "email",
                    "first_name",
                    "last_name",
                    "profileIcon",
                ],
                where: {
                    [userId ? "id" : "email"]: userId || email,
                    deletedAt: null,
                },
            });
        };

        if (uniquePairs.length > 0) {
            data = [];

            for (let i = 0; i < uniquePairs.length; i++) {
                if (parseInt(uniquePairs[i].inviterId) === req.user.id) {
                    const fetchActualDetail = await fetchUserDetails(
                        null,
                        uniquePairs[i].inviteEmail
                    );

                    if (fetchActualDetail) {
                        data.push({
                            friendId: fetchActualDetail.dataValues.id,
                            name: `${fetchActualDetail.dataValues.first_name} ${fetchActualDetail.dataValues.last_name}`,
                            email: fetchActualDetail.dataValues.email,
                            icon: fetchActualDetail.dataValues.profileIcon
                                ? `http://127.0.0.5:3000/${fetchActualDetail.dataValues.profileIcon}`
                                : null,
                        });
                    }
                } else if (
                    uniquePairs[i].inviteEmail.toLowerCase() ===
                    currentUserEmail.toLowerCase()
                ) {
                    const fetchActualDetail = await fetchUserDetails(
                        uniquePairs[i].inviterId,
                        null
                    );

                    if (fetchActualDetail) {
                        data.push({
                            friendId: fetchActualDetail.dataValues.id,
                            name: `${fetchActualDetail.dataValues.first_name} ${fetchActualDetail.dataValues.last_name}`,
                            email: fetchActualDetail.dataValues.email,
                            icon: fetchActualDetail.dataValues.profileIcon
                                ? `http://127.0.0.5:3000/${fetchActualDetail.dataValues.profileIcon}`
                                : null,
                        });
                    }
                }
            }
            status = 200;
            message = "Friends fetched successfully!";
            const uniqueData = data.filter((value, index, self) => {
                return (
                    self.findIndex(
                        (item) => item.friendId === value.friendId
                    ) === index
                );
            });

            data = [...uniqueData];
        } else {
            data = [];
            status = 404;
            message = "Not available!";
        }
    } catch (err) {
        message = "Internal server error!";
        status = 500;
        console.log(err);
    }

    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

// Route to get friend's all details
router.get("/:friendId/friend-details", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        const userDetails = await users.findByPk(req.params.friendId, {
            attributes: [
                "first_name",
                "last_name",
                "email",
                "phone_number",
                "gender",
                "state",
                "dob",
                "ssn",
                "address1",
                "city",
                "zip",
                "profileIcon",
            ],
        });

        if (userDetails.dataValues) {
            status = 200;
            message = "Friend details fetched successfully!";
            data = {
                name: `${userDetails.dataValues.first_name} ${userDetails.dataValues.last_name}`,
                email: userDetails.dataValues.email,
                phoneNumber: userDetails.dataValues.phone_number,
                gender: userDetails.dataValues.gender,
                state: userDetails.dataValues.state,
                dob: userDetails.dataValues.dob,
                ssn: userDetails.dataValues.ssn,
                address: userDetails.dataValues.address1,
                city: userDetails.dataValues.city,
                zip: userDetails.dataValues.zip,
                profileIcon: userDetails.dataValues.profileIcon
                    ? `http://127.0.0.5:3000/${userDetails.dataValues.profileIcon}`
                    : null,
            };
        } else {
            status = 404;
            message = "Data not found!";
        }
    } catch (err) {
        message = "Internal server error!";
        status = 500;
    }

    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

module.exports = router;
