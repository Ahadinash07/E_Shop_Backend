const express = require('express');
const { AddRetailerProfileDetailsController, getRetailerProfileDetails, getRetailerDetailsById, updateRetailerProfileDetails } = require('../../Controllers/RetailerProfileController/RetailerProfileController');
const RetailerProfileRoute = express.Router();

RetailerProfileRoute.post('/add_retailer_profile', AddRetailerProfileDetailsController);

RetailerProfileRoute.get('/get_retailer_profile/:retailerId', getRetailerProfileDetails);

RetailerProfileRoute.get('/get_retailer_profile_by_id/:retailerId', getRetailerDetailsById);

RetailerProfileRoute.put('/update_retailer_profile', updateRetailerProfileDetails);

module.exports = RetailerProfileRoute;