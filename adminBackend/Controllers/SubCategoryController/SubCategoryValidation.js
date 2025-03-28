const joi = require('joi');

const AddSubCategoryValidation = (req, res, next) => {
    const schema = joi.object({
        subCatName: joi.string().required(),
        catId: joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}


const UpdateSubCategoryValidation = (req, res, next) => {
    const schema = joi.object({
        subCatName: joi.string().required(),
        catId: joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}


module.exports = { AddSubCategoryValidation, UpdateSubCategoryValidation };