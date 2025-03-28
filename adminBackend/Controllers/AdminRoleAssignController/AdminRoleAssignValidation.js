const joi = require('joi');

const addRoleAssignValidation = (req, res, next) => {
    const schema = joi.object({
        roleId: joi.string().required(),
        userId: joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}


const getRoleAssignByRoleIDValidation = (req, res, next) => {
    const schema = joi.object({
        roleId: joi.string().required()
    });
    const { error } = schema.validate(req.params);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}



module.exports = { addRoleAssignValidation, getRoleAssignByRoleIDValidation, }
