const joi = require('joi');

const addAdminUserProfileValidation = (req, res, next) => {
    const schema = joi.object({
        userId: joi.string().required(),
        fatherName: joi.string(),
        age: joi.number().required(),
        DoB: joi.date().required(),
        PhoneNo: joi.number().required(),
        alternateContact: joi.number(),
        address: joi.string(),
        state: joi.string(),
        city: joi.string(),
        qualification: joi.string(),
        aadharNo: joi.number(),
        pancardNo: joi.number(),
        ProfileImage: joi.string()
    });
    const { error } = schema.validate(req.body);
    if(error){
        return res.json({error: error.details[0].message});
    }
    next();
}


const updateAdminUserProfileValidation = (req, res, next) => {
    const schema = joi.object({
        fatherName: joi.string(),
        age: joi.number(),
        DoB: joi.date(),
        PhoneNo: joi.number(),
        alternateContact: joi.number(),
        address: joi.string(),
        state: joi.string(),
        city: joi.string(),
        qualification: joi.string(),
        aadharNo: joi.number(),
        pancardNo: joi.number(),
        ProfileImage: joi.string()
    });
    const { error } = schema.validate(req.body);
    if(error){
        return res.json({error: error.details[0].message});
    }
    next();
}


module.exports = { addAdminUserProfileValidation, updateAdminUserProfileValidation };