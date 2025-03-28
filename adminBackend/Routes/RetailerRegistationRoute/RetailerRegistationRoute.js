const express = require('express');
const { RetailerRegistationController, RetailerLoginController, RetailerLogoutController, RetailerUpdateController, RetailerUpdatePasswordController, RetailerDeleteController, getRetailerDetails, RetailerUpdateStatusController } = require('../../Controllers/RetailerRegistationController/RetailerRegistationController');
const RetailerregisterRoute = express.Router();

RetailerregisterRoute.post('/retailer_registration', RetailerRegistationController);

RetailerregisterRoute.post('/retailer_login', RetailerLoginController);

RetailerregisterRoute.get('/retailer_profile/:retailerId', getRetailerDetails);

RetailerregisterRoute.post('/retailer_logout', RetailerLogoutController);

RetailerregisterRoute.put('/retailer_update/:retailerId', RetailerUpdateController);

RetailerregisterRoute.put('/retailer_update_password/:retailerId', RetailerUpdatePasswordController);

RetailerregisterRoute.delete('/retailer_delete/:retailerId', RetailerDeleteController);

RetailerregisterRoute.put('/retailer_update_status/:retailerId', RetailerUpdateStatusController);

module.exports = RetailerregisterRoute;