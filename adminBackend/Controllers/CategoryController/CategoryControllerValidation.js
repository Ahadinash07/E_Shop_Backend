const joi = require('joi');


const AddCategoryValidation = (req, res, next) => {
    const schema = joi.object({
        catName: joi.string().required()
    });
    const result = schema.validate(req.body);
    if(result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    next();
}


const UpdateCategoryValidation = (req, res, next) => {
    const schema = joi.object({
        catId: joi.string().required(),
        catName: joi.string().required()
    });
    const result = schema.validate(req.body);
    if(result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    next();
}


module.exports = { AddCategoryValidation, UpdateCategoryValidation };