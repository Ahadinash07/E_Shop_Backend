const express = require('express');
const { GetAllProducts, GetProductById, UpdateProductStatus } = require('../../Controllers/adminUserRegistrationController/ProductController');
const AdminProductRoute = express.Router();

AdminProductRoute.get('/products', GetAllProducts);
AdminProductRoute.get('/products/:productId', GetProductById);
AdminProductRoute.put('/products/:productId/status', UpdateProductStatus);

module.exports = AdminProductRoute;