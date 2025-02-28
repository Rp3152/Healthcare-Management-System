const express = require("express");
const router = express.Router();
const db = require("../models");
const validateData = require("./Security/validateSignupData");
const { generateToken, verifyToken } = require("./Security/jwt");
const { Sequelize, Op, where } = require("sequelize");
const upload = require("./Security/fileUpload");
const waveUpload = require("./Security/waveUpload");

const users = db.users;
const waves = db.waves;
const admin = db.admin;

// Route to post admin signup details
router.post("/", async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    let isValid = validateData.validateAdminDetails(req.body);

    if (isValid.error) {
        status = 400;
        message = "Invalid Data!";
        data = isValid.error.details;
    }

    try {
        let findAdmin = await admin.findOne({
            where: { email: req.body.email.toLowerCase() },
        });
        if (findAdmin) {
            status = 409;
            message = "Email already in use!";
        } else {
            const values = {
                name: req.body.name,
                email: req.body.email.toLowerCase(),
                password: req.body.password,
            };
            let newAdmin = await admin.create(values);
            status = 200;
            message = "Successfull!";
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

// Route to approve admin login
router.post("/login", async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        let { email, password } = req.body;
        const userInfo = await admin.findOne({
            attributes: ["id"],
            where: {
                email: email.toLowerCase(),
                password: password,
                status: true,
                deletedAt: null,
            },
        });

        if (userInfo) {
            status = 200;
            message = "Successfull!";
            data = {
                id: userInfo.dataValues.id,
                token: generateToken({
                    email: email.toLowerCase(),
                    id: userInfo.dataValues.id,
                }),
            };
        } else {
            status = 401;
            message = "Invalid User!";
        }
    } catch (err) {
        status = 500;
        message = "Internal Server Error!";
    }
    res.status(status).json({
        status: status === 200 ? true : false,
        message,
        data,
    });
});

// Route to get admin name
router.get("/:id", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;
    try {
        const adminName = await admin.findByPk(req.user.id, {
            attributes: ["name"],
        });
        if (adminName.dataValues) {
            status = 200;
            message = "Data fetched successfully!";
            data = {
                name: adminName.dataValues.name,
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

// Route to get user's and wave's count
router.get("/:id/count", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;
    try {
        const totalUsers = await users.count({
            where: {
                deletedAt: null,
            },
        });
        const activeUsers = await users.count({
            where: {
                status: true,
                deletedAt: null,
            },
        });
        const inactiveUsers = await users.count({
            where: {
                status: false,
                deletedAt: null,
            },
        });
        const totalWaves = await waves.count({
            where: {
                deletedAt: null,
            },
        });

        status = 200;
        message = "Successfully fetched the counts";
        data = { totalUsers, activeUsers, inactiveUsers, totalWaves };
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

//Route to get users list
router.get("/:id/users", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        const userList = await users.findAll({
            where: {
                deletedAt: null,
            },
            attributes: [
                "id",
                "first_name",
                "last_name",
                "email",
                "phone_number",
                "status",
            ],
        });
        if (!userList || userList.length == 0) {
            status = 404;
            message = "No user found!";
            data = [];
        } else {
            data = [];
            for (let i = 0; i < userList.length; i++) {
                data.push({
                    id: userList[i].dataValues.id,
                    name: `${userList[i].dataValues.first_name} ${userList[i].dataValues.last_name}`,
                    email: userList[i].dataValues.email,
                    phoneNumber: userList[i].dataValues.phone_number,
                    status: userList[i].dataValues.status,
                });
            }
        }

        status = 200;
        message = "Users List retrieved successfully.";
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

//Route to change the user status
router.put("/:id/users", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        const result = await users.update(
            { status: req.body.status },
            {
                where: { id: req.body.id },
            }
        );
        if (result) {
            status = 200;
            message = "Status updated!";
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

//Route to delete the user
router.delete("/:id/users", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    function getCurrentDateTime() {
        let now = new Date();
        let date = `${now.getFullYear()}-${
            now.getMonth() + 1
        }-${now.getDate()}`;
        let time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        let dateTime = date + " " + time;
        return dateTime;
    }

    try {
        const result = await users.update(
            { deletedAt: getCurrentDateTime() },
            {
                where: { id: req.body.id },
            }
        );
        if (result) {
            status = 200;
            message = "User deleted!";
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

// Route to get user basic  details
router.get("/:id/users/:userId", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;
    try {
        const userInfo = await users.findByPk(req.params.userId, {
            attributes: [
                "first_name",
                "last_name",
                "email",
                "phone_number",
                "ssn",
                "city",
                "zip",
                "createdAt",
                "gender",
                "dob",
                "kids",
                "address1",
                "state",
            ],
        });
        if (userInfo.dataValues) {
            status = 200;
            message = "Data fetched successfully!";
            const formattedDate =
                userInfo.dataValues.createdAt.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });
            let formattedDob = userInfo.dataValues.dob;
            if (userInfo.dataValues.dob) {
                formattedDob = userInfo.dataValues.dob
                    .split("-")
                    .reverse()
                    .join("/");
            }

            data = {
                name: `${userInfo.dataValues.first_name}  ${userInfo.dataValues.last_name}`,
                email: userInfo.dataValues.email,
                phoneNumber: userInfo.dataValues.phone_number,
                ssn: userInfo.dataValues.ssn,
                city: userInfo.dataValues.city,
                zip: userInfo.dataValues.zip,
                createdAt: formattedDate,
                gender: userInfo.dataValues.gender,
                dob: formattedDob,
                kids: userInfo.dataValues.kids,
                address: userInfo.dataValues.address1,
                state: userInfo.dataValues.state,
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

// Route to get user all details
router.get("/:id/users/:userId/user-info", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        const userDetails = await users.findByPk(req.params.userId, {
            attributes: [
                "first_name",
                "last_name",
                "email",
                "phone_number",
                "ssn",
                "city",
                "zip",
                "gender",
                "dob",
                "kids",
                "address1",
                "address2",
                "state",
                "marital_status",
                "social",
                "profileIcon",
            ],
        });
        if (userDetails.dataValues) {
            status = 200;
            message = "User data fetched successfully!";
            data = {
                firstName: userDetails.dataValues.first_name,
                lastName: userDetails.dataValues.last_name,
                email: userDetails.dataValues.email,
                phoneNumber: userDetails.dataValues.phone_number,
                ssn: userDetails.dataValues.ssn,
                city: userDetails.dataValues.city,
                zip: userDetails.dataValues.zip,
                gender: userDetails.dataValues.gender,
                dob: userDetails.dataValues.dob,
                kids: userDetails.dataValues.kids,
                address1: userDetails.dataValues.address1,
                address2: userDetails.dataValues.address2,
                maritalStatus: userDetails.dataValues.marital_status,
                social: userDetails.dataValues.social,
                state: userDetails.dataValues.state,
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
    "/:id/users/:userId",
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
                    where: { id: req.params.userId },
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
router.put(
    "/:id/users/:userId/basic-details",
    verifyToken,
    async (req, res) => {
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
                    where: { id: req.params.userId },
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
    }
);

// Route to update user's personal details
router.put(
    "/:id/users/:userId/personal-details",
    verifyToken,
    async (req, res) => {
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
                    where: { id: req.params.userId },
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
    }
);

// Route to get wave list
router.get("/:id/waves", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        const waveList = await waves.findAll({
            attributes: [
                "id",
                "userID",
                "message",
                "image",
                "status",
                "createdAt",
            ],
            where: {
                deletedAt: null,
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

                const formattedDate = waveList[
                    i
                ].dataValues.createdAt.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });

                data.push({
                    id: waveList[i].dataValues.id,
                    message: waveList[i].dataValues.message,
                    image: waveList[i].dataValues.image
                        ? `http://127.0.0.5:3000/${waveList[i].dataValues.image}`
                        : null,
                    status: waveList[i].dataValues.status,
                    createdAt: formattedDate,
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

//Route to change the wave status
router.put("/:id/waves/:waveId", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        const result = await waves.update(
            { status: req.body.status },
            {
                where: { id: req.params.waveId },
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

//Route to delete the wave
router.delete("/:id/waves/:waveId", verifyToken, async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    function getCurrentDateTime() {
        let now = new Date();
        let date = `${now.getFullYear()}-${
            now.getMonth() + 1
        }-${now.getDate()}`;
        let time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        let dateTime = date + " " + time;
        return dateTime;
    }

    try {
        const result = await waves.update(
            { deletedAt: getCurrentDateTime() },
            {
                where: { id: req.params.waveId },
            }
        );
        if (result) {
            status = 200;
            message = "Wave deleted!";
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

// Route to update waves
router.put(
    "/:id/update-wave/:waveId",
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
            };

            let updatedWave = await waves.update(values, {
                where: {
                    id: req.params.waveId,
                },
            });

            if (updatedWave) {
                status = 200;
                message = "Wave updated!";
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

module.exports = router;
