const express = require('express');
const SubCategoryRoute = express.Router();
const { GetSubCategory, GetSubCategoryById, CreateSubCategory, UpdateSubCategory, DeleteSubCategory } = require('../../Controllers/SubCategoryController/SubCategoryController');
const { AddSubCategoryValidation, UpdateSubCategoryValidation } = require('../../Controllers/SubCategoryController/SubCategoryValidation');


SubCategoryRoute.get('/subCategory', GetSubCategory);

SubCategoryRoute.get('/subCategory/:subCatId', GetSubCategoryById);

SubCategoryRoute.post('/subCategory', AddSubCategoryValidation, CreateSubCategory);

SubCategoryRoute.put('/subCategory/:subCatId', UpdateSubCategoryValidation, UpdateSubCategory);

SubCategoryRoute.delete('/delete_subCategory/:subCatId', DeleteSubCategory);


module.exports = SubCategoryRoute;