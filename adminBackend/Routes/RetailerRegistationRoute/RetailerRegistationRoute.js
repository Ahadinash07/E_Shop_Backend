const express = require('express');
const { RetailerRegistationController, RetailerLoginController, RetailerLogoutController, RetailerUpdateController, RetailerUpdatePasswordController, RetailerDeleteController, getRetailerDetails, RetailerUpdateStatusController, getRetailerOrders, updateOrderStatus, updateOrderTracking, verifyRetailer, GetCustomersController, GetDashboardDataController, GetOrdersController, GetRetailerInventoryController } = require('../../Controllers/RetailerRegistationController/RetailerRegistationController');
const { authenticateRetailer } = require('../../middleware/auth');
const RetailerregisterRoute = express.Router();

RetailerregisterRoute.post('/retailer_registration', RetailerRegistationController);

RetailerregisterRoute.post('/retailer_login', RetailerLoginController);

RetailerregisterRoute.get('/retailer_profile/:retailerId', getRetailerDetails);

RetailerregisterRoute.post('/retailer_logout', RetailerLogoutController);

RetailerregisterRoute.put('/retailer_update/:retailerId', RetailerUpdateController);

RetailerregisterRoute.put('/retailer_update_password/:retailerId', RetailerUpdatePasswordController);

RetailerregisterRoute.delete('/retailer_delete/:retailerId', RetailerDeleteController);

RetailerregisterRoute.put('/retailer_update_status/:retailerId', RetailerUpdateStatusController);


RetailerregisterRoute.get('/retailer/orders', authenticateRetailer, getRetailerOrders);

RetailerregisterRoute.patch('/retailer/orders/:orderId/status', authenticateRetailer, updateOrderStatus);

RetailerregisterRoute.post('/retailer/orders/:orderId/tracking', authenticateRetailer, updateOrderTracking);

RetailerregisterRoute.get('/retailer/customers', verifyRetailer, GetCustomersController);

RetailerregisterRoute.get('/retailer/dashboard', verifyRetailer, GetDashboardDataController);

RetailerregisterRoute.get('/retailer/orders/:userId', verifyRetailer, GetOrdersController);

RetailerregisterRoute.get('/retailer/inventory', verifyRetailer, GetRetailerInventoryController);

module.exports = RetailerregisterRoute;





































// const express = require('express');
// const { RetailerRegistationController, RetailerLoginController, RetailerLogoutController, RetailerUpdateController, RetailerUpdatePasswordController, RetailerDeleteController, getRetailerDetails, RetailerUpdateStatusController } = require('../../Controllers/RetailerRegistationController/RetailerRegistationController');
// const RetailerregisterRoute = express.Router();

// RetailerregisterRoute.post('/retailer_registration', RetailerRegistationController);

// RetailerregisterRoute.post('/retailer_login', RetailerLoginController);

// RetailerregisterRoute.get('/retailer_profile/:retailerId', getRetailerDetails);

// RetailerregisterRoute.post('/retailer_logout', RetailerLogoutController);

// RetailerregisterRoute.put('/retailer_update/:retailerId', RetailerUpdateController);

// RetailerregisterRoute.put('/retailer_update_password/:retailerId', RetailerUpdatePasswordController);

// RetailerregisterRoute.delete('/retailer_delete/:retailerId', RetailerDeleteController);

// RetailerregisterRoute.put('/retailer_update_status/:retailerId', RetailerUpdateStatusController);

// module.exports = RetailerregisterRoute;