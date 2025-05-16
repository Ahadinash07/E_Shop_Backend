const express = require('express');
const { GetAllRetailers, GetRetailerById, GetRetailerProducts, GetRetailerOrders, UpdateRetailerStatus, UpdateOrderTracking, GetOrderTracking } = require('../../Controllers/adminUserRegistrationController/RetailerController');
const AdminRetailerRoute = express.Router();


// Retailer routes
AdminRetailerRoute.get('/retailers', GetAllRetailers);
AdminRetailerRoute.get('/retailers/:retailerId', GetRetailerById);
AdminRetailerRoute.get('/retailers/:retailerId/products', GetRetailerProducts);
AdminRetailerRoute.get('/retailers/:retailerId/orders', GetRetailerOrders);
AdminRetailerRoute.put('/retailers/:retailerId/status', UpdateRetailerStatus);

// Order tracking routes
AdminRetailerRoute.post('/orders/:orderId/tracking', UpdateOrderTracking);
AdminRetailerRoute.get('/orders/:orderId/tracking', GetOrderTracking);

module.exports = AdminRetailerRoute;