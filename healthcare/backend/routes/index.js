const express = require("express");
const router = express.Router();
const db = require("../models");
const validateData = require("./Security/validateSignupData");
const { generateToken } = require("./Security/jwt");

const users = db.users;
const friends = db.friends;

router.post("/", async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    let isValid = validateData.validateSignupData(req.body);

    if (isValid.error) {
        status = 400;
        message = "Invalid Data";
        data = isValid.error.details;
    }

    try {
        let foundUser = await users.findOne({
            where: { email: req.body.email },
        });
        if (foundUser) {
            status = 400;
            message = "Email already in use!";
        } else {
            let newUser = await users.create(req.body);
            status = 200;
            message = "Successfull!";

            try {
                let isInvited = await friends.findOne({
                    where: { inviteEmail: req.body.email },
                });
                if (isInvited) {
                    let updateStatus = await friends.update(
                        { status: true },
                        {
                            where: { inviteEmail: req.body.email },
                        }
                    );
                }
            } catch (err) {}
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

router.post("/login", async (req, res) => {
    let status = null;
    let message = null;
    let data = null;

    try {
        let { email, password } = req.body;
        const userInfo = await users.findAll({
            where: {
                email: email,
                password: password,
                status: true,
                deletedAt: null,
            },
        });
        if (userInfo.length > 0) {
            status = 200;
            message = "Successfull!";
            data = {
                id: userInfo[0].dataValues.id,
                token: generateToken({
                    email: userInfo[0].dataValues.email,
                    id: userInfo[0].dataValues.id,
                    firstName: userInfo[0].dataValues.firstName,
                    lastName: userInfo[0].dataValues.lastName,
                    phone_number: userInfo[0].dataValues.phone_number,
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

module.exports = router;
