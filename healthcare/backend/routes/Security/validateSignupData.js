const Joi = require("joi");

function validateSignupData(data) {
    const schema = Joi.object({
        first_name: Joi.string().min(2).max(30).required(),
        last_name: Joi.string().min(2).max(30),
        email: Joi.string().email().required(),
        phone_number: Joi.string()
            .pattern(new RegExp(/^[6-9]\d{9}$/))
            .required()
            .messages({
                "string.pattern.base": "Invalid phone number!",
                "any.required": "Phone number is required!",
            }),
        password: Joi.string()
            .min(4)
            .max(30)
            .pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w]).*$/)
            .message(
                "Password must include a number, lowercase and uppercase letter, and a symbol"
            )
            .required(),
    }).options({ abortEarly: false });

    return schema.validate(data);
}

function validatePassword(data) {
    const schema = Joi.object({
        password: Joi.string()
            .min(4)
            .max(30)
            .pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w]).*$/)
            .message(
                "Password must include a number, lowercase and uppercase letter, and a symbol"
            )
            .required(),
        old_password: Joi.string(),
    }).options({ abortEarly: false });

    return schema.validate(data);
}

function validateBasicDetails(data) {
    const schema = Joi.object({
        first_name: Joi.string().min(2).max(30).required().messages({
            "string.min": "Minimum 2 characters!",
            "string.max": "Maximum 30 characters!",
            "any.required": "Required!",
        }),
        last_name: Joi.string().max(30).allow(null, "").messages({
            "string.max": "Maximum 30 characters!",
        }),
        email: Joi.string().email().required().messages({
            "string.email": "Invalid email!",
            "any.required": "Required!",
        }),
        ssn: Joi.number()
            .integer()
            .min(100000)
            .max(999999)
            .allow(null, "")
            .messages({
                "number.base": "Invalid security number!",
                "number.integer": "Invalid security number!",
                "number.min": "Invalid security number!",
                "number.max": "Invalid security number!",
            }),
        phone_number: Joi.string()
            .pattern(/^[6-9]\d{9}$/)
            .allow(null, "")
            .messages({
                "string.pattern.base": "Invalid phone number!",
            }),
        address1: Joi.string().min(2).max(100).required().messages({
            "string.min": "Minimum 2 characters!",
            "string.max": "Maximum 100 characters!",
            "any.required": "Required!",
        }),
        address2: Joi.string().max(100).allow(null, "").messages({
            "string.max": "Maximum 100 characters!",
        }),
        city: Joi.string().min(1).max(30).required().messages({
            "string.min": "Minimum 1 characters!",
            "string.max": "Maximum 30 characters!",
            "any.required": "Required!",
        }),
        state: Joi.string().min(1).max(30).required().messages({
            "string.min": "Minimum 1 characters!",
            "string.max": "Maximum 30 characters!",
            "any.required": "Required!",
        }),
        zip: Joi.number().integer().positive().max(999999).required().messages({
            "number.integer": "Invalid Zip code!",
            "number.positive": "Invalid Zip code!",
            "number.max": "Length cannot be greater than 6!",
            "any.required": "Required!",
        }),
    }).options({ abortEarly: false });
    return schema.validate(data);
}

function validatePersonalDetails(data) {
    const schema = Joi.object({
        dob: Joi.date().required(),
        gender: Joi.string().required(),
        marital_status: Joi.string().allow(null, ""),
        ssn: Joi.number()
            .integer()
            .min(100000)
            .max(999999)
            .allow(null, "")
            .messages({
                "number.base": "Invalid security number!",
                "number.integer": "Invalid security number!",
                "number.min": "Invalid security number!",
                "number.max": "Invalid security number!",
            }),
        social: Joi.string().max(50).allow(null, ""),
        kids: Joi.number().integer().min(0, "Invalid detail!").allow(null, ""),
    }).options({ abortEarly: false });
    return schema.validate(data);
}

function validateInviteRequest(data) {
    const schema = Joi.object({
        inviteEmail: Joi.string().email().required(),
        inviteMessage: Joi.string().min(1).max(50).required(),
        inviteName: Joi.string().min(2).max(50).required(),
    }).options({ abortEarly: false });
    return schema.validate(data);
}

function validateAdminDetails(data) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(60).required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            .min(4)
            .max(30)
            .pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w]).*$/)
            .required(),
        confirm_password: Joi.string().valid(Joi.ref("password")).required(),
    }).options({ abortEarly: false });
    return schema.validate(data);
}

module.exports = {
    validateSignupData,
    validatePassword,
    validateBasicDetails,
    validatePersonalDetails,
    validateInviteRequest,
    validateAdminDetails,
};
