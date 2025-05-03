const express = require("express");
const { createOrder, verifyPayment, getOrders, verifyToken, getOrderDetails, cancelOrder } = require("../../Controllers/OrderController/OrderController");
const OrderRoute = express.Router();

// Apply verifyToken middleware to all order routes
OrderRoute.use(verifyToken);

OrderRoute.post('/create', createOrder);
OrderRoute.post('/verify-payment', verifyPayment);
OrderRoute.get('/', getOrders);
OrderRoute.get('/:order_id', getOrderDetails);
OrderRoute.post('/:order_id/cancel', cancelOrder);

module.exports = OrderRoute;