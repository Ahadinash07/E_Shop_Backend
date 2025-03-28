const joi = require('joi');

const adminUserRegistrationValidation = (req, res, next) => {
    const schema = joi.object({
        userId: joi.string().required(),
        userName: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        Register_at: joi.date(),
        status: joi.string()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

const adminUserLoginValidation = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}


const adminUserLogoutValidation = (req, res, next) => {
    const schema = joi.object({
        userId: joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

const adminUserUpdateValidation = (req, res, next) => {
    const schema = joi.object({
        userId: joi.string().required(),
        userName: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

const adminUserUpdatePasswordValidation = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}


const updateUserAdminStatusValidation = (req, res, next) => {
    const schema = joi.object({
        userId: joi.string().required(),
        status: joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}


module.exports = { adminUserRegistrationValidation, adminUserLoginValidation, adminUserLogoutValidation, adminUserUpdateValidation, adminUserUpdatePasswordValidation, updateUserAdminStatusValidation }