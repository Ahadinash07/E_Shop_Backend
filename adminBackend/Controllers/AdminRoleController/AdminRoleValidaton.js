const joi = require('joi');

const addAdminRoleValidation = (req, res, next) => {
    const schema = joi.object({
        roleId: joi.string().required(),
        roleName: joi.string().required()
    });
    const {error} = schema.validate(req.body);
    if(error){
        return res.json({error: error.details[0].message});
    }
    next();
}


const updateAdminRoleValidation = (req, res, next) => {
    const schema = joi.object({
        roleId: joi.string().required(),
        roleName: joi.string().required()
    });
    const {error} = schema.validate(req.body);
    if(error){
        return res.json({error: error.details[0].message});
    }
    next();
}


module.exports = {addAdminRoleValidation, updateAdminRoleValidation};