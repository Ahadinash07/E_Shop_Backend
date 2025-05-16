const express = require('express');
const { GetAllUsers, GetUserById,  GetUserOrders, UpdateUserStatus } = require('../../Controllers/adminUserRegistrationController/CustomerController');
const AdminUserRoute = express.Router();

// User routes
AdminUserRoute.get('/users', GetAllUsers
);
AdminUserRoute.get('/users/:userId', GetUserById);
AdminUserRoute.get('/users/:userId/orders', GetUserOrders);
AdminUserRoute.put('/users/:userId/status', UpdateUserStatus);

module.exports = AdminUserRoute;