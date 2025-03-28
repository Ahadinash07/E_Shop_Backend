const express = require('express');
const { GetCategories, AddCategory, UpdateCategory, DeleteCategory, GetCategoriesByCatId } = require('../../Controllers/CategoryController/CategoryController');
const { AddCategoryValidation, UpdateCategoryValidation } = require('../../Controllers/CategoryController/CategoryControllerValidation');
const CategoryRoute = express.Router();



CategoryRoute.get('/getCategories', GetCategories);

CategoryRoute.get('/getCategoriesByCatId/:catId', GetCategoriesByCatId);

CategoryRoute.post('/addCategory', AddCategoryValidation, AddCategory);   

CategoryRoute.put('/updateCategory', UpdateCategoryValidation, UpdateCategory);

CategoryRoute.delete('/deleteCategory/:catId', DeleteCategory);

module.exports = CategoryRoute;