const express = require('express');
const { GetRetailerProductsController, AddProductController, authenticateToken } = require('../../Controllers/ProductController/ProductController');
const { upload } = require('../../middleware/awsmiddleware');
const ProductRoute = express.Router();

ProductRoute.post('/addProduct', upload.fields([ { name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }, ]), AddProductController );

ProductRoute.get('/getRetailerProducts/:retailerId',  GetRetailerProductsController);

module.exports = ProductRoute;