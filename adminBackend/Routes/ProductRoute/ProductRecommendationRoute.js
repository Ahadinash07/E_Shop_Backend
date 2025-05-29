const express = require('express');
const { GetProductRecommendations, ProcessDialogflowQuery } = require('../../Controllers/ProductController/ProductRecommendationController');
const ProductRecommendationRoute = express.Router();


ProductRecommendationRoute.get('/recommendations', GetProductRecommendations);

ProductRecommendationRoute.post('/dialogflow', ProcessDialogflowQuery);

module.exports = ProductRecommendationRoute;